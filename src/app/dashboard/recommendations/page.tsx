"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Lightbulb, Moon, Sun, Battery, Brain, Heart, TrendingUp } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Productivity: <Brain size={18} />,
  Sleep: <Moon size={18} />,
  Energy: <Battery size={18} />,
  Fitness: <TrendingUp size={18} />,
  Routine: <Sun size={18} />,
  Circadian: <Sun size={18} />,
  Social: <Heart size={18} />,
};

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recs, setRecs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((d) => { setRecs(d.recommendations ?? []); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Recommendations</span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Recommendations — Tuned to your biology</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : recs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <Lightbulb size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Complete an assessment to get personalized recommendations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          {(recs as Array<Record<string, unknown>>).map((r, i) => (
            <div key={i}
              className="p-[20px] rounded-[16px] transition-all duration-200 cursor-default"
              style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div className="flex items-center gap-[10px] mb-[8px]">
                <span className="flex items-center justify-center w-[32px] h-[32px] rounded-lg" style={{ background: "rgba(245,154,0,0.1)" }}>
                  <span style={{ color: "#F59A00" }}>{categoryIcons[r.category as string] ?? <Lightbulb size={18} />}</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#F59A00", fontFamily: "Poppins, sans-serif" }}>{r.category as string}</span>
              </div>
              <p className="m-0 text-[14px] font-bold leading-[1.3]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{r.title as string}</p>
              <p className="m-0 mt-[6px] text-[12px] leading-[1.6]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{r.description as string}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
