"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Ring from "@/components/charts/Ring";
import { Moon, Clock, Activity, BarChart3, ArrowRight } from "lucide-react";
import { computeBlueprint, CHRONOTYPE_LABELS } from "@/lib/chronotype-utils";
import { useRouter } from "next/navigation";

export default function BlueprintPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<{ result: Record<string, unknown> | null; assessments: Record<string, unknown>[] } | null>(null);
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
  const assessments = (data?.assessments ?? []) as Record<string, unknown>[];
  const bp = computeBlueprint(chronotype, assessments.length);

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Blueprint</span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Your Personal Blueprint</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : !bp ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <BarChart3 size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Complete an assessment to generate your blueprint</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[12px]">
          {[
            { icon: <Moon size={20} />, label: "Chronotype", value: bp.chronotype, color: "#35319B" },
            { icon: <Clock size={20} />, label: "Optimal Sleep Window", value: bp.optimalWindow, color: "#F59A00" },
            { icon: <Activity size={20} />, label: "Sleep Need", value: bp.sleepNeed, color: "#2E7D32" },
            { icon: <BarChart3 size={20} />, label: "Cycle Length", value: bp.cycleLength, color: "#7B68AE" },
          ].map((item, i) => (
            <div key={i} className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center mb-[10px]" style={{ background: `${item.color}10` }}>
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{item.label}</p>
              <p className="m-0 mt-[4px] text-[15px] font-bold leading-[1.3]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{item.value}</p>
            </div>
          ))}

          <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-[16px]">
              <Ring value={bp.completeness} size={64} color="#F59A00" label="Complete" />
              <div>
                <p className="m-0 text-[15px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Blueprint Completeness</p>
                <p className="m-0 text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{assessments.length} assessment{assessments.length !== 1 ? "s" : ""} completed</p>
              </div>
            </div>
            <button type="button" onClick={() => router.push("/dashboard/recommendations")}
              className="inline-flex items-center gap-[6px] text-white text-[13px] font-semibold px-[20px] py-[10px] border-none cursor-pointer rounded-xl transition-all"
              style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 12px rgba(53,49,155,0.25)", fontFamily: "Poppins, sans-serif" }}>
              View Recommendations <ArrowRight size={16} stroke="white" />
            </button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
