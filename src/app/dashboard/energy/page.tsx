"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cachedFetch } from "@/lib/client-cache";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ChronotypeDonutChart from "@/components/charts/ChronotypeDonutChart";
import { useThemeDark } from "@/lib/use-theme-dark";
import { Sunrise, Gauge, Zap } from "lucide-react";
import {
  CHRONOTYPE_LABELS,
  formatClock,
  generatePersonalizedEnergyCurve,
  type Chronotype,
} from "@/lib/chronotype-utils";

interface EnergyData {
  result: Record<string, unknown> | null;
  schedule?: { wakeTime: string | null; bedtime: string | null; peakFocus: string | null } | null;
}

const SHORT_LABELS: Record<Chronotype, string> = {
  LARK: "Lark",
  EAGLE: "Eagle",
  OWL: "Owl",
};

const DIMENSION_COLORS: Record<Chronotype, string> = {
  LARK: "#F59A00",
  EAGLE: "#35319B",
  OWL: "#7B68AE",
};

const DIMENSION_ORDER: Chronotype[] = ["LARK", "EAGLE", "OWL"];

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export default function EnergyPage() {
  const { user } = useAuth();
  const dark = useThemeDark();
  const [data, setData] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      cachedFetch<EnergyData>(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const result = data?.result as Record<string, unknown> | undefined;
  const chronotype = (result?.chronotype as Chronotype) ?? null;
  const larkScore = Number(result?.lark_score) || 0;
  const eagleScore = Number(result?.eagle_score) || 0;
  const owlScore = Number(result?.owl_score) || 0;
  const confidence = Math.max(0, Math.min(100, Number(result?.confidence_score) || 50));

  const scores: Record<Chronotype, number> = { LARK: larkScore, EAGLE: eagleScore, OWL: owlScore };
  const total = larkScore + eagleScore + owlScore;

  const dominantIndex = chronotype ? DIMENSION_ORDER.indexOf(chronotype) : 0;
  const accent = chronotype ? DIMENSION_COLORS[chronotype] : "#35319B";

  const curve = chronotype
    ? generatePersonalizedEnergyCurve(chronotype, larkScore, eagleScore, owlScore, confidence)
    : [];
  let peakHour = 6;
  if (curve.length > 0) {
    let peakIdx = 0;
    curve.forEach((v, i) => {
      if (v > curve[peakIdx]) peakIdx = i;
    });
    peakHour = 6 + peakIdx * 2;
  }

  // Accurate peak energy range from the member's actual assessment answer
  // (Q3 "When do you feel most alert and productive?").
  // e.g. "Early morning (6:00 AM – 9:00 AM)" → "6:00 AM – 9:00 AM"
  const rawPeak = data?.schedule?.peakFocus ?? null;
  const peakEnergyRange = rawPeak
    ? (rawPeak.match(/\(([^)]+)\)/) ?? [null, rawPeak])[1].trim()
    : null;

  const panelBg = dark ? "#1A1A2E" : "#FFFFFF";
  const panelBorder = dark ? "#2A2A4A" : "#E6E8F0";
  const headingColor = dark ? "#E0E0E0" : "#171717";
  const mutedColor = dark ? "#8B8BA6" : "#667085";
  const divider = dark ? "#2A2A4A" : "#F1F4FA";

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
          Energy Timeline
        </span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: headingColor, fontFamily: "Poppins, sans-serif" }}>
          Your Chronotype Profile
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]" style={{ color: mutedColor, fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
          Loading your energy profile...
        </div>
      ) : !chronotype ? (
        <div
          className="flex flex-col items-center justify-center py-[44px] rounded-[16px]"
          style={{ border: "1.5px dashed #D8D8E4", background: dark ? "rgba(255,255,255,0.02)" : "#FFFFFF" }}
        >
          <Zap size={38} stroke={mutedColor} strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: mutedColor, fontFamily: "Poppins, sans-serif" }}>
            Complete an assessment to see your chronotype profile
          </p>
        </div>
      ) : (
        <div
          className="rounded-[18px] flex flex-col md:flex-row items-center gap-[16px] md:gap-[40px] px-[14px] py-[24px] md:px-[36px] md:py-[28px]"
          style={{
            background: panelBg,
            border: `1px solid ${panelBorder}`,
            boxShadow: dark ? "none" : "0 2px 12px rgba(23,23,23,0.05)",
          }}
        >
          <div className="shrink-0">
            <ChronotypeDonutChart
              segments={DIMENSION_ORDER.map((c) => ({ label: SHORT_LABELS[c], value: scores[c], color: DIMENSION_COLORS[c] }))}
              dominantIndex={dominantIndex}
              centerTitle={chronotype ? SHORT_LABELS[chronotype] : ""}
              centerSubtitle={`${confidence}% profile confidence`}
            />
          </div>

          <div className="flex-1 w-full min-w-0 md:max-w-[320px]">
            <p className="m-0 mb-[4px] text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: mutedColor, fontFamily: "Poppins, sans-serif" }}>
              Your chronotype dimensions
            </p>

            {DIMENSION_ORDER.map((c, i) => {
              const isDominant = i === dominantIndex;
              const share = total > 0 ? Math.round((scores[c] / total) * 100) : 0;
              return (
                <div key={c} className="flex items-center justify-between" style={{ padding: "7px 0" }}>
                  <div className="flex items-center gap-[10px]">
                    <span
                      className="inline-block"
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: DIMENSION_COLORS[c],
                        opacity: isDominant ? 1 : 0.45,
                        boxShadow: isDominant ? `0 0 8px ${DIMENSION_COLORS[c]}` : "none",
                      }}
                    />
                    <span className="text-[13px]" style={{ fontWeight: isDominant ? 700 : 500, color: headingColor, fontFamily: "Poppins, sans-serif" }}>
                      {SHORT_LABELS[c]}
                    </span>
                    {isDominant && (
                      <span
                        className="text-[9px] font-bold rounded-full px-[6px] py-[2px]"
                        style={{ background: hexToRgba(accent, 0.12), color: accent, fontFamily: "Poppins, sans-serif", letterSpacing: "0.03em" }}
                      >
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <span className="text-[11px]" style={{ color: mutedColor, fontFamily: "Poppins, sans-serif" }}>
                      {scores[c]} pts
                    </span>
                    <span className="text-[13px] font-bold" style={{ color: headingColor, fontFamily: "Poppins, sans-serif", minWidth: 42, textAlign: "right" }}>
                      {share}%
                    </span>
                  </div>
                </div>
              );
            })}

            <div style={{ borderTop: `1px solid ${divider}`, marginTop: "10px", paddingTop: "6px" }}>
              <div className="flex items-center justify-between" style={{ padding: "7px 0" }}>
                <div className="flex items-center gap-[10px]">
                  <Sunrise size={15} style={{ color: accent }} />
                  <span className="text-[13px] font-medium" style={{ color: mutedColor, fontFamily: "Poppins, sans-serif" }}>
                    Peak energy
                  </span>
                </div>
                <span className="text-[13px] font-bold text-right" style={{ color: headingColor, fontFamily: "Poppins, sans-serif" }}>
                  {peakEnergyRange ?? formatClock(peakHour)}
                </span>
              </div>
              <div className="flex items-center justify-between" style={{ padding: "7px 0" }}>
                <div className="flex items-center gap-[10px]">
                  <Gauge size={15} style={{ color: accent }} />
                  <span className="text-[13px] font-medium" style={{ color: mutedColor, fontFamily: "Poppins, sans-serif" }}>
                    Profile confidence
                  </span>
                </div>
                <span className="text-[13px] font-bold" style={{ color: headingColor, fontFamily: "Poppins, sans-serif" }}>
                  {confidence}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
