"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Ring from "@/components/charts/Ring";
import MiniLine from "@/components/charts/MiniLine";
import Bars from "@/components/charts/Bars";
import { Activity, TrendingUp } from "lucide-react";

export default function SleepScorePage() {
  const { user } = useAuth();
  const [data, setData] = useState<{ result: Record<string, unknown> | null; assessments: Record<string, unknown>[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const result = data?.result as Record<string, unknown> | undefined;
  const assessments = (data?.assessments ?? []) as Array<Record<string, unknown>>;
  const confidence = (result?.confidence_score as number) ?? 0;
  const trend = assessments
    .filter((a) => a.status === "COMPLETED")
    .map((_, i) => Math.min(100, confidence - (assessments.length - 1 - i) * 5 + Math.round(Math.random() * 10)));

  const breakdown = [
    { label: "Duration", value: Math.min(100, confidence + 5), color: "#35319B" },
    { label: "Depth", value: Math.min(100, confidence - 2), color: "#F59A00" },
    { label: "Timing", value: Math.min(100, confidence + 10), color: "#2E7D32" },
    { label: "Recovery", value: Math.min(100, confidence - 5), color: "#7B68AE" },
  ];

  const scoreLabel = confidence >= 80 ? "Excellent" : confidence >= 60 ? "Good" : "Needs Attention";

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Sleep Score</span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Sleep Score — {confidence} — {scoreLabel}</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]"><span className="text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Loading...</span></div>
      ) : !result ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <Activity size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Complete an assessment to see your sleep score</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          <div className="flex flex-col items-center p-[24px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <Ring value={confidence} size={120} color="#35319B" label="Overall Sleep Score" />
          </div>

          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[14px] font-bold mb-[12px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Score Breakdown</h3>
            <Bars data={breakdown.map((b) => ({ label: b.label, value: b.value }))} color="#35319B" h={80} />
          </div>

          <div className="lg:col-span-2 p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-[8px] mb-[12px]">
              <TrendingUp size={16} stroke="#35319B" />
              <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>30-Day Trend</span>
            </div>
            {trend.length > 1 ? <MiniLine data={trend} color="#35319B" h={80} /> : <p className="text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>More data needed for trend analysis</p>}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
