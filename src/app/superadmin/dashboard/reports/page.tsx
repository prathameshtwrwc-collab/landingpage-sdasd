"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Bars from "@/components/charts/Bars";
import StatCard from "@/components/dashboard/StatCard";
import { BarChart3, Globe, Users, Building2, Filter, Trophy, TrendingUp, LayoutGrid, Sparkles, MapPin, Activity, Award } from "lucide-react";
import { exportCsv } from "@/components/admin/CsvExport";

type ChronoRow = { lark: number; eagle: number; owl: number; total: number };
type InsightItem = { name: string; pct?: number; lark?: number; eagle?: number; owl?: number; diff?: number };

interface ReportData {
  rows: number;
  locationBreakdown: ({ name: string } & ChronoRow)[];
  genderBreakdown: ({ gender: string } & ChronoRow)[];
  orgTypeBreakdown: ({ type: string } & ChronoRow)[];
  orgBreakdown: ({ name: string } & ChronoRow)[];
  heatmap: { location: string; gender: string; dominant: string; pct: number; total: number }[];
  orgTypeLocation: ({ type: string; location: string } & ChronoRow)[];
  insights: {
    mostOwlLocation: InsightItem | null;
    mostLarkOrg: InsightItem | null;
    mostBalancedOrg: InsightItem | null;
    highestEaglePct: InsightItem | null;
  };
  filters: { countries: string[]; states: string[]; cities: string[]; orgTypes: string[]; orgNames: string[] };
}

function StackedBar({ lark, eagle, owl, h = 24 }: { lark: number; eagle: number; owl: number; h?: number }) {
  return (
    <div className="flex rounded-full overflow-hidden" style={{ height: h, width: "100%" }}>
      {lark > 0 && <div style={{ width: `${lark}%`, background: "#f4b54d", minWidth: lark > 0 ? 2 : 0 }} title={`Lark ${lark}%`} />}
      {eagle > 0 && <div style={{ width: `${eagle}%`, background: "#354a82", minWidth: eagle > 0 ? 2 : 0 }} title={`Eagle ${eagle}%`} />}
      {owl > 0 && <div style={{ width: `${owl}%`, background: "#7B68AE", minWidth: owl > 0 ? 2 : 0 }} title={`Owl ${owl}%`} />}
    </div>
  );
}

const CHRONO_COLORS: Record<string, string> = { LARK: "#f4b54d", EAGLE: "#354a82", OWL: "#7B68AE" };
const CHRONO_EMOJI: Record<string, string> = { LARK: "\u{1F981}", EAGLE: "\u{1F985}", OWL: "\u{1F989}" };

