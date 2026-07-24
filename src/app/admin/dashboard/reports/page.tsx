"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import Bars from "@/components/charts/Bars";
import { BarChart3, ClipboardList, Clock, CheckCircle, Activity } from "lucide-react";
import { SkeletonTable, SkeletonChart, SkeletonStatCard, SkeletonHero } from "@/components/skeleton/SkeletonCard";

export default function ReportsPage() {
  const [data, setData] = useState<{ results: Array<Record<string, unknown>>; stats: Record<string, unknown> | null }>({ results: [], stats: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin-portal").then((r) => r.json()).then((d) => { setData({ results: d.results ?? [], stats: d.stats ?? null }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const results = data.results as Array<Record<string, unknown>>;
  const s = data.stats as Record<string, unknown> | null;
  const chronotypeMix = (s?.chronotypeMix as Array<{ label: string; value: number; color: string }>) ?? [];

  return (
    <DashboardShell title="Assessment Results">
      {loading ? (
        <SkeletonTable rows={8} cols={5} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] mb-[20px]">
            <StatCard label="Completed" value={String(s?.completedAssessments ?? 0)} icon={<CheckCircle size={20} />} gradient="linear-gradient(135deg, #2E7D32, #66BB6A)" lightBg="rgba(46,125,50,0.06)" />
            <StatCard label="In Progress" value={String(s?.inProgress ?? 0)} icon={<Clock size={20} />} gradient="linear-gradient(135deg, #F59A00, #FFB74D)" lightBg="rgba(245,154,0,0.08)" />
            <StatCard label="Total" value={String((s?.totalMembers as number) ?? 0)} icon={<Activity size={20} />} gradient="linear-gradient(135deg, #35319B, #7B76D4)" lightBg="rgba(53,49,155,0.06)" />
          </div>

          {chronotypeMix.length > 0 && (
            <div className="p-[20px] rounded-[16px] mb-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 className="m-0 text-[14px] font-bold mb-[12px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Chronotype Distribution</h3>
              <Bars data={chronotypeMix.map((c) => ({ label: c.label, value: c.value }))} color="#35319B" h={80} />
            </div>
          )}

          <div className="rounded-[16px] overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8F9FF" }}>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Member</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Chronotype</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Confidence</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr><td colSpan={4} className="px-[16px] py-[24px] text-center text-[13px]" style={{ color: "#AAA" }}>No assessment results yet</td></tr>
                  ) : results.map((r, i) => {
                    const member = r.members as Record<string, string> | null;
                    const cr = r.chronotype_results as Record<string, unknown> | null;
                    return (
                      <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                        <td className="px-[16px] py-[12px]">
                          <div className="flex items-center gap-[10px]">
                            <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: "linear-gradient(135deg, #35319B, #7B76D4)" }}>
                              {(member?.first_name as string)?.[0] ?? "?"}{(member?.last_name as string)?.[0] ?? ""}
                            </div>
                            <span className="text-[13px] font-medium" style={{ color: "#171717" }}>{member?.first_name as string} {member?.last_name as string}</span>
                          </div>
                        </td>
                        <td className="px-[16px] py-[12px] text-[13px]" style={{ color: cr?.chronotype ? "#F59A00" : "#AAA" }}>{cr?.chronotype as string ?? "—"}</td>
                        <td className="px-[16px] py-[12px] text-[13px]" style={{ color: "#555" }}>{cr?.confidence_score != null ? `${cr.confidence_score}%` : "—"}</td>
                        <td className="px-[16px] py-[12px]">
                          <span className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full" style={{ background: r.status === "COMPLETED" ? "rgba(46,125,50,0.1)" : "rgba(245,154,0,0.1)", color: r.status === "COMPLETED" ? "#2E7D32" : "#F59A00", fontFamily: "Poppins, sans-serif" }}>
                            {r.status === "COMPLETED" ? "Completed" : "In Progress"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
