"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import { Moon, Sparkles, Activity, TrendingUp, Calendar, Star } from "lucide-react";

export default function MemberDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "member")) {
      router.push(user ? "/unauthorized" : "/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "member") {
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
          background: "linear-gradient(135deg, #1A1668 0%, #35319B 40%, #5A55C0 100%)",
        }}
      >
        <div className="absolute top-[-40px] right-[-20px] opacity-[0.06]">
          <Moon size={200} stroke="white" strokeWidth={1} />
        </div>
        <div className="absolute bottom-[-30px] left-[-30px] opacity-[0.04]">
          <Sparkles size={160} stroke="white" strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <p className="m-0 text-[14px] font-medium text-[rgba(255,255,255,0.6)] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
            Welcome back, {user.name}
          </p>
          <h2 className="m-0 text-[24px] md:text-[28px] font-bold text-white leading-[1.2] tracking-[-0.02em]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            Ready to understand your sleep?
          </h2>
          <p className="m-0 mt-[6px] text-[14px] leading-[1.5] text-[rgba(255,255,255,0.7)] max-w-[480px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
            Complete your assessment to unlock personalized insights, recommendations, and your unique sleep chronotype.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[20px] mb-[24px] md:mb-[28px]">
        <StatCard
          label="Sleep Score"
          value="78"
          icon={<Activity size={20} />}
          trend="3.2%"
          trendUp
          gradient="linear-gradient(135deg, #F59A00, #FFB74D)"
          lightBg="rgba(245,154,0,0.08)"
        />
        <StatCard
          label="Avg. Sleep Duration"
          value="7.2 hrs"
          icon={<Moon size={20} />}
          trend="0.5 hrs"
          trendUp
          gradient="linear-gradient(135deg, #35319B, #7B76D4)"
          lightBg="rgba(53,49,155,0.06)"
        />
        <StatCard
          label="Chronotype"
          value="Lion"
          icon={<TrendingUp size={20} />}
          gradient="linear-gradient(135deg, #2E7D32, #66BB6A)"
          lightBg="rgba(46,125,50,0.06)"
        />
      </div>

      {/* Recent activity + Quick actions */}
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
              <Calendar size={18} stroke="#35319B" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Recent Activity
            </h3>
          </div>
          <div
            className="flex flex-col items-center justify-center py-[20px]"
            style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}
          >
            <Sparkles size={32} stroke="#CCC" strokeWidth={1.5} />
            <p className="m-0 mt-[10px] text-[13px] leading-[1.5] text-[#AAA] text-center max-w-[280px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
              Complete your sleep assessment to see personalized insights and recommendations here.
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
              style={{ background: "rgba(245,154,0,0.08)" }}
            >
              <Star size={18} stroke="#F59A00" fill="#F59A00" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Quick Tips
            </h3>
          </div>
          <div className="flex flex-col gap-[12px]">
            {[
              "Try waking up at the same time daily",
              "Avoid screens 30 min before bed",
              "Keep your bedroom cool (18-22°C)",
            ].map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-[10px] text-[13px] leading-[1.5]"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, color: "#666" }}
              >
                <span
                  className="flex items-center justify-center w-[6px] h-[6px] rounded-full mt-[7px] shrink-0"
                  style={{ background: "#F59A00" }}
                />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
