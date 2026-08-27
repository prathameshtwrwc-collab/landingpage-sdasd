"use client";

import { useEffect, useState } from "react"
import { cachedFetch } from "@/lib/client-cache";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Users, Plus, Shield, Mail, Search, Globe, Calendar, Building2, Eye, Edit2, Trash2, X, Check, Save, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { SkeletonStatCard, SkeletonTable, SkeletonChart, SkeletonHero } from "@/components/skeleton/SkeletonCard";
import { exportCsv } from "@/components/admin/CsvExport";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import InfoModal, { type InfoField } from "@/components/dialogs/InfoModal";

const ADMIN_CSV_COLS = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "organizations", label: "Organization" },
];
const MEMBER_CSV_COLS = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "source_type", label: "Source Type" },
  { key: "created_at", label: "Joined" },
  { key: "organization_id", label: "Organization ID" },
];

const PAGE_SIZE = 10;

export default function UsersPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Array<Record<string, unknown>>>([]);
// const router = useRouter();
  const [members, setMembers] = useState<Array<Record<string, unknown>>>([]);
  const [orgs, setOrgs] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", organization_id: "" });
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [adminOrgFilter, setAdminOrgFilter] = useState("");
  const [adminRoleFilter, setAdminRoleFilter] = useState("");
  const [memberOrgFilter, setMemberOrgFilter] = useState("");
  const [memberSourceFilter, setMemberSourceFilter] = useState("");
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "admin" | "member"; id: string; name: string } | null>(null);
  const [viewInfo, setViewInfo] = useState<{ type: "admin" | "member"; data: Record<string, unknown> } | null>(null);
  const [viewInfoAnswers, setViewInfoAnswers] = useState<Array<{ question_text: string; option_text: string; lark_score?: number; eagle_score?: number; owl_score?: number }>>([]);
  const [serverError, setServerError] = useState("");
  const [exportMode, setExportMode] = useState<"full" | "contacts" | "emails">("full");
  const [adminPage, setAdminPage] = useState(1);
  const [memberPage, setMemberPage] = useState(1);

  useEffect(() => { setAdminPage(1); }, [search, adminOrgFilter, adminRoleFilter]);
  useEffect(() => { setMemberPage(1); }, [memberSearch, memberOrgFilter, memberSourceFilter]);

  const loadData = async () => {
    try {
      const r = await cachedFetch("/api/admin?org_limit=200&admin_limit=200&member_limit=200", undefined, { revalidate: true });
      const data = await r as Record<string, unknown>;
      const toArr = (val: unknown): Array<Record<string, unknown>> => {
        if (!val) return [];
        const obj = val as Record<string, unknown>;
        if (Array.isArray(obj?.data)) return obj.data as Array<Record<string, unknown>>;
        if (Array.isArray(val)) return val as Array<Record<string, unknown>>;
        return [];
      };
      setAdmins(toArr(data.admins));
      setMembers(toArr(data.members));
      setOrgs(toArr(data.organizations));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const openMemberInfo = async (m: Record<string, unknown>) => {
    setViewInfo({ type: "member", data: m });
    setViewInfoAnswers([]);
    const memberId = m.id as string | undefined;
    if (!memberId) return;
    try {
      const r = await fetch(`/api/member-detail?member_id=${encodeURIComponent(memberId)}`);
      const d = await r.json();
      if (!d.error) {
        setViewInfoAnswers((d.lastAssessmentAnswers ?? []) as Array<{ question_text: string; option_text: string; lark_score?: number; eagle_score?: number; owl_score?: number }>);
      }
    } catch {}
  };

  const createAdmin = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password || !form.organization_id) return;
    setCreating(true);
    setServerError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      const r = await fetch("/api/admin?action=create_admin", { method: "POST", body: fd });
      const text = await r.text();
      let d: Record<string, unknown> = {};
      try { d = JSON.parse(text); } catch { d = {}; }
      if (!r.ok || d.error) {
        setServerError((d.error as string) || `Request failed with status ${r.status}`);
        return;
      }
      setShowForm(false);
      setForm({ first_name: "", last_name: "", email: "", password: "", organization_id: "" });
      await loadData();
    } catch {
      setServerError("Failed to create admin");
    }
    setCreating(false);
  };

  const startEditAdmin = (a: Record<string, unknown>) => {
    setEditingAdmin(a.id as string);
    setEditData({ first_name: a.first_name as string, last_name: a.last_name as string, email: a.email as string });
  };

  const saveEditAdmin = async () => {
    if (!editingAdmin) return;
    try {
      const r = await fetch("/api/admin?action=edit_admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingAdmin, ...editData }),
      });
      const d = await r.json();
      if (d.error) { setServerError(d.error); return; }
      setEditingAdmin(null);
      await loadData();
    } catch { setServerError("Failed to edit admin"); }
  };

  const confirmDeleteAdmin = async (adminId: string) => {
    setDeleting(adminId);
    try {
      const r = await fetch("/api/admin?action=delete_admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId }),
      });
      const d = await r.json();
      if (d.error) { setServerError(d.error); return; }
      setConfirmDelete(null);
      await loadData();
    } catch { setServerError("Failed to delete admin"); }
    setDeleting(null);
  };

  const startEditMember = (m: Record<string, unknown>) => {
    setEditingMember(m.id as string);
    setEditData({
      first_name: (m.first_name as string) ?? "",
      last_name: (m.last_name as string) ?? "",
      email: (m.email as string) ?? "",
      age: String(m.age ?? ""),
      gender: (m.gender as string) ?? "",
    });
  };

  const saveEditMember = async () => {
    if (!editingMember) return;
    try {
      const r = await fetch("/api/admin?action=edit_member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingMember, ...editData }),
      });
      const d = await r.json();
      if (d.error) { setServerError(d.error); return; }
      setEditingMember(null);
      await loadData();
    } catch { setServerError("Failed to edit member"); }
  };

  const confirmDeleteMember = async (memberId: string) => {
    setDeleting(memberId);
    try {
      const r = await fetch("/api/admin?action=delete_member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      const d = await r.json();
      if (d.error) { setServerError(d.error); return; }
      setConfirmDelete(null);
      await loadData();
    } catch { setServerError("Failed to delete member"); }
    setDeleting(null);
  };

const filteredAdmins = admins.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (a.first_name as string ?? "").toLowerCase().includes(q) ||
      (a.last_name as string ?? "").toLowerCase().includes(q) ||
      (a.email as string ?? "").toLowerCase().includes(q);
    const org = a.organizations as Record<string, unknown> | null;
    const orgName = org?.name as string ?? "";
    const matchesOrg = adminOrgFilter === "" || orgName === adminOrgFilter;
    const matchesRole = adminRoleFilter === "" || (a.role as string) === adminRoleFilter;
    return matchesSearch && matchesOrg && matchesRole;
  });

  const filteredMembers = members.filter((m) => {
    const q = memberSearch.toLowerCase();
    const matchesSearch =
      (m.first_name as string ?? "").toLowerCase().includes(q) ||
      (m.last_name as string ?? "").toLowerCase().includes(q) ||
      (m.email as string ?? "").toLowerCase().includes(q);
    const matchesOrg = memberOrgFilter === "" || m.organization_id === memberOrgFilter;
    const matchesSource = memberSourceFilter === "" || (m.source_type as string) === memberSourceFilter;
    return matchesSearch && matchesOrg && matchesSource;
  });

  const adminTotalPages = Math.max(1, Math.ceil(filteredAdmins.length / PAGE_SIZE));
  const memberTotalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const pagedAdmins = filteredAdmins.slice((adminPage - 1) * PAGE_SIZE, adminPage * PAGE_SIZE);
  const pagedMembers = filteredMembers.slice((memberPage - 1) * PAGE_SIZE, memberPage * PAGE_SIZE);

  const goAdminPage = (p: number) => { if (p >= 1 && p <= adminTotalPages) setAdminPage(p); };
  const goMemberPage = (p: number) => { if (p >= 1 && p <= memberTotalPages) setMemberPage(p); };

  const PaginationControls = ({ page, totalPages, total, goPage }: { page: number; totalPages: number; total: number; goPage: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between px-[16px] py-[12px]" style={{ borderTop: "1px solid #F0F0F0" }}>
        <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
          Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
        </span>
        <div className="flex items-center gap-[6px]">
          <button type="button" onClick={() => goPage(page - 1)} disabled={page <= 1}
            className="flex items-center justify-center w-[36px] h-[36px] rounded-full border-none cursor-pointer disabled:opacity-30 disabled:cursor-default transition-all"
            style={{ color: page <= 1 ? "#BBB" : "white", background: page <= 1 ? "#F5F5F5" : "#35319B", fontFamily: "Poppins, sans-serif" }}>
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p: number;
            if (totalPages <= 7) p = i + 1;
            else if (page <= 4) p = i + 1;
            else if (page >= totalPages - 3) p = totalPages - 6 + i;
            else p = page - 3 + i;
            return (
              <button key={p} type="button" onClick={() => goPage(p)}
                className="flex items-center justify-center w-[36px] h-[36px] rounded-full border-none cursor-pointer text-[13px] font-semibold transition-all"
                style={{
                  color: p === page ? "#FFFFFF" : "#666",
                  background: p === page ? "#35319B" : "transparent",
                  border: p === page ? "none" : "1px solid #E5E7EB",
                  fontFamily: "Poppins, sans-serif",
                }}>
                {p}
              </button>
            );
          })}
          <button type="button" onClick={() => goPage(page + 1)} disabled={page >= totalPages}
            className="flex items-center justify-center w-[36px] h-[36px] rounded-full border-none cursor-pointer disabled:opacity-30 disabled:cursor-default transition-all"
            style={{ color: page >= totalPages ? "#BBB" : "white", background: page >= totalPages ? "#F5F5F5" : "#35319B", fontFamily: "Poppins, sans-serif" }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <DashboardShell title="Users"><>
      <button type="button" onClick={() => router.push("/superadmin/dashboard")}
        className="inline-flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer mb-[16px] transition-colors"
        style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#35319B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#98A2B3"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </button>{loading ? (
        <div><SkeletonTable rows={6} cols={4} /><div className="h-[40px]" /><SkeletonTable rows={8} cols={7} /></div>
      ) : (
        <>
          {serverError && (
            <div className="mb-[16px] p-[12px] rounded-xl text-[13px]" style={{ background: "rgba(211,47,47,0.08)", color: "#C62828", border: "1px solid rgba(211,47,47,0.15)" }}>
              {serverError} <button onClick={() => setServerError("")} className="bg-transparent border-none cursor-pointer ml-[8px]" style={{ color: "#C62828" }}>✕</button>
            </div>
          )}

          {/* ====== ADMINS SECTION ====== */}
          <div className="flex items-center justify-between flex-wrap gap-[10px] mb-[16px]">
            <div className="flex items-center gap-[8px]">
              <Shield size={18} stroke="#D32F2F" />
              <h3 className="m-0 text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Admins ({filteredAdmins.length})</h3>
            </div>
            <div className="flex items-center gap-[8px] flex-wrap">
              <button type="button" onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center gap-[6px] text-white text-[13px] font-semibold px-[16px] py-[10px] border-none cursor-pointer rounded-xl transition-all"
                style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", boxShadow: "0 4px 12px rgba(211,47,47,0.25)", fontFamily: "Poppins, sans-serif" }}>
                <Plus size={16} stroke="white" /> {showForm ? "Cancel" : "Add Admin"}
              </button>
              <select value={exportMode} onChange={(e) => setExportMode(e.target.value as "full" | "contacts" | "emails")}
                className="px-[10px] py-[7px] rounded-lg border text-[11px] cursor-pointer outline-none"
                style={{ borderColor: "#E0E0E0", color: "#555", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
                <option value="full">Full Details</option>
                <option value="contacts">Contacts Only</option>
                <option value="emails">Emails Only</option>
              </select>
              <button type="button" onClick={() => exportCsv(filteredAdmins, new Set(), ADMIN_CSV_COLS, exportMode, "admins")}
                className="flex items-center gap-[5px] px-[12px] py-[7px] rounded-lg border-none cursor-pointer text-[11px] font-semibold text-white transition-colors"
                style={{ background: "#35319B", fontFamily: "Poppins, sans-serif" }}>
                <Download size={13} /> CSV
              </button>
            </div>
          </div>

          {showForm && (
            <div className="p-[20px] rounded-[16px] mb-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 className="m-0 text-[15px] font-bold mb-[14px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Add Administrator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
                {[
                  { label: "First Name", key: "first_name", value: form.first_name, onChange: (v: string) => setForm({ ...form, first_name: v }) },
                  { label: "Last Name", key: "last_name", value: form.last_name, onChange: (v: string) => setForm({ ...form, last_name: v }) },
                  { label: "Email", key: "email", value: form.email, onChange: (v: string) => setForm({ ...form, email: v }) },
                  { label: "Set Password", key: "password", value: form.password, onChange: (v: string) => setForm({ ...form, password: v }) },
                  { label: "Organization", key: "org", value: form.organization_id, onChange: (v: string) => setForm({ ...form, organization_id: v }), options: orgs.map((o) => ({ value: o.id as string, label: o.name as string })) },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-[11px] font-semibold mb-[4px] uppercase tracking-[0.04em]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{f.label}</label>
                    {"options" in f ? (
                      <select value={f.value} onChange={(e) => f.onChange(e.target.value)} className="w-full px-[12px] py-[9px] text-[13px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}>
                        <option value="">Select organization</option>
                        {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input type={f.key === "email" ? "email" : f.key === "password" ? "password" : "text"} value={f.value} onChange={(e) => f.onChange(e.target.value)}
                        className="w-full px-[12px] py-[9px] text-[13px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }} />
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={createAdmin} disabled={creating}
                className="text-white text-[13px] font-semibold px-[20px] py-[10px] border-none cursor-pointer rounded-xl"
                style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", fontFamily: "Poppins, sans-serif" }}>
                {creating ? "Adding..." : "Add Administrator"}
              </button>
            </div>
          )}

          <div className="flex items-center gap-[12px] mb-[16px]">
            <div className="flex-1 flex items-center px-[14px] py-[10px] rounded-xl" style={{ border: "1.5px solid #E0E0E0", background: "#FFFFFF" }}>
              <Search size={16} stroke="#AAA" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search admins..."
                className="flex-1 bg-transparent border-none ml-[10px] text-[14px] outline-none" style={{ fontFamily: "Poppins, sans-serif" }} />
            </div>
            <select value={adminRoleFilter} onChange={(e) => setAdminRoleFilter(e.target.value)}
              className="px-[10px] py-[7px] rounded-lg border text-[12px] cursor-pointer outline-none"
              style={{ borderColor: "#E0E0E0", color: "#555", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <select value={adminOrgFilter} onChange={(e) => setAdminOrgFilter(e.target.value)}
              className="px-[10px] py-[7px] rounded-lg border text-[12px] cursor-pointer outline-none"
              style={{ borderColor: "#E0E0E0", color: "#555", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
              <option value="">All Organizations</option>
              {orgs.map((o) => <option key={o.id as string} value={o.name as string}>{o.name as string}</option>)}
            </select>
            {(adminOrgFilter || adminRoleFilter) && (
              <button type="button" onClick={() => { setAdminOrgFilter(""); setAdminRoleFilter(""); }}
                className="p-[4px] rounded hover:opacity-70 bg-transparent border-none cursor-pointer" title="Clear filters">
                <X size={14} stroke="#888" />
              </button>
            )}
          </div>

          <div className="rounded-[16px] overflow-hidden mb-[32px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8F9FF" }}>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase" style={{ color: "#888" }}>Admin</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase" style={{ color: "#888" }}>Email</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase" style={{ color: "#888" }}>Role</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase" style={{ color: "#888" }}>Organization</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase" style={{ color: "#888" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedAdmins.length === 0 ? (
                    <tr><td colSpan={5} className="px-[16px] py-[24px] text-center text-[13px]" style={{ color: "#AAA" }}>No admins found</td></tr>
                  ) : pagedAdmins.map((a, i) => {
                    const org = (a.organizations as Record<string, unknown> | null);
                    const isEditing = editingAdmin === a.id;
                    return (
                      <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                        {isEditing ? (
                          <>
                            <td className="px-[16px] py-[8px]" colSpan={2}>
                              <div className="flex gap-[6px]">
                                <input value={editData.first_name ?? ""} onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                                  className="w-full px-[8px] py-[6px] text-[12px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="First" />
                                <input value={editData.last_name ?? ""} onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                                  className="w-full px-[8px] py-[6px] text-[12px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Last" />
                                <input value={editData.email ?? ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                  className="w-full px-[8px] py-[6px] text-[12px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Email" />
                              </div>
                            </td>
                            <td className="px-[16px] py-[8px]"><span className="text-[11px] px-[6px] py-[2px] rounded-full" style={{ background: "rgba(211,47,47,0.06)", color: "#D32F2F" }}>{a.role as string}</span></td>
                            <td className="px-[16px] py-[8px] text-[12px]" style={{ color: "#555" }}>{org?.name as string ?? "—"}</td>
                            <td className="px-[16px] py-[8px]">
                              <div className="flex gap-[6px]">
                                <button onClick={saveEditAdmin} className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70" title="Save"><Check size={14} stroke="#2E7D32" /></button>
                                <button onClick={() => setEditingAdmin(null)} className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70" title="Cancel"><X size={14} stroke="#D32F2F" /></button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-[16px] py-[12px]">
                              <div className="flex items-center gap-[10px]">
                                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)" }}>
                                  {(a.first_name as string)?.[0] ?? "?"}{(a.last_name as string)?.[0] ?? ""}
                                </div>
                                <span className="text-[13px] font-medium" style={{ color: "#171717" }}>{a.first_name as string} {a.last_name as string}</span>
                              </div>
                            </td>
                            <td className="px-[16px] py-[12px] text-[13px]" style={{ color: "#555" }}>{a.email as string}</td>
                            <td className="px-[16px] py-[12px]">
                              <span className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full" style={{ background: "rgba(211,47,47,0.06)", color: "#D32F2F", fontFamily: "Poppins, sans-serif" }}>{a.role as string}</span>
                            </td>
                            <td className="px-[16px] py-[12px] text-[13px]" style={{ color: "#555" }}>{org?.name as string ?? "—"}</td>
                            <td className="px-[16px] py-[12px]">
                              <div className="flex items-center gap-[6px]">
                                <button onClick={() => setViewInfo({ type: "admin", data: a })} className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70" title="View Info"><Eye size={14} stroke="#7B68AE" /></button>
                                <button onClick={() => startEditAdmin(a)} className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70" title="Edit"><Edit2 size={14} stroke="#35319B" /></button>
                                <button onClick={() => setConfirmDelete({ type: "admin", id: a.id as string, name: `${a.first_name as string} ${a.last_name as string}`.trim() || (a.email as string) })} disabled={deleting === a.id}
                                  className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70 disabled:opacity-40" title="Delete">
                                  <Trash2 size={14} stroke="#D32F2F" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <PaginationControls page={adminPage} totalPages={adminTotalPages} total={filteredAdmins.length} goPage={goAdminPage} />

          {/* ====== MEMBERS SECTION ====== */}
          <div className="flex items-center justify-between flex-wrap gap-[10px] mb-[16px] mt-[8px]">
            <div className="flex items-center gap-[8px]">
              <Users size={18} stroke="#35319B" />
              <h3 className="m-0 text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>All Members ({filteredMembers.length})</h3>
            </div>
            <div className="flex items-center gap-[8px]">
              <select id="member-export-mode" className="px-[10px] py-[7px] rounded-lg border text-[11px] cursor-pointer outline-none"
                style={{ borderColor: "#E0E0E0", color: "#555", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
                <option value="full">Full Details</option>
                <option value="contacts">Contacts Only</option>
                <option value="emails">Emails Only</option>
              </select>
              <button type="button" onClick={() => exportCsv(filteredMembers, new Set(), MEMBER_CSV_COLS, (document.getElementById("member-export-mode") as HTMLSelectElement)?.value as "full" | "contacts" | "emails" || "full", "members")}
                className="flex items-center gap-[5px] px-[12px] py-[7px] rounded-lg border-none cursor-pointer text-[11px] font-semibold text-white transition-colors"
                style={{ background: "#35319B", fontFamily: "Poppins, sans-serif" }}>
                <Download size={13} /> CSV
              </button>
            </div>
          </div>

          <div className="flex items-center gap-[12px] mb-[16px]">
            <div className="flex-1 flex items-center px-[14px] py-[10px] rounded-xl" style={{ border: "1.5px solid #E0E0E0", background: "#FFFFFF" }}>
              <Search size={16} stroke="#AAA" />
              <input type="text" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="Search members..."
                className="flex-1 bg-transparent border-none ml-[10px] text-[14px] outline-none" style={{ fontFamily: "Poppins, sans-serif" }} />
            </div>
            <select value={memberSourceFilter} onChange={(e) => setMemberSourceFilter(e.target.value)}
              className="px-[10px] py-[7px] rounded-lg border text-[12px] cursor-pointer outline-none"
              style={{ borderColor: "#E0E0E0", color: "#555", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
              <option value="">All Sources</option>
              <option value="ORGANIZATION">Organization</option>
              <option value="REFERRAL">Referral</option>
              <option value="SELF_REGISTERED">Self-Registered</option>
            </select>
            <select value={memberOrgFilter} onChange={(e) => setMemberOrgFilter(e.target.value)}
              className="px-[10px] py-[7px] rounded-lg border text-[12px] cursor-pointer outline-none"
              style={{ borderColor: "#E0E0E0", color: "#555", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
              <option value="">All Organizations</option>
              {orgs.map((o) => <option key={o.id as string} value={o.id as string}>{o.name as string}</option>)}
            </select>
            {(memberOrgFilter || memberSourceFilter) && (
              <button type="button" onClick={() => { setMemberOrgFilter(""); setMemberSourceFilter(""); }}
                className="p-[4px] rounded hover:opacity-70 bg-transparent border-none cursor-pointer" title="Clear filters">
                <X size={14} stroke="#888" />
              </button>
            )}
          </div>

          <div className="rounded-[16px] overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8F9FF" }}>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Member</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Email</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Age</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Gender</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Source</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Org</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Chrono</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Joined</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedMembers.length === 0 ? (
                    <tr><td colSpan={9} className="px-[14px] py-[24px] text-center text-[13px]" style={{ color: "#AAA" }}>No members found</td></tr>
                  ) : pagedMembers.map((m, i) => {
                    const org = (Array.isArray(orgs) ? orgs : []).find((o: Record<string, unknown>) => o.id === m.organization_id);
                    const isEditing = editingMember === m.id;
                    return (
                      <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                        {isEditing ? (
                          <>
                            <td className="px-[14px] py-[6px]" colSpan={2}>
                              <div className="flex gap-[4px]">
                                <input value={editData.first_name ?? ""} onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                                  className="w-full px-[6px] py-[5px] text-[11px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="First" />
                                <input value={editData.last_name ?? ""} onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                                  className="w-full px-[6px] py-[5px] text-[11px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Last" />
                                <input value={editData.email ?? ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                  className="w-full px-[6px] py-[5px] text-[11px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Email" />
                              </div>
                            </td>
                            <td className="px-[14px] py-[6px]">
                              <input value={editData.age ?? ""} onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                                className="w-full px-[6px] py-[5px] text-[11px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Age" />
                            </td>
                            <td className="px-[14px] py-[6px]">
                              <input value={editData.gender ?? ""} onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                className="w-full px-[6px] py-[5px] text-[11px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Gender" />
                            </td>
                            <td className="px-[14px] py-[6px] text-[11px]">{m.source_type as string}</td>
                             <td className="px-[14px] py-[6px] text-[11px]">{org?.name as string ?? "—"}</td>
                             <td className="px-[14px] py-[6px] text-[11px]">
                               {(() => {
                                 const c = (m.latest_assessment as Record<string, unknown> | null)?.chronotype as string | undefined;
                                 if (!c) return "—";
                                 const label = c.charAt(0).toUpperCase();
                                 const bg = c.toUpperCase() === "EAGLE" ? "#30268F" : c.toUpperCase() === "LARK" ? "#EE8300" : c.toUpperCase() === "OWL" ? "#7B68AE" : "#888";
                                 return <span className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full text-white text-[10px] font-bold" style={{ background: bg, fontFamily: "Poppins, sans-serif" }}>{label}</span>;
                               })()}
                             </td>
                             <td className="px-[14px] py-[6px] text-[11px]">{m.created_at ? new Date(m.created_at as string).toLocaleDateString() : "—"}</td>
                            <td className="px-[14px] py-[6px]">
                              <div className="flex gap-[4px]">
                                <button onClick={saveEditMember} className="bg-transparent border-none cursor-pointer p-[3px]" title="Save"><Check size={13} stroke="#2E7D32" /></button>
                                <button onClick={() => setEditingMember(null)} className="bg-transparent border-none cursor-pointer p-[3px]" title="Cancel"><X size={13} stroke="#D32F2F" /></button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-[14px] py-[10px]">
                              <div className="flex items-center gap-[8px]">
                                <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "linear-gradient(135deg, #35319B, #7B76D4)" }}>
                                  {((m.first_name as string)?.[0] ?? "?").toUpperCase()}{((m.last_name as string)?.[0] ?? "").toUpperCase()}
                                </div>
                                <span className="text-[12px] font-medium" style={{ color: "#171717" }}>{m.first_name as string} {m.last_name as string}</span>
                              </div>
                            </td>
                            <td className="px-[14px] py-[10px] text-[12px]" style={{ color: "#555" }}>{m.email as string}</td>
                            <td className="px-[14px] py-[10px] text-[12px]" style={{ color: "#555" }}>{String(m.age ?? "—")}</td>
                            <td className="px-[14px] py-[10px] text-[12px]" style={{ color: "#555" }}>{String(m.gender ?? "—")}</td>
                            <td className="px-[14px] py-[10px]">
                              <span className="text-[10px] font-semibold px-[6px] py-[2px] rounded-full" style={{
                                background: (m.source_type as string) === "ORGANIZATION" ? "rgba(53,49,155,0.08)" : (m.source_type as string) === "REFERRAL" ? "rgba(245,154,0,0.08)" : "rgba(46,125,50,0.08)",
                                color: (m.source_type as string) === "ORGANIZATION" ? "#35319B" : (m.source_type as string) === "REFERRAL" ? "#F59A00" : "#2E7D32",
                              }}>{m.source_type as string}</span>
                            </td>
                            <td className="px-[14px] py-[10px] text-[11px]" style={{ color: "#888" }}>{org?.name as string ?? "—"}</td>
                            <td className="px-[14px] py-[10px] text-[11px]">
                              {(() => {
                                const c = (m.latest_assessment as Record<string, unknown> | null)?.chronotype as string | undefined;
                                if (!c) return <span style={{ color: "#AAA" }}>—</span>;
                                const label = c.charAt(0).toUpperCase();
                                const bg = c.toUpperCase() === "EAGLE" ? "#30268F" : c.toUpperCase() === "LARK" ? "#EE8300" : c.toUpperCase() === "OWL" ? "#7B68AE" : "#888";
                                return <span className="inline-flex items-center justify-center w-[24px] h-[24px] rounded-full text-white text-[11px] font-bold" style={{ background: bg, fontFamily: "Poppins, sans-serif" }}>{label}</span>;
                              })()}
                            </td>
                            <td className="px-[14px] py-[10px] text-[11px]" style={{ color: "#888" }}>{m.created_at ? new Date(m.created_at as string).toLocaleDateString() : "—"}</td>
                            <td className="px-[14px] py-[10px]">
                              <div className="flex items-center gap-[4px]">
                                <button onClick={() => openMemberInfo(m)} className="bg-transparent border-none cursor-pointer p-[3px] hover:opacity-70" title="View Info"><Eye size={12} stroke="#7B68AE" /></button>
                                <button onClick={() => startEditMember(m)} className="bg-transparent border-none cursor-pointer p-[3px] hover:opacity-70" title="Edit"><Edit2 size={12} stroke="#35319B" /></button>
                                <button onClick={() => setConfirmDelete({ type: "member", id: m.id as string, name: `${m.first_name as string} ${m.last_name as string}`.trim() || (m.email as string) })} disabled={deleting === m.id}
                                  className="bg-transparent border-none cursor-pointer p-[3px] hover:opacity-70 disabled:opacity-40" title="Delete">
                                  <Trash2 size={12} stroke="#D32F2F" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <PaginationControls page={memberPage} totalPages={memberTotalPages} total={filteredMembers.length} goPage={goMemberPage} />
          </div>
        </>
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete ${confirmDelete?.type === "admin" ? "admin" : "member"}?`}
        message={confirmDelete ? `This will permanently remove "${confirmDelete.name}" and cannot be undone.` : ""}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        busy={!!deleting}
        onCancel={() => { if (!deleting) setConfirmDelete(null); }}
        onConfirm={() => {
          if (!confirmDelete) return;
          if (confirmDelete.type === "admin") confirmDeleteAdmin(confirmDelete.id);
          else confirmDeleteMember(confirmDelete.id);
        }}
      />

      {/* View info dialog */}
      <InfoModal
        open={!!viewInfo}
        title={viewInfo ? (viewInfo.type === "admin" ? `${String(viewInfo.data.first_name ?? "")} ${String(viewInfo.data.last_name ?? "")}`.trim() : `${String(viewInfo.data.first_name ?? "")} ${String(viewInfo.data.last_name ?? "")}`.trim()) || "User" : ""}
        subtitle={viewInfo ? (viewInfo.data.email as string) ?? "" : ""}
        onClose={() => { setViewInfo(null); setViewInfoAnswers([]); }}
        avatar={viewInfo ? {
          initials: `${String((viewInfo.data.first_name as string)?.[0] ?? "?").toUpperCase()}${String((viewInfo.data.last_name as string)?.[0] ?? "").toUpperCase()}`,
          bg: viewInfo.type === "admin" ? "linear-gradient(135deg, #D32F2F, #FF6B6B)" : "linear-gradient(135deg, #35319B, #7B76D4)",
        } : undefined}
        fields={viewInfo ? buildInfoFields(viewInfo, orgs) : []}
        answers={viewInfo?.type === "member" ? viewInfoAnswers : undefined}
      />
      </></DashboardShell>
  );
}

function buildInfoFields(viewInfo: { type: "admin" | "member"; data: Record<string, unknown> }, orgs: Array<Record<string, unknown>>): InfoField[] {
  const d = viewInfo.data;
  const fmtDate = (v: unknown) => (v ? new Date(v as string).toLocaleDateString() : "—");
  const fmtDateTime = (v: unknown) => (v ? new Date(v as string).toLocaleString() : "—");
  const joinedOrg = (d.organizations as Record<string, unknown> | null)?.name as string | undefined;
  const fallbackOrg = (Array.isArray(orgs) ? orgs : []).find((o) => o.id === d.organization_id)?.name as string | undefined;
  const orgName = joinedOrg || fallbackOrg || "";
  const cap = (s: unknown) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1).toLowerCase() : "—");

  if (viewInfo.type === "admin") {
    return [
      { label: "Full Name", value: `${String(d.first_name ?? "")} ${String(d.last_name ?? "")}`.trim() },
      { label: "Email", value: String(d.email ?? "") },
      { label: "Role", value: String(d.role ?? ""), badge: { text: String(d.role ?? ""), bg: "rgba(211,47,47,0.08)", color: "#D32F2F" } },
      { label: "Status", value: String(d.status ?? ""), badge: { text: String(d.status ?? ""), bg: (d.status as string) === "ACTIVE" ? "rgba(46,125,50,0.08)" : "rgba(211,47,47,0.08)", color: (d.status as string) === "ACTIVE" ? "#2E7D32" : "#D32F2F" } },
      { label: "Organization", value: orgName || "—" },
      { label: "Clerk ID", value: String(d.clerk_user_id ?? "") || "—" },
      { label: "Created", value: fmtDate(d.created_at) },
      { label: "Updated", value: fmtDate(d.updated_at) },
      { label: "Admin ID", value: String(d.id ?? "") },
    ];
  }

  return [
    { label: "Full Name", value: `${String(d.first_name ?? "")} ${String(d.last_name ?? "")}`.trim() },
    { label: "Email", value: String(d.email ?? "") },
    { label: "Phone", value: String(d.phone ?? "") || "—" },
    { label: "Age", value: d.age != null && d.age !== "" ? String(d.age) : "—" },
    { label: "Gender", value: cap(d.gender) },
    { label: "Marital Status", value: cap(d.marital_status) },
    { label: "Department", value: String(d.department ?? "") || "—" },
    { label: "Occupation", value: String(d.occupation ?? "") || "—" },
    { label: "Country", value: String(d.country ?? "") || "—" },
    { label: "State", value: String(d.location ?? d.state ?? "") || "—" },
    { label: "City", value: String(d.city ?? "") || "—" },
    { label: "Pincode", value: String(d.pincode ?? "") || "—" },
    { label: "Source", value: String(d.source_type ?? ""), badge: { text: String(d.source_type ?? ""), bg: "rgba(53,49,155,0.08)", color: "#35319B" } },
    { label: "Referral Code", value: String(d.referral_code ?? "") || "—" },
    { label: "Organization", value: orgName || "—" },
    { label: "Created", value: fmtDateTime(d.created_at) },
    { label: "Updated", value: fmtDateTime(d.updated_at) },
    { label: "Member ID", value: String(d.id ?? "") },
    ...buildLatestAssessmentFields(d, fmtDateTime),
  ];
}

function buildLatestAssessmentFields(d: Record<string, unknown>, fmtDateTime: (v: unknown) => string): InfoField[] {
  const la = d.latest_assessment as Record<string, unknown> | null | undefined;
  if (!la) return [{ label: "Latest Assessment", value: "No assessment completed yet", badge: { text: "NONE", bg: "rgba(136,136,136,0.08)", color: "#888" } }];
  const chrono = String(la.chronotype ?? "");
  const cap = (s: unknown) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1).toLowerCase() : "—");
  return [
    { label: "Latest Assessment", value: "Completed", badge: { text: cap(chrono), bg: "rgba(53,49,155,0.08)", color: "#35319B" } },
    { label: "Chronotype", value: cap(chrono) },
    { label: "Total Score", value: la.total_score != null ? String(la.total_score) : "—" },
    { label: "Confidence", value: la.confidence_score != null ? `${la.confidence_score}%` : "—" },
    { label: "Lark / Eagle / Owl", value: `${la.lark_score ?? "—"} / ${la.eagle_score ?? "—"} / ${la.owl_score ?? "—"}` },
    { label: "Assessment Date", value: fmtDateTime(la.generated_at) },
  ];
}
