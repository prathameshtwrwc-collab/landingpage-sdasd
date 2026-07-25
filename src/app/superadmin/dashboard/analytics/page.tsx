"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { BarChart3, Globe, Users, Building2, Filter, MapPin, Award, TrendingUp, Calendar, UserCheck } from "lucide-react";
import { exportCsv } from "@/components/admin/CsvExport";

type ChronoRow = { lark: number; eagle: number; owl: number; total: number };
type InsightItem = { name: string; pct?: number; lark?: number; eagle?: number; owl?: number };

interface AnalyticsData {
  rows: number;
  locationBreakdown: ({ name: string } & ChronoRow)[];
  genderBreakdown: ({ gender: string } & ChronoRow)[];
  orgTypeBreakdown: ({ type: string } & ChronoRow)[];
  orgBreakdown: ({ name: string } & ChronoRow)[];
  heatmap: { location: string; gender: string; dominant: string; pct: number; total: number }[];
  orgTypeLocation: ({ type: string; location: string } & ChronoRow)[];
  ageBreakdown: ({ group: string } & ChronoRow)[];
  trend: ({ month: string } & ChronoRow)[];
  insights: {
    mostOwlLocation: InsightItem | null;
    mostLarkOrg: InsightItem | null;
    mostBalancedOrg: InsightItem | null;
    highestEaglePct: InsightItem | null;
    owlTrend: "up" | "down" | "stable";
  };
  filters: { countries: string[]; states: string[]; cities: string[]; orgTypes: string[]; orgNames: string[] };
}

const CHRONO_COLORS: Record<string, string> = { LARK: "#f4b54d", EAGLE: "#354a82", OWL: "#7B68AE" };
const CHRONO_EMOJI: Record<string, string> = { LARK: "\u{1F981}", EAGLE: "\u{1F985}", OWL: "\u{1F989}" };

