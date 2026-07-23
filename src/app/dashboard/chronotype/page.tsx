"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Ring from "@/components/charts/Ring";
import { Moon, Brain, Sparkles, Clock } from "lucide-react";
import { CHRONOTYPE_LABELS, CHRONOTYPE_DESCRIPTIONS, CHRONOTYPE_PEAK_TIMES } from "@/lib/chronotype-utils";

export default function ChronotypePage() {
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
  const info = chronotype ? CHRONOTYPE_DESCRIPTIONS[chronotype] : null;
  const peaks = chronotype ? CHRONOTYPE_PEAK_TIMES[chronotype] : null;
  const confidence = (result?.confidence_score as number) ?? 0;

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Chronotype</span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
          {chronotype ? `You are an ${CHRONOTYPE_LABELS[chronotype]}` : "Your Chronotype"}
        </h1>
        {chronotype && <p className="m-0 text-[13px] mt-[4px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Confidence: {confidence}%</p>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : !chronotype ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <Moon size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Take the assessment to discover your chronotype</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          <div className="flex flex-col items-center p-[28px] rounded-[16px] text-center" style={{ background: "linear-gradient(135deg, #1A1668 0%, #35319B 100%)" }}>
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-[16px]" style={{ background: "rgba(255,255,255,0.1)" }}>
              <Moon size={36} stroke="#F59A00" strokeWidth={1.5} />
            </div>
            <h2 className="m-0 text-[24px] font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>{CHRONOTYPE_LABELS[chronotype]}</h2>
            <p className="m-0 mt-[8px] text-[14px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Poppins, sans-serif" }}>{info?.tagline}</p>
            <div className="mt-[16px]"><Ring value={confidence} size={80} color="#F59A00" label="Match" /></div>
          </div>

          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[14px] font-bold mb-[10px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>What This Means For You</h3>
            <p className="m-0 text-[13px] leading-[1.7]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{info?.description}</p>
          </div>

          {peaks && (
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-[12px]">
              {[
                { icon: <Brain size={20} />, label: "Peak Focus", value: peaks.focus, color: "#35319B" },
                { icon: <Sparkles size={20} />, label: "Creative Window", value: peaks.creative, color: "#F59A00" },
                { icon: <Clock size={20} />, label: "Ideal Sleep", value: peaks.sleep, color: "#2E7D32" },
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center text-center p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div className="w-[44px] h-[44px] rounded-xl flex items-center justify-center mb-[10px]" style={{ background: `${p.color}10` }}>
                    <span style={{ color: p.color }}>{p.icon}</span>
                  </div>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{p.label}</p>
                  <p className="m-0 mt-[4px] text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{p.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
