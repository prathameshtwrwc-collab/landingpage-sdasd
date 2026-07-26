import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function emptyResponse() {
  return NextResponse.json({ rows: 0, locationBreakdown: [], genderBreakdown: [], orgTypeBreakdown: [], orgBreakdown: [], heatmap: [], orgTypeLocation: [], ageBreakdown: [], trend: [], insights: { mostOwlLocation: null, mostLarkOrg: null, mostBalancedOrg: null, highestEaglePct: null, owlTrend: "stable" }, filters: { countries: [], states: [], cities: [], orgTypes: [], orgNames: [] } });
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const supabase = createAdminClient();
    const url = new URL(req.url);

    // Filters from query params
    const filterCountry = url.searchParams.get("country") || undefined;
    const filterState = url.searchParams.get("state") || undefined;
    const filterCity = url.searchParams.get("city") || undefined;
    const filterGender = url.searchParams.get("gender") || undefined;
    const filterChronotype = url.searchParams.get("chronotype") || undefined;
    const filterDateFrom = url.searchParams.get("date_from") || undefined;
    const filterDateTo = url.searchParams.get("date_to") || undefined;
    // Accept both snake_case and camelCase for org filters
    const filterOrgType = url.searchParams.get("org_type") || url.searchParams.get("orgType") || undefined;
    const filterOrgName = url.searchParams.get("org_name") || url.searchParams.get("orgName") || undefined;
    const filterAgeGroup = url.searchParams.get("age_group") || url.searchParams.get("ageGroup") || undefined;

    // Step 1: Get all completed assessment IDs with optional chronotype filter
    let chronoQuery = supabase
      .from("chronotype_results")
      .select("id, assessment_id, chronotype, confidence_score");

    if (filterChronotype) chronoQuery = chronoQuery.eq("chronotype", filterChronotype);

    const { data: chronoResults } = await chronoQuery.limit(5000);

    if (!chronoResults || chronoResults.length === 0) {
      return emptyResponse();
    }

    const assessmentIds = chronoResults.map((r) => r.assessment_id).filter(Boolean);

    // Step 2: Get assessments
    let assessQuery = supabase
      .from("assessments")
      .select("id, member_id, organization_id, completed_at")
      .in("id", assessmentIds)
      .eq("status", "COMPLETED");

    if (filterDateFrom) assessQuery = assessQuery.gte("completed_at", filterDateFrom);
    if (filterDateTo) assessQuery = assessQuery.lte("completed_at", filterDateTo);

    const { data: assessments } = await assessQuery.limit(5000);
    if (!assessments || assessments.length === 0) return emptyResponse();

    const assessMap = new Map(assessments.map((a) => [a.id, a]));
    const memberIds = assessments.map((a) => a.member_id).filter(Boolean);
    const orgIds = assessments.map((a) => a.organization_id).filter(Boolean);

    // Step 3: Get members
    let memberQuery = supabase.from("members").select("id, age, gender, country, state, city");
    if (filterCountry) memberQuery = memberQuery.eq("country", filterCountry);
    if (filterState) memberQuery = memberQuery.eq("state", filterState);
    if (filterCity) memberQuery = memberQuery.eq("city", filterCity);
    if (filterGender) memberQuery = memberQuery.eq("gender", filterGender);

    const { data: members } = await memberQuery.in("id", memberIds).limit(5000);
    const memberMap = new Map((members ?? []).map((m) => [m.id, m]));

    // Step 4: Get organizations
    let orgQuery = supabase.from("organizations").select("id, name, organization_type, country");
    const { data: orgs } = await orgQuery.in("id", orgIds.length > 0 ? orgIds : ["none"]).limit(500);
    const orgMap = new Map((orgs ?? []).map((o) => [o.id, o]));

    // ── Age group helper ──
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

    // Step 5: Join in memory
    type FlatRow = {
      chronotype: string;
      confidence_score: number | null;
      age: string | null;
      gender: string | null;
      country: string | null;
      state: string | null;
      city: string | null;
      orgName: string | null;
      orgType: string | null;
      orgCountry: string | null;
      completed_at: string | null;
      ageGroup: string;
    };

    const rows: FlatRow[] = [];
    for (const cr of chronoResults) {
      const as = cr.assessment_id ? assessMap.get(cr.assessment_id) : undefined;
      if (!as) continue;
      const mem = as.member_id ? memberMap.get(as.member_id) : undefined;
      if (!mem) continue;
      const org = as.organization_id ? orgMap.get(as.organization_id) : undefined;

      // Apply filters that couldn't be applied at DB level
      if (filterOrgType && org?.organization_type !== filterOrgType) continue;
      if (filterOrgName && org?.name !== filterOrgName) continue;

      const ageStr = mem.age ?? null;
      const ag = ageGroup(ageStr);
      if (filterAgeGroup && ag !== filterAgeGroup) continue;

      rows.push({
        chronotype: cr.chronotype,
        confidence_score: cr.confidence_score,
        age: ageStr,
        gender: mem.gender ?? null,
        country: mem.country ?? null,
        state: mem.state ?? null,
        city: mem.city ?? null,
        orgName: org?.name ?? null,
        orgType: org?.organization_type ?? null,
        orgCountry: org?.country ?? null,
        completed_at: as.completed_at,
        ageGroup: ag,
      });
    }

    // Collect filter options
    const filterOpts = { countries: new Set<string>(), states: new Set<string>(), cities: new Set<string>(), orgTypes: new Set<string>(), orgNames: new Set<string>() };
    rows.forEach((r) => {
      if (r.country) filterOpts.countries.add(r.country);
      if (r.state) filterOpts.states.add(r.state);
      if (r.city) filterOpts.cities.add(r.city);
      if (r.orgType) filterOpts.orgTypes.add(r.orgType);
      if (r.orgName) filterOpts.orgNames.add(r.orgName);
    });

    // ── 1. Location breakdown ──
    const locMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const loc = r.country || "Unknown";
      if (!locMap.has(loc)) locMap.set(loc, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = locMap.get(loc)!;
      d.total++;
      if (r.chronotype === "LARK") d.lark++;
      else if (r.chronotype === "EAGLE") d.eagle++;
      else if (r.chronotype === "OWL") d.owl++;
    });
    const locationBreakdown = Array.from(locMap.entries())
      .filter(([name]) => name !== "Unknown")
      .map(([name, d]) => ({ name, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total }))
      .sort((a, b) => b.total - a.total);

    // ── 2. Gender breakdown ──
    const gMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const g = r.gender || "Other";
      if (!gMap.has(g)) gMap.set(g, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = gMap.get(g)!;
      d.total++;
      if (r.chronotype === "LARK") d.lark++;
      else if (r.chronotype === "EAGLE") d.eagle++;
      else if (r.chronotype === "OWL") d.owl++;
    });
    const genderBreakdown = Array.from(gMap.entries()).map(([gender, d]) => ({
      gender, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total,
    }));

    // ── 3. Org type breakdown ──
    const otMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const ot = r.orgType || "Other";
      if (!otMap.has(ot)) otMap.set(ot, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = otMap.get(ot)!;
      d.total++;
      if (r.chronotype === "LARK") d.lark++;
      else if (r.chronotype === "EAGLE") d.eagle++;
      else if (r.chronotype === "OWL") d.owl++;
    });
    const orgTypeBreakdown = Array.from(otMap.entries())
      .map(([type, d]) => ({ type, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total }))
      .sort((a, b) => b.total - a.total);

    // ── 4. Per-organization breakdown ──
    const oMap = new Map<string, { name: string; lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const name = r.orgName || "(No Org)";
      if (!oMap.has(name)) oMap.set(name, { name, lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = oMap.get(name)!;
      d.total++;
      if (r.chronotype === "LARK") d.lark++;
      else if (r.chronotype === "EAGLE") d.eagle++;
      else if (r.chronotype === "OWL") d.owl++;
    });
    const orgBreakdown = Array.from(oMap.entries())
      .filter(([name]) => name !== "(No Org)")
      .map(([, d]) => ({ name: d.name, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total }))
      .sort((a, b) => b.total - a.total);

    // ── 5. Location × gender heatmap ──
    const hmMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const key = `${r.country || "Unknown"}|${r.gender || "Other"}`;
      if (!hmMap.has(key)) hmMap.set(key, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = hmMap.get(key)!;
      d.total++;
      if (r.chronotype === "LARK") d.lark++;
      else if (r.chronotype === "EAGLE") d.eagle++;
      else if (r.chronotype === "OWL") d.owl++;
    });
    const heatmap = Array.from(hmMap.entries())
      .filter(([k]) => !k.startsWith("Unknown|"))
      .map(([key, d]) => {
        const [location, gender] = key.split("|");
        let dominant = "EAGLE";
        let max = d.eagle;
        if (d.lark > max) { dominant = "LARK"; max = d.lark; }
        if (d.owl > max) { dominant = "OWL"; max = d.owl; }
        return { location, gender, dominant, pct: pct(max, d.total), total: d.total };
      })
      .sort((a, b) => b.total - a.total);

    // ── 6. Org type × location ──
    const otlMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const ot = r.orgType || "Other";
      const loc = r.country || "Unknown";
      const key = `${ot}|${loc}`;
      if (!otlMap.has(key)) otlMap.set(key, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = otlMap.get(key)!;
      d.total++;
      if (r.chronotype === "LARK") d.lark++;
      else if (r.chronotype === "EAGLE") d.eagle++;
      else if (r.chronotype === "OWL") d.owl++;
    });
    const orgTypeLocation = Array.from(otlMap.entries())
      .filter(([k]) => !k.includes("Unknown"))
      .map(([key, d]) => {
        const [type, location] = key.split("|");
        return { type, location, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total };
      })
      .sort((a, b) => b.total - a.total);

    // ── 7. Age group breakdown ──
    const ageGroups = ["Under 18", "18–25", "26–35", "36–45", "46–60", "60+"];
    const ageMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    ageGroups.forEach((g) => ageMap.set(g, { lark: 0, eagle: 0, owl: 0, total: 0 }));
    rows.forEach((r) => {
      const ag = ageGroup(r.age);
      if (!ageMap.has(ag)) return;
      const d = ageMap.get(ag)!;
      d.total++;
      if (r.chronotype === "LARK") d.lark++;
      else if (r.chronotype === "EAGLE") d.eagle++;
      else if (r.chronotype === "OWL") d.owl++;
    });
    const ageBreakdown = ageGroups
      .filter((g) => (ageMap.get(g)?.total ?? 0) > 0)
      .map((group) => {
        const d = ageMap.get(group)!;
        return { group, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total };
      });

    // ── 8. Chronotype trend over time (monthly) ──
    const monthMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const date = r.completed_at;
      if (!date) return;
      const month = date.slice(0, 7); // "YYYY-MM"
      if (!monthMap.has(month)) monthMap.set(month, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = monthMap.get(month)!;
      d.total++;
      if (r.chronotype === "LARK") d.lark++;
      else if (r.chronotype === "EAGLE") d.eagle++;
      else if (r.chronotype === "OWL") d.owl++;
    });
    const trend = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, d]) => ({
        month,
        lark: pct(d.lark, d.total),
        eagle: pct(d.eagle, d.total),
        owl: pct(d.owl, d.total),
        total: d.total,
      }));

    // ── 9. Enhanced insights ──
    const mostOwlLocation = locationBreakdown.length > 0 ? locationBreakdown.reduce((a, b) => a.owl > b.owl ? a : b) : null;
    const mostLarkOrg = orgBreakdown.length > 0 ? orgBreakdown.reduce((a, b) => a.lark > b.lark ? a : b) : null;
    const mostBalancedOrg = orgBreakdown.length > 0
      ? orgBreakdown.map((o) => ({ ...o, diff: Math.max(o.lark, o.eagle, o.owl) - Math.min(o.lark, o.eagle, o.owl) }))
          .reduce((a, b) => a.diff < b.diff ? a : b)
      : null;
    const highestEaglePct = orgBreakdown.length > 0 ? orgBreakdown.reduce((a, b) => a.eagle > b.eagle ? a : b) : null;

    // Owl trend direction
    let owlTrend: "up" | "down" | "stable" = "stable";
    if (trend.length >= 2) {
      const firstHalf = trend.slice(0, Math.ceil(trend.length / 2));
      const secondHalf = trend.slice(Math.ceil(trend.length / 2));
      const avgFirst = firstHalf.reduce((s, m) => s + m.owl, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((s, m) => s + m.owl, 0) / secondHalf.length;
      if (avgSecond - avgFirst > 3) owlTrend = "up";
      else if (avgFirst - avgSecond > 3) owlTrend = "down";
    }

    const insights = { mostOwlLocation, mostLarkOrg, mostBalancedOrg, highestEaglePct, owlTrend };

    return NextResponse.json({
      rows: rows.length,
      locationBreakdown,
      genderBreakdown,
      orgTypeBreakdown,
      orgBreakdown,
      heatmap,
      orgTypeLocation,
      ageBreakdown,
      trend,
      insights,
      filters: {
        countries: Array.from(filterOpts.countries).sort(),
        states: Array.from(filterOpts.states).sort(),
        cities: Array.from(filterOpts.cities).sort(),
        orgTypes: Array.from(filterOpts.orgTypes).sort(),
        orgNames: Array.from(filterOpts.orgNames).sort(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
