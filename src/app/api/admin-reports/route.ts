import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function ageGroup(age: string | null): string {
  const n = parseInt(age ?? "", 10);
  if (isNaN(n) || n <= 0) return "Unknown";
  if (n < 18) return "Under 18";
  if (n <= 25) return "18–25";
  if (n <= 35) return "26–35";
  if (n <= 45) return "36–45";
  if (n <= 60) return "46–60";
  return "60+";
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const supabase = createAdminClient();
    const url = new URL(req.url);
    const isDebug = url.searchParams.get("debug") === "1";

    const filterCountry = url.searchParams.get("country") || undefined;
    const filterState = url.searchParams.get("state") || undefined;
    const filterCity = url.searchParams.get("city") || undefined;
    const filterGender = url.searchParams.get("gender") || undefined;
    const filterChronotype = url.searchParams.get("chronotype") || undefined;
    const filterDateFrom = url.searchParams.get("date_from") || undefined;
    const filterDateTo = url.searchParams.get("date_to") || undefined;
    const filterOrgType = url.searchParams.get("org_type") || url.searchParams.get("orgType") || undefined;
    const filterOrgName = url.searchParams.get("org_name") || url.searchParams.get("orgName") || undefined;
    const filterAgeGroup = url.searchParams.get("age_group") || url.searchParams.get("ageGroup") || undefined;

    // ── Step 1: Get completed assessments with member + org info (start from assessments, not chronotype_results) ──
    let assessQuery = supabase
      .from("assessments")
      .select("id, member_id, organization_id, completed_at")
      .eq("status", "COMPLETED")
      .not("completed_at", "is", null);

    if (filterDateFrom) assessQuery = assessQuery.gte("completed_at", filterDateFrom);
    if (filterDateTo) assessQuery = assessQuery.lte("completed_at", filterDateTo);

    const { data: assessments, error: assessErr } = await assessQuery.limit(10000);

    if (isDebug) {
      return NextResponse.json({
        assessmentCount: assessments?.length ?? 0,
        assessError: assessErr?.message ?? null,
        sampleAssessments: (assessments ?? []).slice(0, 3),
      });
    }

    if (!assessments || assessments.length === 0) return emptyResponse();

    // ── Step 2: Get chronotype_results for these assessments ──
    const assessmentIds = assessments.map((a) => a.id);
    const { data: chronoResults, error: chronoErr } = await supabase
      .from("chronotype_results")
      .select("id, assessment_id, member_id, chronotype, confidence_score")
      .in("assessment_id", assessmentIds);

    if (!chronoResults || chronoResults.length === 0) {
      // Fallback: no chronotype results yet, but assessments exist
      return emptyResponse();
    }

    const chronoMap = new Map(chronoResults.map((r) => [r.assessment_id, r]));

    // ── Step 3: Get member and org data ──
    const memberIds = [...new Set(assessments.map((a) => a.member_id).filter(Boolean) as string[])];
    const orgIds = [...new Set(assessments.map((a) => a.organization_id).filter(Boolean) as string[])];

    const { data: members } = await supabase.from("members").select("*").in("id", memberIds);
    const memberMap = new Map((members ?? []).map((m) => [m.id, m]));

    const { data: orgs } = await supabase.from("organizations").select("*").in("id", orgIds.length > 0 ? orgIds : ["none"]);
    const orgMap = new Map((orgs ?? []).map((o) => [o.id, o]));

    // ── Step 4: Join ──
    const rows: Array<{
      chronotype: string; confidence_score: number | null;
      age: string | null; gender: string | null;
      country: string | null; state: string | null; city: string | null;
      orgName: string | null; orgType: string | null;
      completed_at: string | null; ageGroup: string;
    }> = [];

    const fc = (v: string | null | undefined) => v?.trim().toLowerCase() ?? "";
    const filterCountryLC = fc(filterCountry);
    const filterStateLC = fc(filterState);
    const filterCityLC = fc(filterCity);
    const filterGenderLC = fc(filterGender);
    const filterChronotypeLC = fc(filterChronotype);
    const filterOrgTypeLC = fc(filterOrgType);
    const filterOrgNameLC = fc(filterOrgName);
    const filterAgeGroupLC = fc(filterAgeGroup);

    for (const as of assessments) {
      const cr = as.id ? chronoMap.get(as.id) : undefined;
      if (!cr) continue;
      if (filterChronotypeLC && fc(cr.chronotype) !== filterChronotypeLC) continue;

      const mem = as.member_id ? memberMap.get(as.member_id) : undefined;
      if (!mem) continue;
      if (filterCountryLC && fc(mem.country) !== filterCountryLC) continue;
      if (filterStateLC && fc(mem.state) !== filterStateLC) continue;
      if (filterCityLC && fc(mem.city) !== filterCityLC) continue;
      if (filterGenderLC && fc(mem.gender) !== filterGenderLC) continue;

      const org = as.organization_id ? orgMap.get(as.organization_id) : undefined;
      if (filterOrgTypeLC && fc(org?.organization_type) !== filterOrgTypeLC) continue;
      if (filterOrgNameLC && fc(org?.name) !== filterOrgNameLC) continue;

      const ag = ageGroup(mem.age);
      if (filterAgeGroupLC && fc(ag) !== filterAgeGroupLC) continue;

      rows.push({
        chronotype: cr.chronotype,
        confidence_score: cr.confidence_score,
        age: mem.age,
        gender: mem.gender,
        country: mem.country,
        state: mem.state,
        city: mem.city,
        orgName: org?.name ?? null,
        orgType: org?.organization_type ?? null,
        completed_at: as.completed_at,
        ageGroup: ag,
      });
    }

    // Collect filter options — deduplicated case-insensitively, title-cased for display
    const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    const unique = <T>(items: T[], keyFn: (item: T) => string): T[] => {
      const map = new Map<string, T>();
      items.forEach((item) => { const k = keyFn(item).toLowerCase().trim(); if (!map.has(k)) map.set(k, item); });
      return Array.from(map.values()).sort((a, b) => String(a).localeCompare(String(b)));
    };
    const rawCountries = rows.map((r) => r.country?.trim()).filter(Boolean) as string[];
    const rawStates = rows.map((r) => r.state?.trim()).filter(Boolean) as string[];
    const rawCities = rows.map((r) => r.city?.trim()).filter(Boolean) as string[];
    const rawOrgTypes = rows.map((r) => r.orgType?.trim()).filter(Boolean) as string[];
    const rawOrgNames = rows.map((r) => r.orgName?.trim()).filter(Boolean) as string[];

    const filterOpts = {
      countries: unique(rawCountries, (s) => s).map(titleCase),
      states: unique(rawStates, (s) => s).map(titleCase),
      cities: unique(rawCities, (s) => s).map(titleCase),
      orgTypes: unique(rawOrgTypes, (s) => s),
      orgNames: unique(rawOrgNames, (s) => s),
    };

    if (rows.length === 0) return emptyResponse();

    // ── Breakdown computations (same as before) ──
    const locMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const loc = r.country || "Unknown";
      if (!locMap.has(loc)) locMap.set(loc, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = locMap.get(loc)!; d.total++;
      if (r.chronotype === "LARK") d.lark++; else if (r.chronotype === "EAGLE") d.eagle++; else if (r.chronotype === "OWL") d.owl++;
    });
    const locationBreakdown = Array.from(locMap.entries())
      .filter(([name]) => name !== "Unknown")
      .map(([name, d]) => ({ name, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total }))
      .sort((a, b) => b.total - a.total);

    const gMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const g = r.gender || "Other";
      if (!gMap.has(g)) gMap.set(g, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = gMap.get(g)!; d.total++;
      if (r.chronotype === "LARK") d.lark++; else if (r.chronotype === "EAGLE") d.eagle++; else if (r.chronotype === "OWL") d.owl++;
    });
    const genderBreakdown = Array.from(gMap.entries()).map(([gender, d]) => ({
      gender, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total,
    }));

    const otMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const ot = r.orgType || "Other";
      if (!otMap.has(ot)) otMap.set(ot, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = otMap.get(ot)!; d.total++;
      if (r.chronotype === "LARK") d.lark++; else if (r.chronotype === "EAGLE") d.eagle++; else if (r.chronotype === "OWL") d.owl++;
    });
    const orgTypeBreakdown = Array.from(otMap.entries())
      .map(([type, d]) => ({ type, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total }))
      .sort((a, b) => b.total - a.total);

    const oMap = new Map<string, { name: string; lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const name = r.orgName || "(No Org)";
      if (!oMap.has(name)) oMap.set(name, { name, lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = oMap.get(name)!; d.total++;
      if (r.chronotype === "LARK") d.lark++; else if (r.chronotype === "EAGLE") d.eagle++; else if (r.chronotype === "OWL") d.owl++;
    });
    const orgBreakdown = Array.from(oMap.entries())
      .filter(([name]) => name !== "(No Org)")
      .map(([, d]) => ({ name: d.name, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total }))
      .sort((a, b) => b.total - a.total);

    const hmMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const key = `${r.country || "Unknown"}|${r.gender || "Other"}`;
      if (!hmMap.has(key)) hmMap.set(key, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = hmMap.get(key)!; d.total++;
      if (r.chronotype === "LARK") d.lark++; else if (r.chronotype === "EAGLE") d.eagle++; else if (r.chronotype === "OWL") d.owl++;
    });
    const heatmap = Array.from(hmMap.entries())
      .filter(([k]) => !k.startsWith("Unknown|"))
      .map(([key, d]) => {
        const [location, gender] = key.split("|");
        let dominant = "EAGLE"; let max = d.eagle;
        if (d.lark > max) { dominant = "LARK"; max = d.lark; }
        if (d.owl > max) { dominant = "OWL"; max = d.owl; }
        return { location, gender, dominant, pct: pct(max, d.total), total: d.total };
      })
      .sort((a, b) => b.total - a.total);

    const otlMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const ot = r.orgType || "Other"; const loc = r.country || "Unknown";
      const key = `${ot}|${loc}`;
      if (!otlMap.has(key)) otlMap.set(key, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = otlMap.get(key)!; d.total++;
      if (r.chronotype === "LARK") d.lark++; else if (r.chronotype === "EAGLE") d.eagle++; else if (r.chronotype === "OWL") d.owl++;
    });
    const orgTypeLocation = Array.from(otlMap.entries())
      .filter(([k]) => !k.includes("Unknown"))
      .map(([key, d]) => {
        const [type, location] = key.split("|");
        return { type, location, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total };
      })
      .sort((a, b) => b.total - a.total);

    const ageGroups = ["Under 18", "18–25", "26–35", "36–45", "46–60", "60+"];
    const ageMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    ageGroups.forEach((g) => ageMap.set(g, { lark: 0, eagle: 0, owl: 0, total: 0 }));
    rows.forEach((r) => {
      const ag = ageGroup(r.age);
      if (!ageMap.has(ag)) return;
      const d = ageMap.get(ag)!; d.total++;
      if (r.chronotype === "LARK") d.lark++; else if (r.chronotype === "EAGLE") d.eagle++; else if (r.chronotype === "OWL") d.owl++;
    });
    const ageBreakdown = ageGroups
      .filter((g) => (ageMap.get(g)?.total ?? 0) > 0)
      .map((group) => { const d = ageMap.get(group)!; return { group, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total }; });

    const monthMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      if (!r.completed_at) return;
      const month = r.completed_at.slice(0, 7);
      if (!monthMap.has(month)) monthMap.set(month, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = monthMap.get(month)!; d.total++;
      if (r.chronotype === "LARK") d.lark++; else if (r.chronotype === "EAGLE") d.eagle++; else if (r.chronotype === "OWL") d.owl++;
    });
    const trend = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, d]) => ({ month, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total }));

    const mostOwlLocation = locationBreakdown.length > 0 ? locationBreakdown.reduce((a, b) => a.owl > b.owl ? a : b) : null;
    const mostLarkOrg = orgBreakdown.length > 0 ? orgBreakdown.reduce((a, b) => a.lark > b.lark ? a : b) : null;
    const mostBalancedOrg = orgBreakdown.length > 0
      ? orgBreakdown.map((o) => ({ ...o, diff: Math.max(o.lark, o.eagle, o.owl) - Math.min(o.lark, o.eagle, o.owl) })).reduce((a, b) => a.diff < b.diff ? a : b)
      : null;
    const highestEaglePct = orgBreakdown.length > 0 ? orgBreakdown.reduce((a, b) => a.eagle > b.eagle ? a : b) : null;
    let owlTrend: "up" | "down" | "stable" = "stable";
    if (trend.length >= 2) {
      const half = Math.ceil(trend.length / 2);
      const firstAvg = trend.slice(0, half).reduce((s, m) => s + m.owl, 0) / half;
      const secondAvg = trend.slice(half).reduce((s, m) => s + m.owl, 0) / (trend.length - half);
      if (secondAvg - firstAvg > 3) owlTrend = "up";
      else if (firstAvg - secondAvg > 3) owlTrend = "down";
    }
    const insights = { mostOwlLocation, mostLarkOrg, mostBalancedOrg, highestEaglePct, owlTrend };

    return NextResponse.json({
      rows: rows.length,
      locationBreakdown, genderBreakdown, orgTypeBreakdown, orgBreakdown,
      heatmap, orgTypeLocation, ageBreakdown, trend, insights,
      filters: {
        countries: filterOpts.countries,
        states: filterOpts.states,
        cities: filterOpts.cities,
        orgTypes: filterOpts.orgTypes,
        orgNames: filterOpts.orgNames,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

function emptyResponse() {
  return NextResponse.json({ rows: 0, locationBreakdown: [], genderBreakdown: [], orgTypeBreakdown: [], orgBreakdown: [], heatmap: [], orgTypeLocation: [], ageBreakdown: [], trend: [], insights: { mostOwlLocation: null, mostLarkOrg: null, mostBalancedOrg: null, highestEaglePct: null, owlTrend: "stable" }, filters: { countries: [], states: [], cities: [], orgTypes: [], orgNames: [] } });
}