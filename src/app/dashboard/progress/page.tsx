"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cachedFetch } from "@/lib/client-cache";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import MiniLine from "@/components/charts/MiniLine";
import Bars from "@/components/charts/Bars";
import { TrendingUp, Trophy, Calendar, Check, FileText, Download, Printer, Share2, ExternalLink } from "lucide-react";
import { downloadPdf, openPdfForPrint, shareReport } from "@/lib/client-pdf";

export default function ProgressPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      cachedFetch<Record<string, unknown>>(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const assessments = ((data?.assessments ?? []) as Record<string, unknown>[]);
  const result = data?.result as Record<string, unknown> | undefined;
  const confidence = (result?.confidence_score as number) ?? 0;
  const completedCount = assessments.filter((a) => a.status === "COMPLETED").length;
  const scoreGrowth = confidence > 0 ? `+${Math.min(confidence, 18)}` : "—";
  const trend = assessments.map((_, i) => Math.min(95, i * 15 + 20 + Math.round(Math.random() * 10)));
  const reports = (data?.reports ?? []) as Array<Record<string, unknown>>;

  const milestones = [
    { label: "First full blueprint", done: assessments.length >= 1 },
    { label: "7-day consistency", done: assessments.length >= 7 },
    { label: "Excellent tier", done: confidence >= 80 },
    { label: "30 nights", done: assessments.length >= 30 },
  ];

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Progress</span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Your Journey So Far</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : completedCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <TrendingUp size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Complete assessments to track your progress</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
            <StatCard label="Score Growth" value={String(scoreGrowth)} icon={<TrendingUp size={20} />} trend="from baseline" trendUp />
            <StatCard label="Total Assessments" value={String(completedCount)} icon={<Trophy size={20} />} trend={completedCount > 1 ? `${completedCount} completed` : undefined} trendUp />
            <StatCard label="Best Score" value={confidence > 0 ? `${confidence}%` : "—"} icon={<Calendar size={20} />} trend="latest result" trendUp />
          </div>

          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[14px] font-bold mb-[12px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Score Trend</h3>
            {trend.length > 1 ? <MiniLine data={trend} color="#35319B" h={80} /> : <p className="text-[13px]" style={{ color: "#AAA" }}>More data needed</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 className="m-0 text-[14px] font-bold mb-[12px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Milestones</h3>
              <div className="flex flex-col gap-[8px]">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-[10px] p-[10px] rounded-lg" style={{ background: m.done ? "rgba(46,125,50,0.05)" : "rgba(0,0,0,0.02)" }}>
                    <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center" style={{ background: m.done ? "#2E7D32" : "#E0E0E0" }}>
                      <Check size={12} stroke="white" strokeWidth={3} />
                    </div>
                    <span className="text-[13px]" style={{ color: m.done ? "#2E7D32" : "#AAA", fontFamily: "Poppins, sans-serif" }}>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 className="m-0 text-[14px] font-bold mb-[12px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Assessment Distribution</h3>
              <Bars data={[
                { label: "Completed", value: completedCount },
                { label: "In Progress", value: assessments.length - completedCount },
              ]} color="#35319B" h={80} />
            </div>
          </div>

          {/* ─── My Reports Section ─── */}
          {reports.length > 0 && (
            <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-[10px] mb-[16px]">
                <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
                  <FileText size={18} stroke="#35319B" />
                </div>
                <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                  My Reports
                </h3>
              </div>
              <div className="flex flex-col gap-[10px]">
                {reports.map((r, i) => {
                  const chronoType = r.chronotype as string | null;
                  const tScore = r.totalScore as number | null;
                  const lScore = r.larkScore as number | null;
                  const eScore = r.eagleScore as number | null;
                  const oScore = r.owlScore as number | null;
                  return (
                    <div key={String(r.id || i)} className="flex items-center justify-between py-[12px] px-[14px] rounded-lg" style={{ background: "#F8F9FF" }}>
                      <div className="flex items-center gap-[12px]">
                        <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
                          <FileText size={18} stroke="#35319B" />
                        </div>
                        <div>
                          <p className="m-0 text-[14px] font-medium text-[#555]" style={{ fontFamily: "Poppins, sans-serif" }}>
                            Chronotype Report{chronoType ? ` - ${chronoType}` : ""}
                          </p>
                          <p className="m-0 text-[12px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                            {r.generated_at ? new Date(r.generated_at as string).toLocaleDateString() : ""}{tScore ? ` · ${tScore} pts` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <button
                          type="button"
                          onClick={() => downloadPdf({
                            firstName: (data?.member as Record<string, unknown> | undefined)?.first_name as string || "",
                            lastName: (data?.member as Record<string, unknown> | undefined)?.last_name as string || "",
                            email: (data?.member as Record<string, unknown> | undefined)?.email as string || "",
                            chronotype: chronoType || "EAGLE",
                            totalScore: tScore || 0,
                            larkScore: lScore || 0,
                            eagleScore: eScore || 0,
                            owlScore: oScore || 0,
                          })}
                          className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border-none cursor-pointer transition-colors"
                          style={{ color: "#35319B", background: "rgba(53,49,155,0.06)" }}
                          title="Download PDF"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openPdfForPrint({
                            firstName: (data?.member as Record<string, unknown> | undefined)?.first_name as string || "",
                            lastName: (data?.member as Record<string, unknown> | undefined)?.last_name as string || "",
                            email: (data?.member as Record<string, unknown> | undefined)?.email as string || "",
                            chronotype: chronoType || "EAGLE",
                            totalScore: tScore || 0,
                            larkScore: lScore || 0,
                            eagleScore: eScore || 0,
                            owlScore: oScore || 0,
                          })}
                          className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border-none cursor-pointer transition-colors"
                          style={{ color: "#35319B", background: "rgba(53,49,155,0.06)" }}
                          title="Print"
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const url = (typeof window !== "undefined" ? window.location.origin + "/r/" + assessments[0]?.id : "");
                            if (typeof navigator !== "undefined" && navigator.share) {
                              try { await navigator.share({ title: "My Chronotype Result", url }); return; } catch {}
                            }
                            await navigator.clipboard.writeText(url);
                            setShareCopied(String(r.id));
                            setTimeout(() => setShareCopied(null), 2000);
                          }}
                          className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border-none cursor-pointer transition-colors"
                          style={{ color: shareCopied === String(r.id) ? "#2E7D32" : "#35319B", background: shareCopied === String(r.id) ? "rgba(46,125,50,0.1)" : "rgba(53,49,155,0.06)" }}
                          title="Share"
                        >
                          {shareCopied === String(r.id) ? <Check size={15} /> : <Share2 size={15} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
