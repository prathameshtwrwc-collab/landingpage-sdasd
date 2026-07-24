"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import { Shield, Users, BarChart3, Activity, Server, AlertTriangle } from "lucide-react";
import { SkeletonStatCard, SkeletonTable, SkeletonChart, SkeletonHero } from "@/components/skeleton/SkeletonCard";

interface PlatformStats {
  organizations: number;
  members: number;
  assessments: number;
  admins: number;
  chronotypeDistribution: { lark: number; eagle: number; owl: number };
}

export default function SuperAdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetch("/api/admin")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
        if (json.stats) setStats(json.stats);
        setStatsLoading(false);
      })
      .catch((err) => {
        setFetchError(err.message);
        setStatsLoading(false);
      });
  }, []);

  if (isLoading || statsLoading) {
    return (
      <DashboardShell>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[20px] mb-[24px]">
        <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
      </div>
      <div className="p-[24px] rounded-[16px] animate-pulse" style={{ background: "#F5F5F5", minHeight: "200px" }} />
      </DashboardShell>
    );
  }

  if (!user || user.role !== "superadmin") {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
          <p className="text-[14px] text-[#888]">Access denied.</p>
        </div>
      </DashboardShell>
    );
  }

  const s = stats;

  return (
    <DashboardShell>
      <div
        className="relative overflow-hidden rounded-[20px] p-[24px] md:p-[32px] mb-[24px] md:mb-[28px]"
        style={{
          background: "linear-gradient(135deg, #0F0C29 0%, #1A1740 50%, #2B2660 100%)",
        }}
      >
        <div className="absolute top-[-30px] right-[-20px] opacity-[0.04]">
          <Shield size={180} stroke="white" strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <p className="m-0 text-[14px] font-medium text-[rgba(255,255,255,0.5)] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
            Super Admin Console
          </p>
          <h2 className="m-0 text-[24px] md:text-[28px] font-bold text-white leading-[1.2] tracking-[-0.02em]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            Platform Overview
          </h2>
          <p className="m-0 mt-[6px] text-[14px] leading-[1.5] text-[rgba(255,255,255,0.5)] max-w-[480px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
            System health, organization management, and platform-wide analytics at a glance.
          </p>
        </div>
      </div>

      {fetchError && (
        <div className="mb-[16px] p-[14px] rounded-xl text-[13px]" style={{ background: "rgba(211,47,47,0.08)", color: "#C62828", border: "1px solid rgba(211,47,47,0.2)" }}>
          <strong>Error loading data:</strong> {fetchError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[20px] mb-[24px] md:mb-[28px]">
        <StatCard label="Organizations" value={String(s?.organizations ?? "—")} icon={<Users size={20} />} />
        <StatCard label="Total Users" value={String(s?.members ?? "—")} icon={<Activity size={20} />} />
        <StatCard label="Platform Health" value={s ? `${Math.round((s.assessments / Math.max(s.members, 1)) * 100)}%` : "—"} icon={<Server size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] md:gap-[20px]">
        <div
          className="lg:col-span-2 rounded-[16px] p-[22px] md:p-[28px]"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
              <BarChart3 size={18} stroke="#35319B" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              System Overview
            </h3>
          </div>
          {s ? (
            <div className="flex flex-col gap-[12px]">
              <div className="grid grid-cols-2 gap-[12px]">
                <div className="p-[14px] rounded-xl" style={{ background: "rgba(53,49,155,0.04)" }}>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#AAA]" style={{ fontFamily: "Poppins, sans-serif" }}>Admins</p>
                  <p className="m-0 text-[20px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif" }}>{s.admins}</p>
                </div>
                <div className="p-[14px] rounded-xl" style={{ background: "rgba(245,154,0,0.06)" }}>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#AAA]" style={{ fontFamily: "Poppins, sans-serif" }}>Completed</p>
                  <p className="m-0 text-[20px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif" }}>{s.assessments}</p>
                </div>
              </div>
              <div className="p-[14px] rounded-xl" style={{ background: "rgba(46,125,50,0.04)" }}>
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#AAA]" style={{ fontFamily: "Poppins, sans-serif" }}>Chronotype Distribution</p>
                <div className="flex gap-[16px] mt-[8px]">
                  <span className="text-[13px] font-medium" style={{ fontFamily: "Poppins, sans-serif", color: "#f4b54d" }}>Lark: {s.chronotypeDistribution.lark}%</span>
                  <span className="text-[13px] font-medium" style={{ fontFamily: "Poppins, sans-serif", color: "#354a82" }}>Eagle: {s.chronotypeDistribution.eagle}%</span>
                  <span className="text-[13px] font-medium" style={{ fontFamily: "Poppins, sans-serif", color: "#7B68AE" }}>Owl: {s.chronotypeDistribution.owl}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[20px]" style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}>
              <BarChart3 size={32} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[10px] text-[13px] leading-[1.5] text-[#AAA] text-center max-w-[360px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                No data available yet.
              </p>
            </div>
          )}
        </div>

        <div
          className="rounded-[16px] p-[22px] md:p-[28px]"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(211,47,47,0.06)" }}>
              <AlertTriangle size={18} stroke="#D32F2F" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Alerts
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center py-[20px]" style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}>
            <Shield size={32} stroke="#CCC" strokeWidth={1.5} />
            <p className="m-0 mt-[10px] text-[13px] leading-[1.5] text-[#AAA] text-center max-w-[220px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
              No critical alerts at this time.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
