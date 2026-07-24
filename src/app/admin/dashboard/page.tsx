"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import MiniLine from "@/components/charts/MiniLine";
import Bars from "@/components/charts/Bars";
import Ring from "@/components/charts/Ring";
import { SkeletonStatCard, SkeletonChart, SkeletonHero } from "@/components/skeleton/SkeletonCard";
import { Users, ClipboardCheck, Brain, Link2, TrendingUp, BarChart3, Activity } from "lucide-react";

interface DashboardStats {
  orgName: string;
  totalMembers: number;
  completedAssessments: number;
  inProgress: number;
  notStarted: number;
  avgConfidence: number;
  orgLinkStatus: string;
  orgUniqueCode: string;
  assessmentActivity: Array<{ label: string; value: number }>;
  chronotypeMix: Array<{ label: string; value: number; color: string }>;
}

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetch("/api/admin-portal")
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
        <SkeletonHero />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[20px] mb-[24px]">
        <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
        <SkeletonChart /><SkeletonChart />
      </div>
      </DashboardShell>
    );
  }

  if (!user || user.role !== "organization_admin") {
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
          background: "linear-gradient(135deg, #1A1668 0%, #35319B 50%, #5A55C0 100%)",
        }}
      >
        <div className="absolute top-[-30px] right-[-10px] opacity-[0.05]">
          <BarChart3 size={180} stroke="white" strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <p className="m-0 text-[14px] font-medium text-[rgba(255,255,255,0.6)] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
            {s?.orgName ?? "Organization"} Dashboard
          </p>
          <h2 className="m-0 text-[24px] md:text-[28px] font-bold text-white leading-[1.2] tracking-[-0.02em]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            Welcome, {user.name}
          </h2>
          <p className="m-0 mt-[6px] text-[14px] leading-[1.5] text-[rgba(255,255,255,0.7)] max-w-[500px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
            {s?.orgName ? `${s.orgName} — ` : ""}Monitor participant progress, review assessment data, and manage your organization&apos;s sleep wellness program.
          </p>
        </div>
      </div>

      {fetchError && (
        <div className="mb-[16px] p-[14px] rounded-xl text-[13px]" style={{ background: "rgba(211,47,47,0.08)", color: "#C62828", border: "1px solid rgba(211,47,47,0.2)" }}>
          <strong>Error loading data:</strong> {fetchError}
        </div>
      )}

      {/* Row 1: Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[20px] mb-[24px]">
        <StatCard
          label="Total Members"
          value={String(s?.totalMembers ?? 0)}
          icon={<Users size={20} />}
          gradient="linear-gradient(135deg, #35319B, #7B76D4)"
          lightBg="rgba(53,49,155,0.06)"
        />
        <StatCard
          label="Assessments"
          value={`${s?.completedAssessments ?? 0}/${(s?.totalMembers ?? 0) + (s?.inProgress ?? 0)}`}
          icon={<ClipboardCheck size={20} />}
          trend={s ? `${s.inProgress} in progress` : undefined}
          trendUp
          gradient="linear-gradient(135deg, #F59A00, #FFB74D)"
          lightBg="rgba(245,154,0,0.08)"
        />
        <StatCard
          label="Avg Confidence"
          value={s ? `${s.avgConfidence}%` : "—"}
          icon={<Brain size={20} />}
          gradient="linear-gradient(135deg, #2E7D32, #66BB6A)"
          lightBg="rgba(46,125,50,0.06)"
        />
        <StatCard
          label="Org Link"
          value={s?.orgLinkStatus === "active" ? "Active" : s?.orgLinkStatus === "paused" ? "Paused" : "—"}
          icon={<Link2 size={20} />}
          gradient={s?.orgLinkStatus === "active" ? "linear-gradient(135deg, #2E7D32, #66BB6A)" : "linear-gradient(135deg, #D32F2F, #FF6B6B)"}
          lightBg={s?.orgLinkStatus === "active" ? "rgba(46,125,50,0.06)" : "rgba(211,47,47,0.06)"}
        />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] md:gap-[20px] mb-[24px]">
        {/* Assessment Activity */}
        <div
          className="rounded-[16px] p-[22px] md:p-[28px]"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div
              className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
              style={{ background: "rgba(53,49,155,0.06)" }}
            >
              <Activity size={18} stroke="#35319B" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Assessment Activity
            </h3>
          </div>
          {s?.assessmentActivity && s.assessmentActivity.length > 0 ? (
            <div>
              <MiniLine data={s.assessmentActivity.map((d) => d.value)} color="#35319B" h={80} />
              <div className="flex justify-between mt-[4px]">
                {s.assessmentActivity.map((d, i) => (
                  <span key={i} className="text-[9px] text-center" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif", width: `${100 / s.assessmentActivity.length}%` }}>
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[20px]" style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}>
              <TrendingUp size={32} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[10px] text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                No activity data yet
              </p>
            </div>
          )}
        </div>

        {/* Chronotype Distribution */}
        <div
          className="rounded-[16px] p-[22px] md:p-[28px]"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div
              className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
              style={{ background: "rgba(245,154,0,0.08)" }}
            >
              <BarChart3 size={18} stroke="#F59A00" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Chronotype Distribution
            </h3>
          </div>
          {s?.chronotypeMix && s.chronotypeMix.length > 0 ? (
            <div className="grid grid-cols-3 gap-[16px] mb-[16px]">
              {s.chronotypeMix.map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <Ring value={item.value} size={90} color={item.color} label={item.label} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[20px]" style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}>
              <BarChart3 size={32} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[10px] text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                No chronotype data yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Org Link detail + additional info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] md:gap-[20px]">
        <div
          className="lg:col-span-2 rounded-[16px] p-[22px] md:p-[28px]"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div
              className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
              style={{ background: "rgba(53,49,155,0.06)" }}
            >
              <Link2 size={18} stroke="#35319B" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Organization Link
            </h3>
          </div>
          {s?.orgUniqueCode ? (
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center justify-between p-[14px] rounded-xl" style={{ background: "rgba(53,49,155,0.04)" }}>
                <span className="text-[13px] font-medium" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Unique Code</span>
                <code className="text-[14px] font-mono font-bold" style={{ color: "#35319B" }}>{s.orgUniqueCode}</code>
              </div>
              <div className="flex items-center justify-between p-[14px] rounded-xl" style={{ background: "rgba(53,49,155,0.04)" }}>
                <span className="text-[13px] font-medium" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Status</span>
                <span className="text-[12px] font-semibold px-[10px] py-[4px] rounded-full" style={{
                  background: s.orgLinkStatus === "active" ? "rgba(46,125,50,0.1)" : "rgba(211,47,47,0.1)",
                  color: s.orgLinkStatus === "active" ? "#2E7D32" : "#D32F2F",
                  fontFamily: "Poppins, sans-serif",
                }}>
                  {s.orgLinkStatus === "active" ? "Active" : "Paused"}
                </span>
              </div>
              <div className="flex items-center justify-between p-[14px] rounded-xl" style={{ background: "rgba(53,49,155,0.04)" }}>
                <span className="text-[13px] font-medium" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Share URL</span>
                <code className="text-[12px] font-mono" style={{ color: "#888" }}>
                  {typeof window !== "undefined" ? `${window.location.origin}/${s.orgUniqueCode}` : `.../${s.orgUniqueCode}`}
                </code>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[20px]" style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}>
              <Link2 size={32} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[10px] text-[13px] text-center max-w-[300px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                No organization link created yet. Ask your super admin to generate one.
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
            <div
              className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
              style={{ background: "rgba(211,47,47,0.06)" }}
            >
              <TrendingUp size={18} stroke="#D32F2F" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Quick Overview
            </h3>
          </div>
          {s ? (
            <div className="flex flex-col gap-[10px]">
              {[
                { label: "Not Started", value: String(s.notStarted), color: "#D32F2F" },
                { label: "In Progress", value: String(s.inProgress), color: "#F59A00" },
                { label: "Completed", value: String(s.completedAssessments), color: "#2E7D32" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-[12px] rounded-lg" style={{ background: `${item.color}08` }}>
                  <span className="text-[12px] font-medium" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{item.label}</span>
                  <span className="text-[16px] font-bold" style={{ color: item.color, fontFamily: "Poppins, sans-serif" }}>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[20px]" style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}>
              <BarChart3 size={32} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[10px] text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                No data available
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
