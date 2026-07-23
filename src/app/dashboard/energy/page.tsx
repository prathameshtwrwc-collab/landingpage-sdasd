"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import MiniLine from "@/components/charts/MiniLine";
import { Zap, Brain, Sun, Moon, TrendingUp } from "lucide-react";
import { generateEnergyCurve, generateEnergyCards, ENERGY_LABELS, CHRONOTYPE_LABELS } from "@/lib/chronotype-utils";

export default function EnergyPage() {
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
  const cards = chronotype ? generateEnergyCards(chronotype) : [];

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Energy Timeline</span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Your 24-Hour Rhythm</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : !chronotype ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <Zap size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Complete an assessment to see your energy rhythm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px]">
          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-[8px] mb-[12px]">
              <TrendingUp size={16} stroke="#35319B" />
              <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Energy Level — {CHRONOTYPE_LABELS[chronotype]}</span>
            </div>
            <MiniLine data={curve} color="#F59A00" h={100} />
            <div className="flex justify-between mt-[4px]">
              {ENERGY_LABELS.map((l, i) => (
                <span key={i} className="text-[9px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{l}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[12px]">
            {cards.map((card, i) => (
              <div key={i} className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center mb-[12px]" style={{ background: i === 0 ? "rgba(53,49,155,0.08)" : i === 1 ? "rgba(245,154,0,0.08)" : i === 2 ? "rgba(46,125,50,0.08)" : "rgba(53,49,155,0.06)" }}>
                  {i === 0 ? <Brain size={18} stroke="#35319B" /> : i === 1 ? <Sun size={18} stroke="#F59A00" /> : i === 2 ? <Zap size={18} stroke="#2E7D32" /> : <Moon size={18} stroke="#35319B" />}
                </div>
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{card.title}</p>
                <p className="m-0 mt-[4px] text-[15px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{card.time}</p>
                <p className="m-0 mt-[4px] text-[12px] leading-[1.5]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
