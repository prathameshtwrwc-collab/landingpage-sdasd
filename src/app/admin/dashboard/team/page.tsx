"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";;
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Users, Shield, Mail } from "lucide-react";
import { SkeletonStatCard, SkeletonTable, SkeletonChart, SkeletonHero } from "@/components/skeleton/SkeletonCard";

export default function TeamPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Array<Record<string, unknown>>>([]);
// const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin-portal").then((r) => r.json()).then((d) => { setAdmins(d.team ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Team"><>
      <button type="button" onClick={() => router.push("/admin/dashboard")}
        className="inline-flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer mb-[16px] transition-colors"
        style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#35319B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#98A2B3"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </button>{loading ? (
        <SkeletonTable rows={4} cols={4} />
      ) : (
        <div className="rounded-[16px] overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8F9FF" }}>
                  <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Admin</th>
                  <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Email</th>
                  <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Role</th>
                  <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr><td colSpan={4} className="px-[16px] py-[24px] text-center text-[13px]" style={{ color: "#AAA" }}>No team admins found</td></tr>
                ) : admins.map((a, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td className="px-[16px] py-[12px]">
                      <div className="flex items-center gap-[10px]">
                        <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: "linear-gradient(135deg, #35319B, #7B76D4)" }}>
                          {(a.first_name as string)?.[0] ?? "?"}{(a.last_name as string)?.[0] ?? ""}
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: "#171717" }}>{a.first_name as string} {a.last_name as string}</span>
                      </div>
                    </td>
                    <td className="px-[16px] py-[12px] text-[13px]" style={{ color: "#555" }}>{a.email as string}</td>
                    <td className="px-[16px] py-[12px]">
                      <span className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full" style={{ background: "rgba(53,49,155,0.06)", color: "#35319B", fontFamily: "Poppins, sans-serif" }}>{a.role as string}</span>
                    </td>
                    <td className="px-[16px] py-[12px]">
                      <span className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full" style={{
                        background: (a.status as string)?.toLowerCase() === "active" ? "rgba(46,125,50,0.1)" : "rgba(211,47,47,0.1)",
                        color: (a.status as string)?.toLowerCase() === "active" ? "#2E7D32" : "#D32F2F",
                        fontFamily: "Poppins, sans-serif",
                      }}>
                        {(a.status as string)?.toLowerCase() === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </></DashboardShell>
  );
}
