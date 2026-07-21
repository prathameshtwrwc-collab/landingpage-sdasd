"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import { Users, BarChart3, Bell, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "organization_admin")) {
      router.push(user ? "/unauthorized" : "/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "organization_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
        <p className="text-[14px] text-[#888]">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardShell>
      {/* Welcome banner */}
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
            Organization Dashboard
          </p>
          <h2 className="m-0 text-[24px] md:text-[28px] font-bold text-white leading-[1.2] tracking-[-0.02em]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            Welcome, {user.name}
          </h2>
          <p className="m-0 mt-[6px] text-[14px] leading-[1.5] text-[rgba(255,255,255,0.7)] max-w-[500px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
            Monitor participant progress, review assessment data, and manage your organization's sleep wellness program.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[20px] mb-[24px] md:mb-[28px]">
        <StatCard label="Total Participants" value="128" icon={<Users size={20} />} gradient="linear-gradient(135deg, #35319B, #7B76D4)" lightBg="rgba(53,49,155,0.06)" />
        <StatCard label="Avg. Sleep Score" value="74" icon={<Activity size={20} />} trend="2.1%" trendUp gradient="linear-gradient(135deg, #F59A00, #FFB74D)" lightBg="rgba(245,154,0,0.08)" />
        <StatCard label="Assessments Done" value="96" icon={<TrendingUp size={20} />} trend="12%" trendUp gradient="linear-gradient(135deg, #2E7D32, #66BB6A)" lightBg="rgba(46,125,50,0.06)" />
        <StatCard label="Active This Week" value="42" icon={<Bell size={20} />} gradient="linear-gradient(135deg, #D32F2F, #FF6B6B)" lightBg="rgba(211,47,47,0.06)" />
      </div>

      {/* Insights panel */}
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
            <BarChart3 size={18} stroke="#35319B" />
          </div>
          <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            Organization Insights
          </h3>
        </div>
        <div
          className="flex flex-col items-center justify-center py-[20px]"
          style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}
        >
          <BarChart3 size={32} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[10px] text-[13px] leading-[1.5] text-[#AAA] text-center max-w-[360px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
            Participant reports, team comparisons, and aggregate trends will appear here once data is available.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
