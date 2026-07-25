import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function pick<T extends string>(val: unknown, fallback: T): T {
  if (typeof val === "string" && val.trim()) return val.trim() as T;
  return fallback;
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const supabase = await createClient();
    const url = new URL(req.url);

    // Filters from query params
    const filterCountry = url.searchParams.get("country") || undefined;
    const filterState = url.searchParams.get("state") || undefined;
    const filterCity = url.searchParams.get("city") || undefined;
    const filterGender = url.searchParams.get("gender") || undefined;
    const filterOrgType = url.searchParams.get("org_type") || undefined;
    const filterOrgName = url.searchParams.get("org_name") || undefined;
    const filterChronotype = url.searchParams.get("chronotype") || undefined;
    const filterDateFrom = url.searchParams.get("date_from") || undefined;
    const filterDateTo = url.searchParams.get("date_to") || undefined;

    // Build base query for chronotype_results with member + org joins
    // We'll query chronotype_results with the assessment → member → org chain
    let query = supabase
      .from("chronotype_results")
      .select(`
        chronotype, confidence_score,
        assessments!inner(
          member_id,
          organization_id,
          completed_at,
          members!inner(age, gender, country, state, city),
          organizations!left(name, organization_type, country as org_country)
        )
      `);

    if (filterCountry) query = query.eq("assessments.members.country", filterCountry);
    if (filterState) query = query.eq("assessments.members.state", filterState);
    if (filterCity) query = query.eq("assessments.members.city", filterCity);
    if (filterGender) query = query.eq("assessments.members.gender", filterGender);
    if (filterChronotype) query = query.eq("chronotype", filterChronotype);
    if (filterDateFrom) query = query.gte("assessments.completed_at", filterDateFrom);

    const { data: raw } = await query.limit(5000);

    if (!raw || raw.length === 0) {
      return NextResponse.json({ rows: 0, locationBreakdown: [], genderBreakdown: [], orgTypeBreakdown: [], orgBreakdown: [], heatmap: [], orgTypeLocation: [], ageBreakdown: [], trend: [], insights: { mostOwlLocation: null, mostLarkOrg: null, mostBalancedOrg: null, highestEaglePct: null, owlTrend: "stable" }, filters: { countries: [], states: [], cities: [], orgTypes: [], orgNames: [] } });
    }

    type Row = {
      chronotype: string;
      confidence_score: number | null;
      assessments: {
        member_id: string;
        organization_id: string | null;
        completed_at: string | null;
        members: { age: string | null; gender: string | null; country: string | null; state: string | null; city: string | null };
        organizations: { name: string | null; organization_type: string | null; org_country: string | null } | null;
      };
    };

    const rows = raw as unknown as Row[];

    // Collect filter options
    const filterOpts = { countries: new Set<string>(), states: new Set<string>(), cities: new Set<string>(), orgTypes: new Set<string>(), orgNames: new Set<string>() };
    rows.forEach((r) => {
      const m = r.assessments.members;
      if (m.country) filterOpts.countries.add(m.country);
      if (m.state) filterOpts.states.add(m.state);
      if (m.city) filterOpts.cities.add(m.city);
      const org = r.assessments.organizations;
      if (org?.organization_type) filterOpts.orgTypes.add(org.organization_type);
      if (org?.name) filterOpts.orgNames.add(org.name);
    });

    // ── 1. Location breakdown ──
    const locMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const loc = r.assessments.members.country || "Unknown";
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
      const g = r.assessments.members.gender || "Other";
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
      const ot = r.assessments.organizations?.organization_type || "Other";
      if (!otMap.has(ot)) otMap.set(ot, { lark: 0, eagle: 0, owl: 0, total: 0 });
      const d = otMap.get(ot)!;
      d.total++;
      if (r.chronotype === "LARK") d.lark++;
      else if (r.chronotype === "EAGLE") d.eagle++;
      else if (r.chronotype === "OWL") d.owl++;
    });
    const orgTypeBreakdown = Array.from(otMap.entries())
      .filter(([type]) => type !== "Other" || true)
      .map(([type, d]) => ({ type, lark: pct(d.lark, d.total), eagle: pct(d.eagle, d.total), owl: pct(d.owl, d.total), total: d.total }))
      .sort((a, b) => b.total - a.total);

    // ── 4. Per-organization breakdown ──
    const oMap = new Map<string, { name: string; lark: number; eagle: number; owl: number; total: number }>();
    rows.forEach((r) => {
      const org = r.assessments.organizations;
      const name = org?.name || "(No Org)";
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
      const key = `${r.assessments.members.country || "Unknown"}|${r.assessments.members.gender || "Other"}`;
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
      const ot = r.assessments.organizations?.organization_type || "Other";
      const loc = r.assessments.members.country || "Unknown";
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
    const ageMap = new Map<string, { lark: number; eagle: number; owl: number; total: number }>();
    ageGroups.forEach((g) => ageMap.set(g, { lark: 0, eagle: 0, owl: 0, total: 0 }));
    rows.forEach((r) => {
      const ag = ageGroup(r.assessments.members.age);
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
      const date = r.assessments.completed_at;
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
