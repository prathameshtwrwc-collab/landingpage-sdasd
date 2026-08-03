"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cachedFetch } from "@/lib/client-cache";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ScoreBars from "@/components/charts/ScoreBars";
import { Zap } from "lucide-react";
import { CHRONOTYPE_LABELS } from "@/lib/chronotype-utils";

type Chronotype = "LARK" | "EAGLE" | "OWL";

interface EnergyData {
  result: Record<string, unknown> | null;
}

const SCORE_COLORS: Record<Chronotype, string> = {
  LARK: "#F59A00",
  EAGLE: "#35319B",
  OWL: "#7B68AE",
};

export default function EnergyPage() {
  const { user } = useAuth();
  const [data, setData] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      cachedFetch<EnergyData>(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const result = data?.result as Record<string, unknown> | undefined;
  const chronotype = (result?.chronotype as Chronotype) ?? null;
  const larkScore = (result?.lark_score as number) ?? 0;
  const eagleScore = (result?.eagle_score as number) ?? 0;
  const owlScore = (result?.owl_score as number) ?? 0;

  const scoreBars = chronotype
    ? [
        { label: "Lark", value: larkScore },
        { label: "Eagle", value: eagleScore },
        { label: "Owl", value: owlScore },
      ]
    : [];

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
        <div className="flex flex-col items-center gap-[12px]">
          <div className="flex items-center gap-[8px]">
            <span className="text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Chronotype Scores — {CHRONOTYPE_LABELS[chronotype]}</span>
          </div>
          <div className="w-full max-w-[640px]">
            <ScoreBars
              data={scoreBars}
              colors={scoreBars.map((s) => SCORE_COLORS[s.label as Chronotype])}
              height={240}
              accentColor={SCORE_COLORS[chronotype]}
            />
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
