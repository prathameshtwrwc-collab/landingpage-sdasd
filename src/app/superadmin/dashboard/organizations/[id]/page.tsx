"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Building2, Mail, Globe, Calendar, Users, ArrowLeft, ChevronRight, Eye, BarChart3, Activity, Tag, MapPin, Shield } from "lucide-react";

interface MemberRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number | null;
  gender: string | null;
  source_type: string;
  created_at: string;
}

export default function OrgDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.id as string;

  const [org, setOrg] = useState<Record<string, unknown> | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [orgAdmins, setOrgAdmins] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;
    Promise.all([
      fetch(`/api/admin-org?orgId=${encodeURIComponent(orgId)}`).then((r) => r.json()),
    ])
      .then(([data]) => {
        setOrg(data.org ?? null);
        setMembers(data.members ?? []);
        setOrgAdmins(data.admins ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orgId]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-[60px]"><span className="text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Loading...</span></div>
      </DashboardShell>
    );
  }

  if (!org) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-[60px]">
          <Building2 size={48} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Organization not found</p>
          <button type="button" onClick={() => router.push("/superadmin/dashboard/organizations")}
            className="mt-[12px] text-[13px] font-semibold px-[16px] py-[8px] rounded-lg border-none cursor-pointer text-white"
            style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", fontFamily: "Poppins, sans-serif" }}>
            Back to Organizations
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={org.name as string}>
      <button type="button" onClick={() => router.push("/superadmin/dashboard/organizations")}
        className="inline-flex items-center gap-[6px] text-[13px] font-medium bg-transparent border-none cursor-pointer mb-[16px] transition-colors"
        style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#35319B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#888"}>
        <ArrowLeft size={14} /> Back to Organizations
      </button>

      {/* Org Details Card */}
      <div className="p-[24px] rounded-[16px] mb-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-[12px] mb-[20px]">
          <div className="w-[44px] h-[44px] rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)" }}>
            <Building2 size={22} stroke="white" />
          </div>
          <div>
            <h3 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{org.name as string}</h3>
            <p className="m-0 text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Organization Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px] mb-[16px]">
          {[
            { label: "Code", value: org.unique_code as string, icon: <Tag size={14} stroke="#F59A00" />, bg: "rgba(245,154,0,0.06)", color: "#F59A00" },
            { label: "Type", value: org.organization_type as string, icon: <Shield size={14} stroke="#35319B" />, bg: "rgba(53,49,155,0.06)", color: "#35319B" },
            { label: "Country", value: (org.country as string) || "—", icon: <Globe size={14} stroke="#2E7D32" />, bg: "rgba(46,125,50,0.06)", color: "#2E7D32" },
            { label: "Email", value: (org.email as string) || "—", icon: <Mail size={14} stroke="#D32F2F" />, bg: "rgba(211,47,47,0.06)", color: "#D32F2F" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-[10px] p-[14px] rounded-xl" style={{ background: item.bg }}>
              {item.icon}
              <div>
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{item.label}</p>
                <p className="m-0 text-[14px] font-semibold" style={{ color: item.color, fontFamily: "Poppins, sans-serif" }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-[20px] text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
          <span className="flex items-center gap-[4px]"><Calendar size={12} /> Created: {org.created_at ? new Date(org.created_at as string).toLocaleDateString() : "—"}</span>
          <span className="flex items-center gap-[4px]"><Activity size={12} /> Status: <strong style={{ color: org.status === "ACTIVE" || org.status === "active" ? "#2E7D32" : "#D32F2F" }}>{(org.status as string) || "ACTIVE"}</strong></span>
        </div>
      </div>

      {/* Org Admins */}
      <div className="p-[20px] rounded-[16px] mb-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <h3 className="m-0 text-[15px] font-bold mb-[14px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
          <Shield size={16} stroke="#D32F2F" /> Admins ({orgAdmins.length})
        </h3>
        {orgAdmins.length === 0 ? (
          <p className="m-0 text-[13px] py-[12px] text-center" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>No admins assigned yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8F9FF" }}>
                  <th className="px-[12px] py-[8px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Name</th>
                  <th className="px-[12px] py-[8px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Email</th>
                  <th className="px-[12px] py-[8px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {orgAdmins.map((a, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td className="px-[12px] py-[8px] text-[13px] font-medium" style={{ color: "#171717" }}>{a.first_name as string} {a.last_name as string}</td>
                    <td className="px-[12px] py-[8px] text-[13px]" style={{ color: "#555" }}>{a.email as string}</td>
                    <td className="px-[12px] py-[8px]"><span className="text-[11px] font-semibold px-[6px] py-[2px] rounded-full" style={{ background: "rgba(211,47,47,0.06)", color: "#D32F2F" }}>{a.role as string}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Members Table */}
      <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <h3 className="m-0 text-[15px] font-bold mb-[14px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
          <Users size={16} stroke="#35319B" /> Members ({members.length})
        </h3>
        {members.length === 0 ? (
          <p className="m-0 text-[13px] py-[12px] text-center" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>No members yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8F9FF" }}>
                  <th className="px-[12px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Member</th>
                  <th className="px-[12px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Email</th>
                  <th className="px-[12px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Age</th>
                  <th className="px-[12px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Gender</th>
                  <th className="px-[12px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Source</th>
                  <th className="px-[12px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Joined</th>
                  <th className="px-[12px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td className="px-[12px] py-[10px]">
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "linear-gradient(135deg, #35319B, #7B76D4)" }}>
                          {(m.first_name?.[0] ?? "?").toUpperCase()}{(m.last_name?.[0] ?? "").toUpperCase()}
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: "#171717" }}>{m.first_name} {m.last_name}</span>
                      </div>
                    </td>
                    <td className="px-[12px] py-[10px] text-[13px]" style={{ color: "#555" }}>{m.email}</td>
                    <td className="px-[12px] py-[10px] text-[13px]" style={{ color: "#555" }}>{m.age ?? "—"}</td>
                    <td className="px-[12px] py-[10px] text-[13px]" style={{ color: "#555" }}>{m.gender ?? "—"}</td>
                    <td className="px-[12px] py-[10px]">
                      <span className="text-[10px] font-semibold px-[6px] py-[2px] rounded-full" style={{
                        background: m.source_type === "ORGANIZATION" ? "rgba(53,49,155,0.08)" : m.source_type === "REFERRAL" ? "rgba(245,154,0,0.08)" : "rgba(46,125,50,0.08)",
                        color: m.source_type === "ORGANIZATION" ? "#35319B" : m.source_type === "REFERRAL" ? "#F59A00" : "#2E7D32",
                      }}>{m.source_type}</span>
                    </td>
                    <td className="px-[12px] py-[10px] text-[13px]" style={{ color: "#888" }}>{m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}</td>
                    <td className="px-[12px] py-[10px]">
                      <button type="button" className="inline-flex items-center gap-[4px] text-[11px] font-medium bg-transparent border-none cursor-pointer transition-colors"
                        style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#D32F2F"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#35319B"}>
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
