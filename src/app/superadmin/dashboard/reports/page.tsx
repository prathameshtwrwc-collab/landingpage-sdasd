"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import Bars from "@/components/charts/Bars";
import { BarChart3, Users, ClipboardCheck, Shield, Globe } from "lucide-react";

export default function SuperAdminReportsPage() {
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
    <DashboardShell title="Worldwide Intelligence">
      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
            <StatCard label="Organizations" value={String(s?.organizations ?? 0)} icon={<Globe size={20} />} gradient="linear-gradient(135deg, #35319B, #7B76D4)" lightBg="rgba(53,49,155,0.06)" />
            <StatCard label="Members" value={String(s?.members ?? 0)} icon={<Users size={20} />} gradient="linear-gradient(135deg, #F59A00, #FFB74D)" lightBg="rgba(245,154,0,0.08)" />
            <StatCard label="Assessments" value={String(s?.assessments ?? 0)} icon={<ClipboardCheck size={20} />} gradient="linear-gradient(135deg, #2E7D32, #66BB6A)" lightBg="rgba(46,125,50,0.06)" />
            <StatCard label="Admins" value={String(s?.admins ?? 0)} icon={<Shield size={20} />} gradient="linear-gradient(135deg, #D32F2F, #FF6B6B)" lightBg="rgba(211,47,47,0.06)" />
          </div>

          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[15px] font-bold mb-[12px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Global Chronotype Distribution</h3>
            <Bars data={[
              { label: "Lark", value: cd.lark },
              { label: "Eagle", value: cd.eagle },
              { label: "Owl", value: cd.owl },
            ]} color="#35319B" h={100} />
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