function StackedBar({ lark, eagle, owl, h = 24 }: { lark: number; eagle: number; owl: number; h?: number }) {
  const total = lark + eagle + owl;
  if (total === 0) return <div className="rounded-full" style={{ height: h, background: "#F0F0F0", width: "100%" }} />;
  return (
    <div className="flex rounded-full overflow-hidden" style={{ height: h, width: "100%" }}>
      {lark > 0 && <div style={{ width: `${lark}%`, background: "#f4b54d", minWidth: lark > 3 ? undefined : 2 }} title={`Lark ${lark}%`} />}
      {eagle > 0 && <div style={{ width: `${eagle}%`, background: "#354a82", minWidth: eagle > 3 ? undefined : 2 }} title={`Eagle ${eagle}%`} />}
      {owl > 0 && <div style={{ width: `${owl}%`, background: "#7B68AE", minWidth: owl > 3 ? undefined : 2 }} title={`Owl ${owl}%`} />}
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ country: "", state: "", city: "", orgType: "", orgName: "", gender: "", ageGroup: "", chronotype: "" });

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    fetch(`/api/admin-reports?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);
  const fo = data?.filters;

  const insights = useMemo(() => {
    if (!data) return [];
    const g = data.insights;
    const arr: { label: string; value: string; detail: string; icon: React.ReactNode; color: string }[] = [];
    if (g.mostOwlLocation) arr.push({ label: "Highest Owl Location", value: g.mostOwlLocation.name, detail: `${g.mostOwlLocation.pct}% Owl`, icon: <MoonIcon />, color: "#7B68AE" });
    if (g.mostLarkOrg) arr.push({ label: "Most Lark Organisation", value: g.mostLarkOrg.name, detail: `${g.mostLarkOrg.pct}% Lark`, icon: <SunIcon />, color: "#f4b54d" });
    if (g.mostBalancedOrg) arr.push({ label: "Most Balanced Organisation", value: g.mostBalancedOrg.name, detail: `L:${g.mostBalancedOrg.lark} E:${g.mostBalancedOrg.eagle} O:${g.mostBalancedOrg.owl}`, icon: <BalanceIcon />, color: "#2E7D32" });
    if (g.highestEaglePct) arr.push({ label: "Highest Eagle Organisation", value: g.highestEaglePct.name, detail: `${g.highestEaglePct.pct}% Eagle`, icon: <Award size={20} />, color: "#354a82" });
    if (g.owlTrend === "up") arr.push({ label: "Owl Trend", value: "Increasing", detail: "Owl percentage rising across recent periods", icon: <TrendingUp size={20} />, color: "#D32F2F" });
    else if (g.owlTrend === "down") arr.push({ label: "Owl Trend", value: "Decreasing", detail: "Owl percentage declining across recent periods", icon: <TrendingUp size={20} />, color: "#2E7D32" });
    return arr;
  }, [data]);

  return (
    <DashboardShell title="Chronotype Analytics">
      <div className="flex flex-col gap-[20px]">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-[12px]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Analytics</span>
            <h1 className="m-0 text-[20px] font-bold mt-[2px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              Demographic Chronotype Intelligence
            </h1>
            <p className="m-0 text-[13px] mt-[4px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
              {data ? `${data.rows.toLocaleString()} assessments · ${data.locationBreakdown.length} countries` : "Deep pattern discovery across demographics"}
            </p>
          </div>
          <div className="flex items-center gap-[8px]">
            <button type="button" onClick={() => router.push("/superadmin/dashboard")}
              className="flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer"
              style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg> Back
            </button>
            {data && (
              <button type="button" onClick={() => {
                const cols = [
                  { key: "section", label: "Section" }, { key: "name", label: "Name" },
                  { key: "lark", label: "Lark %" }, { key: "eagle", label: "Eagle %" }, { key: "owl", label: "Owl %" }, { key: "total", label: "Total" },
                ];
                const rows: Record<string, unknown>[] = [];
                data.locationBreakdown.forEach((r: Record<string, unknown>) => rows.push({ section: "Location", name: r.name, ...r }));
                data.genderBreakdown.forEach((r: Record<string, unknown>) => rows.push({ section: "Gender", name: r.gender, ...r }));
                data.orgTypeBreakdown.forEach((r: Record<string, unknown>) => rows.push({ section: "Org Type", name: r.type, ...r }));
                data.orgBreakdown.forEach((r: Record<string, unknown>) => rows.push({ section: "Org", name: r.name, ...r }));
                data.ageBreakdown?.forEach((r: Record<string, unknown>) => rows.push({ section: "Age", name: r.group, ...r }));
                exportCsv(rows, new Set(), cols, "full", "analytics");
              }}
                className="flex items-center gap-[5px] text-[12px] font-semibold px-[14px] py-[7px] rounded-xl border-none cursor-pointer transition-colors"
                style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export CSV
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-[80px]">
            <div className="text-center">
              <div className="w-[28px] h-[28px] mx-auto mb-[10px] rounded-full border-2 border-[#35319B] border-t-transparent animate-spin" />
              <p className="text-[13px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Processing demographic analytics...</p>
            </div>
          </div>
        ) : !data ? (
          <div className="flex flex-col items-center justify-center py-[80px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
            <BarChart3 size={40} stroke="#CCC" strokeWidth={1.5} />
            <p className="m-0 mt-[12px] text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>No data available.</p>
          </div>
        ) : (
          <>
            {/* ── Filters ── */}
            <div className="rounded-[16px] p-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-[8px] mb-[14px]">
                <Filter size={16} stroke="#35319B" />
                <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Filters</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-[10px]">
                {[
                  { key: "country", opts: fo?.countries }, { key: "state", opts: fo?.states }, { key: "city", opts: fo?.cities },
                  { key: "orgType", opts: fo?.orgTypes, label: "Org Type" }, { key: "orgName", opts: fo?.orgNames, label: "Org Name" },
                  { key: "gender", opts: ["Male", "Female", "Other"] }, { key: "ageGroup", opts: ["Under 18", "18–25", "26–35", "36–45", "46–60", "60+"], label: "Age Group" },
                  { key: "chronotype", opts: ["LARK", "EAGLE", "OWL"] },
                ].map(({ key, opts, label }) => (
                  <select key={key} value={(filters as Record<string, string>)[key]} onChange={(e) => setFilters((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-[10px] py-[8px] rounded-lg border text-[12px] cursor-pointer"
                    style={{ borderColor: "#E0E0E0", color: "#333", background: "#FAFAFA", fontFamily: "Poppins, sans-serif", outline: "none" }}>
                    <option value="">{label || key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</option>
                    {opts?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ))}
                <button type="button" onClick={fetchData}
                  className="px-[16px] py-[8px] rounded-lg border-none cursor-pointer text-[12px] font-semibold text-white transition-colors"
                  style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}>
                  Apply
                </button>
              </div>
            </div>

            {/* ══════ Row 1: Geographic Map + Gender Comparison ══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
              <SectionCard icon={<MapPin size={18} />} title="Geographic Chronotype Distribution" subtitle="Country-level breakdown by chronotype">
                {data.locationBreakdown.length === 0 ? <EmptyState /> : (
                  <div className="flex flex-col gap-[10px]">
                    <div className="grid grid-cols-[1fr_1fr_70px_70px_70px_50px] gap-[8px] text-[11px] font-semibold uppercase px-[4px] pb-[6px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif", borderBottom: "1px solid #F0F0F0" }}>
                      <span>Country</span><span>Split</span><span className="text-right" style={{ color: "#f4b54d" }}>Lark</span><span className="text-right" style={{ color: "#354a82" }}>Eagle</span><span className="text-right" style={{ color: "#7B68AE" }}>Owl</span><span className="text-right">N</span>
                    </div>
                    {data.locationBreakdown.map((r) => (
                      <div key={r.name} className="group grid grid-cols-[1fr_1fr_70px_70px_70px_50px] gap-[8px] items-center py-[6px] px-[4px] rounded-lg cursor-default" style={{ background: "#F8F9FF" }}>
                        <span className="text-[13px] font-medium truncate" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{r.name}</span>
                        <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={20} />
                        <span className="text-[12px] font-semibold text-right" style={{ color: "#f4b54d", fontFamily: "Poppins, sans-serif" }}>{r.lark}%</span>
                        <span className="text-[12px] font-semibold text-right" style={{ color: "#354a82", fontFamily: "Poppins, sans-serif" }}>{r.eagle}%</span>
                        <span className="text-[12px] font-semibold text-right" style={{ color: "#7B68AE", fontFamily: "Poppins, sans-serif" }}>{r.owl}%</span>
                        <span className="text-[12px] text-right" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{r.total}</span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard icon={<Users size={18} />} title="Chronotype by Gender" subtitle="100% stacked comparison across gender groups">
                {data.genderBreakdown.length === 0 ? <EmptyState /> : (
                  <div className="flex flex-col gap-[16px]">
                    {data.genderBreakdown.map((r) => (
                      <div key={r.gender}>
                        <div className="flex items-center justify-between mb-[6px]">
                          <span className="text-[13px] font-semibold" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{r.gender}</span>
                          <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{r.total} results</span>
                        </div>
                        <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={32} />
                        <div className="flex gap-[16px] mt-[6px] text-[12px]">
                          <span style={{ color: "#f4b54d", fontFamily: "Poppins, sans-serif" }}>Lark {r.lark}%</span>
                          <span style={{ color: "#354a82", fontFamily: "Poppins, sans-serif" }}>Eagle {r.eagle}%</span>
                          <span style={{ color: "#7B68AE", fontFamily: "Poppins, sans-serif" }}>Owl {r.owl}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* ══════ Row 2: Org Type + Age Group ══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
              <SectionCard icon={<Building2 size={18} />} title="Chronotype by Organisation Type" subtitle="Compare corporate, NGO, hospital, college and other orgs">
                {data.orgTypeBreakdown.length === 0 ? <EmptyState /> : (
                  <div className="flex flex-col gap-[14px]">
                    {data.orgTypeBreakdown.map((r) => (
                      <div key={r.type}>
                        <div className="flex items-center justify-between mb-[6px]">
                          <span className="text-[13px] font-semibold" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{r.type}</span>
                          <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{r.total} results</span>
                        </div>
                        <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={28} />
                        <div className="flex gap-[16px] mt-[4px] text-[11px]">
                          <span style={{ color: "#f4b54d" }}>Lark {r.lark}%</span>
                          <span style={{ color: "#354a82" }}>Eagle {r.eagle}%</span>
                          <span style={{ color: "#7B68AE" }}>Owl {r.owl}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard icon={<UserCheck size={18} />} title="Chronotype by Age Group" subtitle="How chronotype distribution shifts across age ranges">
                {data.ageBreakdown.length === 0 ? <EmptyState /> : (
                  <div className="flex flex-col gap-[14px]">
                    {data.ageBreakdown.map((r) => (
                      <div key={r.group}>
                        <div className="flex items-center justify-between mb-[6px]">
                          <span className="text-[13px] font-semibold" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{r.group}</span>
                          <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{r.total} results</span>
                        </div>
                        <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={28} />
                        <div className="flex gap-[16px] mt-[4px] text-[11px]">
                          <span style={{ color: "#f4b54d" }}>Lark {r.lark}%</span>
                          <span style={{ color: "#354a82" }}>Eagle {r.eagle}%</span>
                          <span style={{ color: "#7B68AE" }}>Owl {r.owl}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* ══════ Row 3: Organisation Comparison Table ══════ */}
            <SectionCard icon={<Building2 size={18} />} title="Organisation Comparison" subtitle="Sortable Lark–Eagle–Owl percentage split per organisation · View Details opens organisation management">
              {data.orgBreakdown.length === 0 ? <EmptyState /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
                    <thead>
                      <tr><th className="text-left py-[8px] pr-[8px] font-semibold uppercase text-[11px]" style={{ color: "#AAA", borderBottom: "1px solid #F0F0F0" }}>Organisation</th>
                        <th className="text-left py-[8px] px-[8px] font-semibold uppercase text-[11px]" style={{ color: "#AAA", borderBottom: "1px solid #F0F0F0" }}>Split</th>
                        <th className="text-right py-[8px] px-[6px] font-semibold uppercase text-[11px]" style={{ color: "#f4b54d", borderBottom: "1px solid #F0F0F0" }}>Lark</th>
                        <th className="text-right py-[8px] px-[6px] font-semibold uppercase text-[11px]" style={{ color: "#354a82", borderBottom: "1px solid #F0F0F0" }}>Eagle</th>
                        <th className="text-right py-[8px] px-[6px] font-semibold uppercase text-[11px]" style={{ color: "#7B68AE", borderBottom: "1px solid #F0F0F0" }}>Owl</th>
                        <th className="text-right py-[8px] pl-[6px] font-semibold uppercase text-[11px]" style={{ color: "#AAA", borderBottom: "1px solid #F0F0F0" }}>N</th>
                        <th className="text-right py-[8px] pl-[8px] font-semibold uppercase text-[11px]" style={{ color: "#AAA", borderBottom: "1px solid #F0F0F0" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orgBreakdown.slice(0, 50).map((r) => (
                        <tr key={r.name} className="hover:bg-[#F8F9FF] transition-colors">
                          <td className="py-[7px] pr-[8px] font-medium" style={{ color: "#333", borderBottom: "1px solid #F8F9FF" }}>{r.name}</td>
                          <td className="py-[7px] px-[8px]" style={{ borderBottom: "1px solid #F8F9FF" }}><StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={16} /></td>
                          <td className="py-[7px] px-[6px] text-right font-semibold" style={{ color: "#f4b54d", borderBottom: "1px solid #F8F9FF" }}>{r.lark}%</td>
                          <td className="py-[7px] px-[6px] text-right font-semibold" style={{ color: "#354a82", borderBottom: "1px solid #F8F9FF" }}>{r.eagle}%</td>
                          <td className="py-[7px] px-[6px] text-right font-semibold" style={{ color: "#7B68AE", borderBottom: "1px solid #F8F9FF" }}>{r.owl}%</td>
                          <td className="py-[7px] pl-[6px] text-right" style={{ color: "#888", borderBottom: "1px solid #F8F9FF" }}>{r.total}</td>
                          <td className="py-[7px] pl-[8px] text-right" style={{ borderBottom: "1px solid #F8F9FF" }}>
                            <button type="button" onClick={() => router.push(`/superadmin/dashboard/organizations`)}
                              className="text-[11px] font-medium px-[8px] py-[3px] rounded-lg border-none cursor-pointer transition-colors"
                              style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>

            {/* ══════ Row 4: Heatmap + Trend ══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
              <SectionCard icon={<Globe size={18} />} title="Location × Organisation Type Heatmap" subtitle="Dominant chronotype by country and org type — spot regional patterns">
                {data.orgTypeLocation.length === 0 ? <EmptyState /> : (
                  <div className="flex flex-col gap-[8px]">
                    <div className="grid grid-cols-[1fr_1fr_1fr_50px_50px_50px] gap-[6px] text-[10px] font-semibold uppercase px-[4px] pb-[6px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif", borderBottom: "1px solid #F0F0F0" }}>
                      <span>Type</span><span>Location</span><span>Split</span><span className="text-right" style={{ color: "#f4b54d" }}>L</span><span className="text-right" style={{ color: "#354a82" }}>E</span><span className="text-right" style={{ color: "#7B68AE" }}>O</span>
                    </div>
                    {(data.orgTypeLocation).slice(0, 20).map((r, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_50px_50px_50px] gap-[6px] items-center py-[4px] px-[4px] rounded-lg" style={{ background: i % 2 === 0 ? "#F8F9FF" : "transparent" }}>
                        <span className="text-[11px] font-medium truncate" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{r.type}</span>
                        <span className="text-[11px] truncate" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{r.location}</span>
                        <StackedBar lark={r.lark} eagle={r.eagle} owl={r.owl} h={14} />
                        <span className="text-[11px] font-semibold text-right" style={{ color: "#f4b54d" }}>{r.lark}</span>
                        <span className="text-[11px] font-semibold text-right" style={{ color: "#354a82" }}>{r.eagle}</span>
                        <span className="text-[11px] font-semibold text-right" style={{ color: "#7B68AE" }}>{r.owl}</span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard icon={<Calendar size={18} />} title="Chronotype Trend Over Time" subtitle="Monthly Lark / Eagle / Owl percentage changes">
                {data.trend.length < 2 ? <EmptyState /> : (
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center justify-center gap-[20px] mb-[8px]">
                      {(["LARK", "EAGLE", "OWL"] as const).map((ct) => {
                        const latest = data.trend[data.trend.length - 1];
                        const val = ct === "LARK" ? latest.lark : ct === "EAGLE" ? latest.eagle : latest.owl;
                        return (
                          <div key={ct} className="text-center">
                            <div className="w-[8px] h-[8px] rounded-full mx-auto mb-[4px]" style={{ background: CHRONO_COLORS[ct] }} />
                            <p className="m-0 text-[10px] font-semibold uppercase" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{ct}</p>
                            <p className="m-0 text-[18px] font-bold" style={{ color: CHRONO_COLORS[ct], fontFamily: "Poppins, sans-serif" }}>{val}%</p>
                            <p className="m-0 text-[9px]" style={{ color: "#CCC", fontFamily: "Poppins, sans-serif" }}>{latest.month}</p>
                          </div>
                        );
                      })}
                    </div>
                    <SparklineTrend data={data.trend} />
                    <div className="flex flex-wrap gap-x-[16px] gap-y-[4px] text-[10px] justify-center">
                      {data.trend.slice(-12).map((t) => (
                        <span key={t.month} className="flex items-center gap-[4px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                          <span style={{ color: "#AAA" }}>{t.month.slice(5)}</span>
                          <span style={{ color: "#f4b54d" }}>{t.lark}</span>
                          <span style={{ color: "#354a82" }}>{t.eagle}</span>
                          <span style={{ color: "#7B68AE" }}>{t.owl}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            </div>

            {/* ══════ Bottom: Key Insights ══════ */}
            <div className="rounded-[16px] p-[22px]" style={{ background: "linear-gradient(135deg, #EEF2FF, #F5F3FF)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-[10px] mb-[18px]">
                <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.08)" }}>
                  <Award size={18} stroke="#35319B" />
                </div>
                <h3 className="m-0 text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Automated Key Insights</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[12px]">
                {insights.map((c, i) => (
                  <div key={i} className="rounded-[14px] p-[18px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center gap-[8px] mb-[8px]">
                      <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center" style={{ background: `${c.color}14` }}>
                        <span style={{ color: c.color, lineHeight: 0 }}>{c.icon}</span>
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: "#666", fontFamily: "Poppins, sans-serif" }}>{c.label}</span>
                    </div>
                    <p className="m-0 text-[14px] font-bold leading-[1.3]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{c.value}</p>
                    <p className="m-0 mt-[3px] text-[11px]" style={{ color: c.color, fontFamily: "Poppins, sans-serif" }}>{c.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

/* ── Sparkline helper for trend ── */
function SparklineTrend({ data }: { data: ({ month: string } & ChronoRow)[] }) {
  const w = 280, h = 80, px = 20, py = 4;
  const chartW = w - px * 2, chartH = h - py * 2;
  const max = Math.max(...data.flatMap((d) => [d.lark, d.eagle, d.owl]), 1);
  const scale = (v: number) => chartH - (v / max) * chartH + py;

  const lines = (key: "lark" | "eagle" | "owl", color: string) => {
    const pts = data.map((d, i) => {
      const x = px + (i / Math.max(data.length - 1, 1)) * chartW;
      return `${x},${scale(d[key])}`;
    }).join(" ");
    return <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: h }}>
      <rect x={px} y={py} width={chartW} height={chartH} fill="none" stroke="#F0F0F0" strokeWidth="0.5" />
      {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0).map((d, i, arr) => {
        const x = px + (i / Math.max(arr.length - 1, 1)) * chartW;
        return <text key={x} x={x} y={h - 2} textAnchor="middle" fill="#CCC" fontSize="8" fontFamily="Poppins, sans-serif">{d.month.slice(5)}</text>;
      })}
      {lines("lark", "#f4b54d")}
      {lines("eagle", "#354a82")}
      {lines("owl", "#7B68AE")}
    </svg>
  );
}

/* ── Shared components ── */
function SectionCard({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-[10px] mb-[14px]">
        <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
          <span style={{ color: "#35319B" }}>{icon}</span>
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

function MoonIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function SunIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>; }
function BalanceIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
