"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import Bars from "@/components/charts/Bars";
import { BarChart3, Users, ClipboardCheck, Shield } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then((d) => { setStats(d.stats ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const s = stats as Record<string, unknown> | null;
  const cd = (s?.chronotypeDistribution as Record<string, number>) ?? { lark: 0, eagle: 0, owl: 0 };

  return (
    <DashboardShell title="Platform Analytics">
      {loading ? (
        <div className="flex items-center justify-center py-[60px]"><span className="text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Loading...</span></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[20px]">
            <StatCard label="Organizations" value={String(s?.organizations ?? "—")} icon={<Building2 size={20} />} gradient="linear-gradient(135deg, #35319B, #7B76D4)" lightBg="rgba(53,49,155,0.06)" />
            <StatCard label="Members" value={String(s?.members ?? "—")} icon={<Users size={20} />} gradient="linear-gradient(135deg, #F59A00, #FFB74D)" lightBg="rgba(245,154,0,0.08)" />
            <StatCard label="Assessments" value={String(s?.assessments ?? "—")} icon={<ClipboardCheck size={20} />} gradient="linear-gradient(135deg, #2E7D32, #66BB6A)" lightBg="rgba(46,125,50,0.06)" />
            <StatCard label="Admins" value={String(s?.admins ?? "—")} icon={<Shield size={20} />} gradient="linear-gradient(135deg, #D32F2F, #FF6B6B)" lightBg="rgba(211,47,47,0.06)" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
            <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 className="m-0 text-[14px] font-bold mb-[12px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Global Chronotype Distribution</h3>
              <Bars data={[
                { label: "Lark", value: cd.lark },
                { label: "Eagle", value: cd.eagle },
                { label: "Owl", value: cd.owl },
              ]} color="#35319B" h={100} />
            </div>

            <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 className="m-0 text-[14px] font-bold mb-[12px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Platform Overview</h3>
              <div className="grid grid-cols-2 gap-[12px]">
                {[
                  { label: "Organizations", value: s?.organizations, color: "#35319B" },
                  { label: "Members", value: s?.members, color: "#F59A00" },
                  { label: "Assessments", value: s?.assessments, color: "#2E7D32" },
                  { label: "Admins", value: s?.admins, color: "#D32F2F" },
                ].map((item, i) => (
                  <div key={i} className="p-[14px] rounded-xl text-center" style={{ background: `${item.color}08` }}>
                    <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{item.label}</p>
                    <p className="m-0 text-[22px] font-bold" style={{ color: item.color, fontFamily: "Poppins, sans-serif" }}>{String(item.value ?? "—")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}

function Building2(props: { size: number }) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  );
}
