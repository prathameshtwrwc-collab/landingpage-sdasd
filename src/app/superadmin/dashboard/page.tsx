"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import Ring from "@/components/charts/Ring";
import Bars from "@/components/charts/Bars";
import MiniLine from "@/components/charts/MiniLine";
import { Shield, Users, BarChart3, Activity, Building2, UserCheck, ClipboardList, Eye, ArrowRight, TrendingUp, Globe, Sparkles, Clock, AlertTriangle, CheckCircle, UserPlus, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlatformStats {
  organizations: number;
  members: number;
  assessments: number;
  admins: number;
  chronotypeDistribution: { lark: number; eagle: number; owl: number };
}

interface OrgItem {
  id: string;
  name: string;
  organization_type: string;
  unique_code: string;
  status: string;
  country: string;
  created_at: string;
  link_active: boolean;
  link_code: string;
}

interface AdminItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  organization_id: string;
  organizations: { name: string } | null;
}

interface MemberItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  source_type: string;
  organization_id: string | null;
  created_at: string;
}

interface ApiResponse {
  stats: PlatformStats;
  organizations: { data: OrgItem[]; total: number; page: number; totalPages: number };
  admins: { data: AdminItem[]; total: number };
  members: { data: MemberItem[]; total: number };
}

export default function SuperAdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetch("/api/admin?org_limit=5&admin_limit=5&member_limit=5")
      .then((r) => r.json())
      .then((json: ApiResponse & { error?: string }) => {
        if (json.error) { setFetchError(json.error); setData(null); }
        else { setData(json); }
        setLoading(false);
      })
      .catch((err) => { setFetchError(err.message); setLoading(false); });
  }, []);

  const stats = data?.stats;
  const orgs = data?.organizations?.data ?? [];
  const admins = data?.admins?.data ?? [];
  const members = data?.members?.data ?? [];
  const recentMembers = members.slice(0, 5);
  const totalOrgs = data?.organizations?.total ?? 0;
  const totalAdmins = data?.admins?.total ?? 0;
  const totalMembers = data?.members?.total ?? 0;

  const memberSourceDist = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach((m) => {
      const src = m.source_type || "DIRECT";
      counts[src] = (counts[src] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label: label.charAt(0) + label.slice(1).toLowerCase(), value }));
  }, [members]);

  const completionRate = stats && stats.members > 0 ? Math.round((stats.assessments / Math.max(stats.members, 1)) * 100) : 0;
  const adminToOrgRatio = totalOrgs > 0 ? (totalAdmins / totalOrgs).toFixed(1) : "0";
  const membersPerOrg = totalOrgs > 0 ? Math.round(totalMembers / totalOrgs) : 0;

  const chronoBarData = stats?.chronotypeDistribution
    ? [
        { label: "Lark", value: stats.chronotypeDistribution.lark, color: "#f4b54d" },
        { label: "Eagle", value: stats.chronotypeDistribution.eagle, color: "#354a82" },
        { label: "Owl", value: stats.chronotypeDistribution.owl, color: "#7B68AE" },
      ]
    : [];

  const quickLinks = [
    { label: "Organizations", href: "/superadmin/dashboard/organizations", icon: <Building2 size={20} />, desc: "Manage all orgs", color: "#35319B" },
    { label: "Users", href: "/superadmin/dashboard/users", icon: <Users size={20} />, desc: `${totalMembers} total users`, color: "#F59A00" },
    { label: "Reports", href: "/superadmin/dashboard/reports", icon: <FileText size={20} />, desc: "Platform analytics", color: "#2E7D32" },
    { label: "Settings", href: "/superadmin/dashboard/settings", icon: <Shield size={20} />, desc: "System config", color: "#7B68AE" },
  ];

  if (authLoading || loading) {
    return (
      <DashboardShell>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[24px]">
          {[1,2,3,4].map(i => <div key={i} className="h-[100px] rounded-[16px] animate-pulse" style={{ background: "#f0f0f0" }} />)}
        </div>
        <div className="h-[300px] rounded-[16px] animate-pulse" style={{ background: "#f0f0f0" }} />
      </DashboardShell>
    );
  }

  if (!user || user.role !== "superadmin") {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
          <p className="text-[14px] text-[#888]">Access denied.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-[20px] p-[24px] md:p-[32px] mb-[24px]" style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FDF2F8 100%)" }}>
        <div className="absolute top-[-30px] right-[-20px] opacity-[0.04]"><Shield size={180} stroke="#35319B" strokeWidth={1} /></div>
        <div className="relative z-10">
          <p className="m-0 text-[13px] font-medium mb-[4px]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>Super Admin Console</p>
          <h2 className="m-0 text-[24px] md:text-[28px] font-bold leading-[1.2]" style={{ color: "#19164F", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>Platform Overview</h2>
          <div className="flex flex-wrap items-center gap-[16px] mt-[12px]">
            <div className="flex items-center gap-[6px] text-[13px]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
              <Globe size={14} /> {totalOrgs} organizations
            </div>
            <div className="flex items-center gap-[6px] text-[13px]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
              <Users size={14} /> {totalMembers} users
            </div>
            <div className="flex items-center gap-[6px] text-[13px]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
              <ClipboardList size={14} /> {stats?.assessments ?? 0} assessments
            </div>
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="mb-[16px] p-[14px] rounded-xl text-[13px]" style={{ background: "rgba(211,47,47,0.08)", color: "#C62828", border: "1px solid rgba(211,47,47,0.2)" }}>
          <strong>Error:</strong> {fetchError}
        </div>
      )}

      {!data ? (
        <div className="flex flex-col items-center justify-center py-[60px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <BarChart3 size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>No data available yet.</p>
        </div>
      ) : (
        <>
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[24px]">
            <StatCard label="Organizations" value={String(totalOrgs)} icon={<Building2 size={20} />} trend={`${stats?.organizations ?? 0} total`} trendUp />
            <StatCard label="Total Members" value={String(totalMembers)} icon={<Users size={20} />} trend={`${membersPerOrg}/org avg`} trendUp />
            <StatCard label="Assessments" value={String(stats?.assessments ?? 0)} icon={<Activity size={20} />} trend={`${completionRate}% completion`} trendUp />
            <StatCard label="Admins" value={String(totalAdmins)} icon={<UserCheck size={20} />} trend={`${adminToOrgRatio}/org ratio`} trendUp />
          </div>

          {/* ── Quick Links ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] mb-[24px]">
            {quickLinks.map((link) => (
              <button key={link.href} type="button" onClick={() => router.push(link.href)}
                className="w-full text-left border-none cursor-pointer rounded-[16px] p-[18px] transition-all hover:translate-y-[-2px]"
                style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)", fontFamily: "Poppins, sans-serif" }}>
                <div className="flex items-center gap-[10px] mb-[8px]">
                  <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: `${link.color}12` }}>
                    <span style={{ color: link.color }}>{link.icon}</span>
                  </div>
                  <span className="m-0 text-[14px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{link.label}</span>
                </div>
                <p className="m-0 text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{link.desc}</p>
              </button>
            ))}
          </div>

          {/* ── Main Content Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] mb-[24px]">

            {/* ── Left: Charts & Stats (2/3 width) ── */}
            <div className="lg:col-span-2 flex flex-col gap-[16px]">

              {/* Chronotype Distribution + Completion Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-[10px] mb-[14px]">
                    <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
                      <BarChart3 size={16} stroke="#35319B" />
                    </div>
                    <h3 className="m-0 text-[14px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Chronotype Distribution</h3>
                  </div>
                  <Bars data={chronoBarData} color="#35319B" h={120} />
                </div>
                <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-[10px] mb-[14px]">
                    <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: "rgba(245,154,0,0.08)" }}>
                      <TrendingUp size={16} stroke="#F59A00" />
                    </div>
                    <h3 className="m-0 text-[14px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Platform Health</h3>
                  </div>
                  <div className="flex flex-col items-center">
                    <Ring value={completionRate} size={90} color="#35319B" label="Completion" />
                    <div className="flex gap-[20px] mt-[12px]">
                      <div className="text-center">
                        <p className="m-0 text-[11px] font-semibold uppercase" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Members</p>
                        <p className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{totalMembers}</p>
                      </div>
                      <div className="text-center">
                        <p className="m-0 text-[11px] font-semibold uppercase" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Assessments</p>
                        <p className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{stats?.assessments ?? 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member Source Distribution */}
              <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-[10px] mb-[14px]">
                  <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: "rgba(46,125,50,0.06)" }}>
                    <UserPlus size={16} stroke="#2E7D32" />
                  </div>
                  <h3 className="m-0 text-[14px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Member Source Distribution</h3>
                </div>
                {memberSourceDist.length > 0 ? (
                  <div className="flex flex-col gap-[8px]">
                    {memberSourceDist.map((s) => (
                      <div key={s.label} className="flex items-center gap-[12px]">
                        <span className="text-[12px] font-medium w-[100px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{s.label}</span>
                        <div className="flex-1 h-[8px] rounded-full" style={{ background: "#F0F0F0" }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (s.value / Math.max(...memberSourceDist.map(x => x.value), 1)) * 100)}%`, background: "linear-gradient(90deg, #35319B, #818CF8)" }} />
                        </div>
                        <span className="text-[13px] font-bold w-[30px] text-right" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>No member data</p>
                )}
              </div>

              {/* Recent Orgs */}
              <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center justify-between mb-[14px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
                      <Building2 size={16} stroke="#35319B" />
                    </div>
                    <h3 className="m-0 text-[14px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Latest Organizations</h3>
                  </div>
                  <button type="button" onClick={() => router.push("/superadmin/dashboard/organizations")}
                    className="flex items-center gap-[4px] text-[12px] font-semibold bg-transparent border-none cursor-pointer"
                    style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>
                    View All <ArrowRight size={13} />
                  </button>
                </div>
                {orgs.length > 0 ? (
                  <div className="flex flex-col gap-[8px]">
                    {orgs.map((org) => (
                      <div key={org.id} className="flex items-center justify-between py-[8px] px-[12px] rounded-lg" style={{ background: "#F8F9FF" }}>
                        <div>
                          <p className="m-0 text-[13px] font-medium" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{org.name}</p>
                          <p className="m-0 text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{org.unique_code}{org.country ? ` · ${org.country}` : ""}</p>
                        </div>
                        <span className="flex items-center gap-[4px] text-[11px] font-medium px-[8px] py-[3px] rounded-full" style={{
                          background: org.link_active ? "rgba(46,125,50,0.08)" : "rgba(0,0,0,0.04)",
                          color: org.link_active ? "#2E7D32" : "#AAA",
                          fontFamily: "Poppins, sans-serif",
                        }}>
                          {org.link_active ? <CheckCircle size={11} /> : <Clock size={11} />}
                          {org.link_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>No organizations</p>
                )}
              </div>
            </div>

            {/* ── Right: Sidebar (1/3 width) ── */}
            <div className="flex flex-col gap-[16px]">

              {/* Admins Overview */}
              <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-[10px] mb-[14px]">
                  <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
                    <UserCheck size={16} stroke="#35319B" />
                  </div>
                  <h3 className="m-0 text-[14px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Admins</h3>
                </div>
                <p className="m-0 text-[28px] font-bold mb-[10px]" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>{totalAdmins}</p>
                {admins.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center gap-[10px] py-[7px] border-b last:border-0" style={{ borderColor: "#F5F5F5" }}>
                    <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}>
                      {(a.first_name?.charAt(0) || a.email?.charAt(0) || "?").toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-[12px] font-medium truncate" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{a.first_name ? `${a.first_name} ${a.last_name}` : a.email}</p>
                      <p className="m-0 text-[10px] truncate" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{a.organizations?.name ?? "—"}</p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-[6px] py-[2px] rounded" style={{
                      background: a.status === "ACTIVE" ? "rgba(46,125,50,0.08)" : "rgba(0,0,0,0.04)",
                      color: a.status === "ACTIVE" ? "#2E7D32" : "#AAA",
                      fontFamily: "Poppins, sans-serif",
                    }}>{a.status || "—"}</span>
                  </div>
                ))}
                <button type="button" onClick={() => router.push("/superadmin/dashboard/users")}
                  className="w-full mt-[10px] text-[12px] font-semibold py-[8px] rounded-lg border-none cursor-pointer transition-colors"
                  style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                  View All Admins
                </button>
              </div>

              {/* Recent Members */}
              <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-[10px] mb-[14px]">
                  <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: "rgba(245,154,0,0.08)" }}>
                    <UserPlus size={16} stroke="#F59A00" />
                  </div>
                  <h3 className="m-0 text-[14px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Latest Members</h3>
                </div>
                {recentMembers.length > 0 ? (
                  <div className="flex flex-col gap-[6px]">
                    {recentMembers.map((m) => (
                      <div key={m.id} className="flex items-center gap-[10px] py-[6px]">
                        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ background: "#35319B" }}>
                          {(m.first_name?.charAt(0) || m.email?.charAt(0) || "?").toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="m-0 text-[12px] font-medium truncate" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>
                            {m.first_name ? `${m.first_name} ${m.last_name}` : m.email}
                          </p>
                          <p className="m-0 text-[10px] truncate" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                            {m.source_type ?? "DIRECT"} · {m.created_at ? new Date(m.created_at).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>No members yet</p>
                )}
                <button type="button" onClick={() => router.push("/superadmin/dashboard/users")}
                  className="w-full mt-[10px] text-[12px] font-semibold py-[8px] rounded-lg border-none cursor-pointer transition-colors"
                  style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                  View All Members
                </button>
              </div>

              {/* At a Glance */}
              <div className="rounded-[16px] p-[22px]" style={{ background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)" }}>
                <h3 className="m-0 text-[14px] font-bold mb-[12px]" style={{ color: "#19164F", fontFamily: "Poppins, sans-serif" }}>At a Glance</h3>
                <div className="flex flex-col gap-[8px]">
                  {[
                    { label: "Avg Members/Org", value: membersPerOrg },
                    { label: "Admin Ratio", value: `${adminToOrgRatio} per org` },
                    { label: "Org Types", value: `${new Set(orgs.map(o => o.organization_type)).size} types` },
                    { label: "Completion Rate", value: `${completionRate}%` },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-[4px]">
                      <span className="text-[12px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{item.label}</span>
                      <span className="text-[13px] font-semibold" style={{ color: "#19164F", fontFamily: "Poppins, sans-serif" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