export default function SuperAdminReportsPage() {
  const router = useRouter();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [filters, setFilters] = useState({ country: "", state: "", city: "", gender: "", orgType: "", orgName: "", chronotype: "" });

  const buildQuery = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/api/admin-reports?${params.toString()}`;
  };

  const fetchData = () => {
    setLoading(true);
    setFetchError("");
    fetch(buildQuery())
      .then((r) => r.json())
      .then((d) => { if (!d.error) { setData(d); } else { setFetchError(d.error); setData(null); } setLoading(false); })
      .catch((err) => { setFetchError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");
  const clearFilters = () => {
    setFilters({ country: "", state: "", city: "", gender: "", orgType: "", orgName: "", chronotype: "" });
    setLoading(true);
    setFetchError("");
    fetch("/api/admin-reports")
      .then((r) => r.json())
      .then((d) => { if (!d.error) { setData(d); } else { setFetchError(d.error); setData(null); } setLoading(false); })
      .catch((err) => { setFetchError(err.message); setLoading(false); });
  };

  const filterOpts = data?.filters;

  const insightCards = useMemo(() => {
    if (!data?.insights) return [];
    const i = data.insights;
    return [
      { label: "Most Owl-dominant Location", value: i.mostOwlLocation?.name ?? "—", detail: `${i.mostOwlLocation?.pct ?? 0}% Owl`, icon: <MoonIcon />, color: "#7B68AE" },
      { label: "Most Lark-dominant Organization", value: i.mostLarkOrg?.name ?? "—", detail: `${i.mostLarkOrg?.pct ?? 0}% Lark`, icon: <SunIcon />, color: "#f4b54d" },
      { label: "Most Balanced Organization", value: i.mostBalancedOrg?.name ?? "—", detail: `L:${i.mostBalancedOrg?.lark ?? 0} E:${i.mostBalancedOrg?.eagle ?? 0} O:${i.mostBalancedOrg?.owl ?? 0}`, icon: <BalanceIcon />, color: "#2E7D32" },
      { label: "Highest Eagle Percentage", value: i.highestEaglePct?.name ?? "—", detail: `${i.highestEaglePct?.pct ?? 0}% Eagle`, icon: <Award size={24} />, color: "#354a82" },
    ];
  }, [data]);

  return (
    <DashboardShell title="Chronotype Intelligence">
      <div className="flex flex-col gap-[20px]">

        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-[12px]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Reports</span>
            <h1 className="m-0 text-[20px] font-bold mt-[2px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              Demographic &amp; Organisation-Wise Chronotype Intelligence
            </h1>
            <p className="m-0 text-[13px] mt-[4px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
              {data ? `${data.rows.toLocaleString()} assessment results analyzed` : "Loading..."}
            </p>
          </div>
          <button type="button" onClick={() => router.push("/superadmin/dashboard")}
            className="flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer"
            style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
          {data && (
            <button type="button" onClick={() => {
              const cols = [
                { key: "section", label: "Section" }, { key: "name", label: "Name" },
                { key: "lark", label: "Lark %" }, { key: "eagle", label: "Eagle %" }, { key: "owl", label: "Owl %" }, { key: "total", label: "Total" },
              ];
              const rows: Record<string, unknown>[] = [];
              data.locationBreakdown.forEach((r: Record<string, unknown>) => rows.push({ section: "Location", ...r }));
              data.genderBreakdown.forEach((r: Record<string, unknown>) => rows.push({ section: "Gender", ...r }));
              data.orgTypeBreakdown.forEach((r: Record<string, unknown>) => rows.push({ section: "Org Type", ...r }));
              data.orgBreakdown.forEach((r: Record<string, unknown>) => rows.push({ section: "Org", ...r }));
              exportCsv(rows, new Set(), cols, "full", "chronotype-intelligence");
            }}
              className="flex items-center gap-[5px] text-[12px] font-semibold px-[14px] py-[7px] rounded-xl border-none cursor-pointer transition-colors"
              style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-[80px]">
            <div className="text-center">
              <div className="w-[28px] h-[28px] mx-auto mb-[10px] rounded-full border-2 border-[#35319B] border-t-transparent animate-spin" />
              <p className="text-[13px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Loading intelligence data...</p>
            </div>
          </div>
        ) : !data ? (
          <div className="flex flex-col items-center justify-center py-[80px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
            <BarChart3 size={40} stroke="#CCC" strokeWidth={1.5} />
            <p className="m-0 mt-[12px] text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>No data available.</p>
            {fetchError && <p className="m-0 mt-[8px] text-[12px] text-center" style={{ color: "#D32F2F", fontFamily: "Poppins, sans-serif", maxWidth: "400px" }}>{fetchError}</p>}
          </div>
        ) : (
          <>
            {/* ── Filters ── */}
            <div className="rounded-[16px] p-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-[8px] mb-[14px]">
                <Filter size={16} stroke="#35319B" />
                <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Filters</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-[10px]">
                {(["country","state","city","gender","orgType","orgName","chronotype"] as const).map((key) => {
                  const opts = key === "country" ? filterOpts?.countries : key === "state" ? filterOpts?.states : key === "city" ? filterOpts?.cities : key === "orgType" ? filterOpts?.orgTypes : key === "orgName" ? filterOpts?.orgNames : key === "gender" ? ["Male","Female","Other"] : ["LARK","EAGLE","OWL"];
                  return (
                    <select key={key} value={filters[key]} onChange={(e) => setFilters((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-[10px] py-[8px] rounded-lg border text-[12px] cursor-pointer"
                      style={{ borderColor: "#E0E0E0", color: "#333", background: "#FAFAFA", fontFamily: "Poppins, sans-serif", outline: "none" }}>
                      <option value="">{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</option>
                      {opts?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  );
                })}
              </div>
              <div className="flex items-center gap-[8px] mt-[14px]">
                <button type="button" onClick={fetchData}
                  className="px-[20px] py-[8px] rounded-lg border-none cursor-pointer text-[12px] font-semibold text-white transition-colors"
                  style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}>
                  Apply Filters
                </button>
                {hasActiveFilters && (
                  <button type="button" onClick={clearFilters}
                    className="px-[16px] py-[8px] rounded-lg border cursor-pointer text-[12px] font-semibold transition-colors"
                    style={{ borderColor: "#E0E0E0", color: "#888", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
                    Clear Filters
                  </button>
                )}
                {hasActiveFilters && (
                  <span className="text-[11px] ml-[4px]" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>
                    Filters active
                  </span>
                )}
              </div>
            </div>

            {/* ── Section 1: Chronotype by Location ── */}
            <LocationSection data={data.locationBreakdown} totalRows={data.rows} />

            {/* ── Section 2: Chronotype by Gender ── */}
            <GenderSection data={data.genderBreakdown} />

            {/* ── Section 3: Chronotype by Organisation Type ── */}
            <OrgTypeSection data={data.orgTypeBreakdown} />

            {/* ── Section 4: Organisation-wise Comparison ── */}
            <OrgComparisonSection data={data.orgBreakdown} />

            {/* ── Section 5: Location × Gender Heatmap ── */}
            <HeatmapSection data={data.heatmap} />

            {/* ── Section 6: Org Type × Location ── */}
            <OrgTypeLocationSection data={data.orgTypeLocation} />

            {/* ── Section 7: Key Insights ── */}
            <InsightsSection cards={insightCards} />
          </>
        )}
      </div>
    </DashboardShell>
  );
}

/* ═══════════════════ Section Components ═══════════════════ */

function LocationSection({ data, totalRows }: { data: ({ name: string } & ChronoRow)[]; totalRows: number }) {
  return (
    <SectionCard icon={<MapPin size={18} stroke="#35319B" />} title="Chronotype by Location" subtitle="Country-level chronotype distribution">
      {data.length === 0 ? <EmptyState /> : (
        <div className="flex flex-col gap-[12px]">
          <div className="grid grid-cols-[1fr_1fr_80px_80px_80px_60px] gap-[8px] text-[11px] font-semibold uppercase px-[4px] pb-[6px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif", borderBottom: "1px solid #F0F0F0" }}>
            <span>Country</span><span>Distribution</span><span className="text-right" style={{ color: "#f4b54d" }}>Lark</span><span className="text-right" style={{ color: "#354a82" }}>Eagle</span><span className="text-right" style={{ color: "#7B68AE" }}>Owl</span><span className="text-right">Total</span>
          </div>
          {data.map((r) => (
            <div key={r.name} className="grid grid-cols-[1fr_1fr_80px_80px_80px_60px] gap-[8px] items-center py-[6px] px-[4px] rounded-lg" style={{ background: "#F8F9FF" }}>
              <span className="text-[13px] font-medium truncate" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{r.name}</span>
              <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={18} />
              <span className="text-[12px] font-semibold text-right" style={{ color: "#f4b54d", fontFamily: "Poppins, sans-serif" }}>{r.lark}%</span>
              <span className="text-[12px] font-semibold text-right" style={{ color: "#354a82", fontFamily: "Poppins, sans-serif" }}>{r.eagle}%</span>
              <span className="text-[12px] font-semibold text-right" style={{ color: "#7B68AE", fontFamily: "Poppins, sans-serif" }}>{r.owl}%</span>
              <span className="text-[12px] text-right" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{r.total}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function GenderSection({ data }: { data: ({ gender: string } & ChronoRow)[] }) {
  return (
    <SectionCard icon={<Users size={18} stroke="#35319B" />} title="Chronotype by Gender" subtitle="100% stacked comparison across gender groups">
      {data.length === 0 ? <EmptyState /> : (
        <div className="flex flex-col gap-[14px]">
          {data.map((r) => (
            <div key={r.gender}>
              <div className="flex items-center justify-between mb-[6px]">
                <span className="text-[13px] font-semibold" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{r.gender}</span>
                <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{r.total} results</span>
              </div>
              <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={28} />
              <div className="flex gap-[16px] mt-[4px] text-[11px]">
                <span style={{ color: "#f4b54d", fontFamily: "Poppins, sans-serif" }}>Lark {r.lark}%</span>
                <span style={{ color: "#354a82", fontFamily: "Poppins, sans-serif" }}>Eagle {r.eagle}%</span>
                <span style={{ color: "#7B68AE", fontFamily: "Poppins, sans-serif" }}>Owl {r.owl}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function OrgTypeSection({ data }: { data: ({ type: string } & ChronoRow)[] }) {
  return (
    <SectionCard icon={<Building2 size={18} stroke="#35319B" />} title="Chronotype by Organisation Type" subtitle="Stacked horizontal bars per organisation type">
      {data.length === 0 ? <EmptyState /> : (
        <div className="flex flex-col gap-[14px]">
          {data.map((r) => (
            <div key={r.type}>
              <div className="flex items-center justify-between mb-[6px]">
                <span className="text-[13px] font-semibold" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{r.type}</span>
                <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{r.total} results</span>
              </div>
              <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={28} />
              <div className="flex gap-[16px] mt-[4px] text-[11px]">
                <span style={{ color: "#f4b54d", fontFamily: "Poppins, sans-serif" }}>Lark {r.lark}%</span>
                <span style={{ color: "#354a82", fontFamily: "Poppins, sans-serif" }}>Eagle {r.eagle}%</span>
                <span style={{ color: "#7B68AE", fontFamily: "Poppins, sans-serif" }}>Owl {r.owl}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function OrgComparisonSection({ data }: { data: ({ name: string } & ChronoRow)[] }) {
  return (
    <SectionCard icon={<LayoutGrid size={18} stroke="#35319B" />} title="Organisation-Wise Comparison" subtitle="Lark–Eagle–Owl percentage split per organisation">
      {data.length === 0 ? <EmptyState /> : (
        <div className="flex flex-col gap-[10px]">
          <div className="grid grid-cols-[1fr_1fr_80px_80px_80px_60px] gap-[8px] text-[11px] font-semibold uppercase px-[4px] pb-[6px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif", borderBottom: "1px solid #F0F0F0" }}>
            <span>Organisation</span><span>Split</span><span className="text-right" style={{ color: "#f4b54d" }}>Lark</span><span className="text-right" style={{ color: "#354a82" }}>Eagle</span><span className="text-right" style={{ color: "#7B68AE" }}>Owl</span><span className="text-right">Total</span>
          </div>
          {data.slice(0, 30).map((r) => (
            <div key={r.name} className="grid grid-cols-[1fr_1fr_80px_80px_80px_60px] gap-[8px] items-center py-[5px] px-[4px] rounded-lg" style={{ background: "#F8F9FF" }}>
              <span className="text-[12px] font-medium truncate" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{r.name}</span>
              <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={16} />
              <span className="text-[11px] font-semibold text-right" style={{ color: "#f4b54d", fontFamily: "Poppins, sans-serif" }}>{r.lark}%</span>
              <span className="text-[11px] font-semibold text-right" style={{ color: "#354a82", fontFamily: "Poppins, sans-serif" }}>{r.eagle}%</span>
              <span className="text-[11px] font-semibold text-right" style={{ color: "#7B68AE", fontFamily: "Poppins, sans-serif" }}>{r.owl}%</span>
              <span className="text-[11px] text-right" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{r.total}</span>
            </div>
          ))}
          {data.length > 30 && (
            <p className="text-[12px] text-center mt-[8px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
              Showing top 30 of {data.length} organisations
            </p>
          )}
        </div>
      )}
    </SectionCard>
  );
}

function HeatmapSection({ data }: { data: { location: string; gender: string; dominant: string; pct: number; total: number }[] }) {
  const locations = [...new Set(data.map((d) => d.location))].slice(0, 10);
  const genders = [...new Set(data.map((d) => d.gender))];
  const filtered = data.filter((d) => locations.includes(d.location));

  return (
    <SectionCard icon={<Activity size={18} stroke="#35319B" />} title="Location × Gender Heatmap" subtitle="Dominant chronotype by gender within each location">
      {filtered.length === 0 ? <EmptyState /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
            <thead>
              <tr><th className="text-left py-[8px] pr-[12px]" style={{ color: "#AAA", fontWeight: 600, borderBottom: "1px solid #F0F0F0" }}>Location</th>
                {genders.map((g) => <th key={g} className="text-center py-[8px] px-[8px]" style={{ color: "#AAA", fontWeight: 600, borderBottom: "1px solid #F0F0F0" }}>{g}</th>)}
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc}>
                  <td className="py-[8px] pr-[12px] font-medium" style={{ color: "#333", borderBottom: "1px solid #F8F9FF" }}>{loc}</td>
                  {genders.map((g) => {
                    const cell = filtered.find((d) => d.location === loc && d.gender === g);
                    return (
                      <td key={g} className="text-center py-[8px] px-[8px]" style={{ borderBottom: "1px solid #F8F9FF" }}>
                        {cell ? (
                          <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full text-[11px] font-medium"
                            style={{ background: `${CHRONO_COLORS[cell.dominant] || "#888"}18`, color: CHRONO_COLORS[cell.dominant] || "#888", fontFamily: "Poppins, sans-serif" }}>
                            {CHRONO_EMOJI[cell.dominant] || ""} {cell.dominant} {cell.pct}%
                          </span>
                        ) : <span style={{ color: "#DDD" }}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function OrgTypeLocationSection({ data }: { data: ({ type: string; location: string } & ChronoRow)[] }) {
  return (
    <SectionCard icon={<Globe size={18} stroke="#35319B" />} title="Organisation Type × Location" subtitle="Compare chronotype distribution across organisation types in different locations">
      {data.length === 0 ? <EmptyState /> : (
        <div className="flex flex-col gap-[10px]">
          <div className="grid grid-cols-[1fr_1fr_1fr_70px_70px_70px_50px] gap-[8px] text-[11px] font-semibold uppercase px-[4px] pb-[6px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif", borderBottom: "1px solid #F0F0F0" }}>
            <span>Type</span><span>Location</span><span>Split</span><span className="text-right" style={{ color: "#f4b54d" }}>Lark</span><span className="text-right" style={{ color: "#354a82" }}>Eagle</span><span className="text-right" style={{ color: "#7B68AE" }}>Owl</span><span className="text-right">N</span>
          </div>
          {data.slice(0, 25).map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_70px_70px_70px_50px] gap-[8px] items-center py-[4px] px-[4px] rounded-lg" style={{ background: i % 2 === 0 ? "#F8F9FF" : "transparent" }}>
              <span className="text-[11px] font-medium truncate" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{r.type}</span>
              <span className="text-[11px] truncate" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{r.location}</span>
              <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={14} />
              <span className="text-[11px] font-semibold text-right" style={{ color: "#f4b54d", fontFamily: "Poppins, sans-serif" }}>{r.lark}%</span>
              <span className="text-[11px] font-semibold text-right" style={{ color: "#354a82", fontFamily: "Poppins, sans-serif" }}>{r.eagle}%</span>
              <span className="text-[11px] font-semibold text-right" style={{ color: "#7B68AE", fontFamily: "Poppins, sans-serif" }}>{r.owl}%</span>
              <span className="text-[11px] text-right" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{r.total}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function InsightsSection({ cards }: { cards: { label: string; value: string; detail: string; icon: React.ReactNode; color: string }[] }) {
  return (
    <div className="rounded-[16px] p-[22px]" style={{ background: "linear-gradient(135deg, #EEF2FF, #F5F3FF)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-[10px] mb-[18px]">
        <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.08)" }}>
          <Trophy size={18} stroke="#35319B" />
        </div>
        <h3 className="m-0 text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Key Insights</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
        {cards.map((c, i) => (
          <div key={i} className="rounded-[14px] p-[18px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-[10px] mb-[8px]">
              <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: `${c.color}14` }}>
                <span style={{ color: c.color }}>{c.icon}</span>
              </div>
              <span className="text-[11px] font-semibold" style={{ color: "#666", fontFamily: "Poppins, sans-serif" }}>{c.label}</span>
            </div>
            <p className="m-0 text-[14px] font-bold leading-[1.3]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{c.value}</p>
            <p className="m-0 mt-[4px] text-[12px]" style={{ color: c.color, fontFamily: "Poppins, sans-serif" }}>{c.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ helpers ═══════════════════ */

function SectionCard({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-[10px] mb-[14px]">
        <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
          {icon}
        </div>
        <div>
          <h3 className="m-0 text-[15px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{title}</h3>
          <p className="m-0 text-[11px] mt-[1px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-[30px]" style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}>
      <BarChart3 size={28} stroke="#CCC" strokeWidth={1.5} />
      <p className="m-0 mt-[8px] text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>No data for this category</p>
    </div>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  );
}

function BalanceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  );
}
