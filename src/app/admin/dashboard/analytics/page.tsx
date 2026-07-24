"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import MiniLine from "@/components/charts/MiniLine";
import Bars from "@/components/charts/Bars";
import { BarChart3, TrendingUp, Clock, Users } from "lucide-react";
import { SkeletonChart } from "@/components/skeleton/SkeletonCard";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin-portal")
      .then((r) => r.json())
      .then((d) => { setStats(d.stats ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const s = stats as Record<string, unknown> | null;
  const mix = (s?.chronotypeMix as Array<{ label: string; value: number }>) ?? [];

  return (
    <DashboardShell title="Deep Analytics">
      {loading ? (
        <div><SkeletonChart /><div className="h-[16px]" /><SkeletonChart /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-[8px] mb-[12px]">
              <TrendingUp size={16} stroke="#35319B" />
              <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Chronotype Distribution</span>
            </div>
            <Bars data={mix.map((m) => ({ label: m.label, value: m.value }))} color="#35319B" h={80} />
          </div>

          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-[8px] mb-[12px]">
              <Users size={16} stroke="#F59A00" />
              <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Engagement Overview</span>
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
              {[
                { label: "Members", value: String(s?.totalMembers ?? 0), color: "#35319B" },
                { label: "Completed", value: String(s?.completedAssessments ?? 0), color: "#2E7D32" },
                { label: "In Progress", value: String(s?.inProgress ?? 0), color: "#F59A00" },
                { label: "Not Started", value: String(s?.notStarted ?? 0), color: "#D32F2F" },
              ].map((item, i) => (
                <div key={i} className="p-[12px] rounded-xl text-center" style={{ background: `${item.color}08` }}>
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{item.label}</p>
                  <p className="m-0 text-[20px] font-bold" style={{ color: item.color, fontFamily: "Poppins, sans-serif" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
