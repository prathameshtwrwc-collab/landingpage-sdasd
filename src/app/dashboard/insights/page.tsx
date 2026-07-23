"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import MiniLine from "@/components/charts/MiniLine";
import Bars from "@/components/charts/Bars";
import { TrendingUp, Moon, Sparkles, Brain } from "lucide-react";
import { CHRONOTYPE_LABELS, CHRONOTYPE_PEAK_TIMES, generateEnergyCurve, ENERGY_LABELS } from "@/lib/chronotype-utils";

export default function InsightsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{ result: Record<string, unknown> | null } | null>(null);
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
  const chronotype = (result?.chronotype as "LARK" | "EAGLE" | "OWL") ?? null;
  const curve = chronotype ? generateEnergyCurve(chronotype) : [];
  const peaks = chronotype ? CHRONOTYPE_PEAK_TIMES[chronotype] : null;

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Insights</span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Your Sleep & Energy Insights</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]"><span className="text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Loading...</span></div>
      ) : !chronotype ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <TrendingUp size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Complete an assessment to see insights</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          <div className="p-[20px] rounded-[16px] lg:col-span-2" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-[8px] mb-[12px]">
              <TrendingUp size={16} stroke="#35319B" />
              <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Your 24-Hour Energy Rhythm</span>
            </div>
            <MiniLine data={curve} color="#35319B" h={80} />
            <div className="flex justify-between mt-[4px]">
              {ENERGY_LABELS.map((l, i) => (
                <span key={i} className="text-[9px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{l}</span>
              ))}
            </div>
          </div>

          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-[8px] mb-[12px]">
              <Brain size={16} stroke="#F59A00" />
              <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Peak Performance Times</span>
            </div>
            {peaks && (
              <div className="flex flex-col gap-[10px]">
                {[
                  { label: "Focus Peak", value: peaks.focus, icon: <Brain size={14} stroke="#35319B" /> },
                  { label: "Creative Window", value: peaks.creative, icon: <Sparkles size={14} stroke="#F59A00" /> },
                  { label: "Ideal Sleep", value: peaks.sleep, icon: <Moon size={14} stroke="#35319B" /> },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-[10px] p-[10px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                    {p.icon}
                    <div>
                      <p className="m-0 text-[11px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{p.label}</p>
                      <p className="m-0 text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{p.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-[8px] mb-[12px]">
              <Moon size={16} stroke="#35319B" />
              <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Chronotype Profile</span>
            </div>
            <p className="m-0 text-[15px] font-bold" style={{ color: "#F59A00", fontFamily: "Poppins, sans-serif" }}>{CHRONOTYPE_LABELS[chronotype]}</p>
            <p className="m-0 mt-[6px] text-[12px] leading-[1.5]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Confidence: {String(result?.confidence_score ?? "—")}% </p>
            <Bars
              data={[
                { label: "Lark", value: (result?.lark_score as number) ?? 0 },
                { label: "Eagle", value: (result?.eagle_score as number) ?? 0 },
                { label: "Owl", value: (result?.owl_score as number) ?? 0 },
              ]}
              color="#35319B"
              h={60}
            />
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
