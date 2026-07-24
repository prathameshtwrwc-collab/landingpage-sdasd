"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";;
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import Bars from "@/components/charts/Bars";
import { BarChart3, Users, ClipboardCheck, Shield, Globe } from "lucide-react";

export default function SuperAdminReportsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
// const router = useRouter();
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
    <DashboardShell title="Worldwide Intelligence"><>
      <button type="button" onClick={() => router.push("/superadmin/dashboard")}
        className="inline-flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer mb-[16px] transition-colors"
        style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#35319B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#98A2B3"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </button>{loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
            <StatCard label="Organizations" value={String(s?.organizations ?? 0)} icon={<Globe size={20} />} />
            <StatCard label="Members" value={String(s?.members ?? 0)} icon={<Users size={20} />} />
            <StatCard label="Assessments" value={String(s?.assessments ?? 0)} icon={<ClipboardCheck size={20} />} />
            <StatCard label="Admins" value={String(s?.admins ?? 0)} icon={<Shield size={20} />} />
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
      </></DashboardShell>
  );
}
