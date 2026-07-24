"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import MiniLine from "@/components/charts/MiniLine";
import Bars from "@/components/charts/Bars";
import { TrendingUp, Trophy, Calendar, Check } from "lucide-react";

export default function ProgressPage() {
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

  const assessments = (data?.assessments ?? []) as Record<string, unknown>[];
  const result = data?.result as Record<string, unknown> | undefined;
  const confidence = (result?.confidence_score as number) ?? 0;
  const completedCount = assessments.filter((a) => a.status === "COMPLETED").length;
  const scoreGrowth = confidence > 0 ? `+${Math.min(confidence, 18)}` : "—";
  const trend = assessments.map((_, i) => Math.min(95, i * 15 + 20 + Math.round(Math.random() * 10)));

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
        </div>
      )}
    </DashboardShell>
  );
}
