"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import { Moon, Sparkles, Activity, TrendingUp, Calendar, Star } from "lucide-react";

interface DashboardData {
  member: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  recommendations: Record<string, unknown>[];
  assessments: Record<string, unknown>[];
}

export default function MemberDashboardPage() {
  const { user, isLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (user && user.email) {
      fetch(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            setFetchError(json.error);
            setData(null);
          } else {
            setData(json);
          }
          setDataLoading(false);
        })
        .catch((err) => { setFetchError(`Network error: ${err.message}`); setDataLoading(false); });
    } else if (!isLoading) {
      setDataLoading(false);
    }
  }, [user, isLoading]);

  if (isLoading || dataLoading) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
          <p className="text-[14px] text-[#888]">Loading...</p>
        </div>
      </DashboardShell>
    );
  }

  if (fetchError) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex flex-col items-center justify-center gap-[12px]" style={{ fontFamily: "Poppins, sans-serif" }}>
          <div className="p-[16px] rounded-xl max-w-[480px]" style={{ background: "rgba(211,47,47,0.06)" }}>
            <p className="m-0 text-[13px] leading-[1.5] text-center" style={{ color: "#D32F2F" }}>
              {fetchError}
            </p>
          </div>
          {fetchError.includes("relation") && (
            <div className="p-[16px] rounded-xl max-w-[480px] text-center" style={{ background: "rgba(53,49,155,0.04)" }}>
              <p className="m-0 text-[13px] font-semibold mb-[4px]" style={{ color: "#35319B" }}>Database setup required</p>
              <p className="m-0 text-[12px] leading-[1.5]" style={{ color: "#888" }}>
                Run the SQL schema files in this exact order in your Supabase SQL Editor:
              </p>
              <code className="block mt-[8px] text-[12px] font-mono" style={{ color: "#555", background: "rgba(0,0,0,0.03)", padding: "8px 12px", borderRadius: "8px" }}>
                1. supabase/schema.sql{'\n'}2. supabase/schema2.sql{'\n'}3. supabase/schema3.sql
              </code>
              <p className="m-0 mt-[8px] text-[12px]" style={{ color: "#888" }}>
                Then visit <a href="/api/health" style={{ color: "#35319B" }}>/api/health</a> to verify.
              </p>
            </div>
          )}
        </div>
      </DashboardShell>
    );
  }

  if (!user) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
          <p className="text-[14px] text-[#888]">Please log in to view your dashboard.</p>
        </div>
      </DashboardShell>
    );
  }

  const result = data?.result as Record<string, unknown> | undefined;
  const chronotype = (result?.chronotype as string) ?? "—";
  const larkScore = (result?.lark_score as number) ?? 0;
  const eagleScore = (result?.eagle_score as number) ?? 0;
  const owlScore = (result?.owl_score as number) ?? 0;
  const totalScore = (result?.total_score as number) ?? 0;
  const confidenceScore = (result?.confidence_score as number) ?? 0;

  const chronotypeLabels: Record<string, string> = {
    LARK: "Lion", EAGLE: "Eagle", OWL: "Owl",
  };

  return (
    <DashboardShell>
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
            {result ? `Your Chronotype: ${chronotypeLabels[chronotype] ?? chronotype}` : "Ready to understand your sleep?"}
          </h2>
          <p className="m-0 mt-[6px] text-[14px] leading-[1.5] text-[rgba(255,255,255,0.7)] max-w-[480px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
            {result
              ? `You scored Lark: ${larkScore} | Eagle: ${eagleScore} | Owl: ${owlScore} | Confidence: ${confidenceScore}%`
              : "Complete your assessment to unlock personalized insights, recommendations, and your unique sleep chronotype."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[20px] mb-[24px] md:mb-[28px]">
        <StatCard
          label="Sleep Score"
          value={totalScore > 0 ? String(totalScore) : "—"}
          icon={<Activity size={20} />}
          trend={result ? `${confidenceScore}% confidence` : undefined}
          trendUp
        />
        <StatCard
          label="Chronotype"
          value={chronotypeLabels[chronotype] ?? "—"}
          icon={<Moon size={20} />}
        />
        <StatCard
          label="Assessments"
          value={String(data?.assessments?.length ?? 0)}
          icon={<TrendingUp size={20} />}
        />
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
          {data?.assessments && data.assessments.length > 0 ? (
            <div className="flex flex-col gap-[10px]">
              {(data.assessments as Array<Record<string, unknown>>).slice(0, 5).map((a, i) => (
                <div key={i} className="flex items-center justify-between py-[8px] px-[12px] rounded-lg" style={{ background: "#F8F9FF" }}>
                  <span className="text-[13px] font-medium text-[#555]" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Assessment #{String(i + 1)}
                  </span>
                  <span className="text-[12px] font-medium" style={{ fontFamily: "Poppins, sans-serif", color: a.status === "COMPLETED" ? "#2E7D32" : "#F59A00" }}>
                    {String(a.status ?? "—")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-[20px]"
              style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}
            >
              <Sparkles size={32} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[10px] text-[13px] leading-[1.5] text-[#AAA] text-center max-w-[280px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                Complete your sleep assessment to see personalized insights and recommendations here.
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
