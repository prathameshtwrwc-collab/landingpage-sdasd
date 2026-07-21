"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import { Shield, Users, BarChart3, Activity, Server, AlertTriangle } from "lucide-react";

export default function SuperAdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "superadmin")) {
      router.push(user ? "/unauthorized" : "/superadmin/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "superadmin") {
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[20px] mb-[24px] md:mb-[28px]">
        <StatCard label="Organizations" value="12" icon={<Users size={20} />} gradient="linear-gradient(135deg, #35319B, #7B76D4)" lightBg="rgba(53,49,155,0.06)" />
        <StatCard label="Total Users" value="2,847" icon={<Activity size={20} />} trend="8.3%" trendUp gradient="linear-gradient(135deg, #F59A00, #FFB74D)" lightBg="rgba(245,154,0,0.08)" />
        <StatCard label="Platform Health" value="98%" icon={<Server size={20} />} gradient="linear-gradient(135deg, #2E7D32, #66BB6A)" lightBg="rgba(46,125,50,0.06)" />
      </div>

      {/* Recent activity + alerts */}
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
              <BarChart3 size={18} stroke="#35319B" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              System Overview
            </h3>
          </div>
          <div
            className="flex flex-col items-center justify-center py-[20px]"
            style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}
          >
            <BarChart3 size={32} stroke="#CCC" strokeWidth={1.5} />
            <p className="m-0 mt-[10px] text-[13px] leading-[1.5] text-[#AAA] text-center max-w-[360px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
              Platform-wide analytics, organization metrics, and system performance data will be available here.
            </p>
          </div>
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
              <AlertTriangle size={18} stroke="#D32F2F" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Alerts
            </h3>
          </div>
          <div
            className="flex flex-col items-center justify-center py-[20px]"
            style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}
          >
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
