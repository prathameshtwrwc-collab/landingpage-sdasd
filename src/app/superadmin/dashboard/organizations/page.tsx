"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Users, Plus, Copy, Check, Globe, Building2, Mail, Calendar, Power, ExternalLink, Edit2, Trash2, X, Save, Search } from "lucide-react";
import PaginationBar from "@/components/pagination/PaginationBar";
import { SkeletonStatCard, SkeletonTable, SkeletonChart, SkeletonHero } from "@/components/skeleton/SkeletonCard";

export default function OrganizationsPage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", organization_type: "Corporate", country: "", email: "" });
  const [creating, setCreating] = useState(false);
  const [createdCode, setCreatedCode] = useState("");
  const [copied, setCopied] = useState("");
  const [serverError, setServerError] = useState("");
  const [toggling, setToggling] = useState("");
  const [editingOrg, setEditingOrg] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", organization_type: "", country: "", email: "" });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOrgs = async (p?: number, search?: string) => {
    try {
      const params = new URLSearchParams();
      params.set("org_page", String(p ?? page));
      if (search ?? searchQuery) params.set("org_search", search ?? searchQuery);
      const res = await fetch("/api/admin?" + params.toString());
      const data = await res.json();
      if (data.error) { setServerError(data.error); return; }
      const o = data.organizations ?? {};
      setOrgs(o.data ?? []);
      setTotalPages(o.totalPages ?? 1);
      setTotalCount(o.total ?? 0);
      setPage(o.page ?? 1);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadOrgs(1); }, []);

  const createOrg = async () => {
    if (!form.name) return;
    setCreating(true);
    setServerError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      const res = await fetch("/api/admin?action=create_org", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) { setServerError(data.error); return; }
      if (data.success) {
        setCreatedCode(data.org.unique_code);
        setShowForm(false);
        setForm({ name: "", organization_type: "Corporate", country: "", email: "" });
        setCopied(data.org.unique_code);
        setTimeout(() => setCopied(""), 2000);
        await loadOrgs();
      }
    } catch { setServerError("Failed to create organization"); }
    setCreating(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  const toggleOrgLink = async (orgId: string, currentStatus: string | undefined, orgName: string) => {
    setToggling(orgId);
    const willActivate = currentStatus !== "active";
    try {
      const res = await fetch("/api/admin?action=toggle_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, active: willActivate }),
      });
      const data = await res.json();
      if (data.error) { setServerError(data.error); return; }
      await loadOrgs();
    } catch { setServerError("Failed to toggle link"); }
    setToggling("");
  };

  const startEditOrg = (o: Record<string, unknown>) => {
    setEditingOrg(o.id as string);
    setEditForm({
      name: (o.name as string) ?? "",
      organization_type: (o.organization_type as string) ?? "",
      country: (o.country as string) ?? "",
      email: (o.email as string) ?? "",
    });
  };

  const saveEditOrg = async () => {
    if (!editingOrg) return;
    try {
      const r = await fetch("/api/admin?action=edit_org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingOrg, ...editForm }),
      });
      const d = await r.json();
      if (d.error) { setServerError(d.error); return; }
      setEditingOrg(null);
      await loadOrgs();
    } catch { setServerError("Failed to edit org"); }
  };

  const confirmDeleteOrg = async (orgId: string) => {
    setDeleting(orgId);
    try {
      const r = await fetch("/api/admin?action=delete_org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });
      const d = await r.json();
      if (d.error) { setServerError(d.error); return; }
      await loadOrgs();
    } catch { setServerError("Failed to delete org"); }
    setDeleting(null);
  };

  return (
    <DashboardShell title="Organizations"><>
      <button type="button" onClick={() => router.push("/superadmin/dashboard")}
        className="inline-flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer mb-[16px] transition-colors"
        style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#35319B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#98A2B3"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </button>{loading ? (
        <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF" }}><SkeletonTable rows={8} cols={5} /></div>
      ) : (
        <>
          <div className="flex items-center gap-[12px] mb-[16px]">
            <div className="flex-1 flex items-center px-[14px] py-[10px] rounded-xl" style={{ border: "1.5px solid #E0E0E0", background: "#FFFFFF" }}>
              <Search size={16} stroke="#AAA" />
              <input type="text" placeholder="Search organizations..."
                className="flex-1 bg-transparent border-none ml-[10px] text-[14px] outline-none" style={{ fontFamily: "Poppins, sans-serif" }}
                value={searchQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchQuery(v);
                  if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                  searchTimerRef.current = setTimeout(() => { setLoading(true); loadOrgs(1, v || undefined); }, 300);
                }}
              />
            </div>
            <span className="text-[13px] font-medium shrink-0" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{totalCount} organizations</span>
          </div>
          <div className="flex items-center justify-between mb-[20px]">
            <span className="text-[13px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{orgs.length} organizations</span>
            <button type="button" onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-[6px] text-white text-[13px] font-semibold px-[16px] py-[10px] border-none cursor-pointer rounded-xl transition-all"
              style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", boxShadow: "0 4px 12px rgba(211,47,47,0.25)", fontFamily: "Poppins, sans-serif" }}
            >
              <Plus size={16} stroke="white" /> {showForm ? "Cancel" : "Onboard Org"}
            </button>
          </div>

          {serverError && (
            <div className="mb-[16px] p-[12px] rounded-xl text-[13px]" style={{ background: "rgba(211,47,47,0.08)", color: "#C62828", border: "1px solid rgba(211,47,47,0.15)" }}>
              {serverError}
            </div>
          )}

          {showForm && (
            <div className="p-[20px] rounded-[16px] mb-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 className="m-0 text-[15px] font-bold mb-[16px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Create New Organization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[16px]">
                {[
                  { label: "Organization Name", key: "name", value: form.name, onChange: (v: string) => setForm({ ...form, name: v }) },
                  { label: "Type", key: "type", value: form.organization_type, onChange: (v: string) => setForm({ ...form, organization_type: v }), options: ["Corporate", "Healthcare", "Education", "NGO", "Other"] },
                  { label: "Country", key: "country", value: form.country, onChange: (v: string) => setForm({ ...form, country: v }) },
                  { label: "Email", key: "email", value: form.email, onChange: (v: string) => setForm({ ...form, email: v }) },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-[11px] font-semibold mb-[4px] uppercase tracking-[0.04em]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{f.label}</label>
                    {f.options ? (
                      <select value={f.value} onChange={(e) => f.onChange(e.target.value)}
                        className="w-full px-[12px] py-[9px] text-[13px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.key === "email" ? "email" : "text"} value={f.value} onChange={(e) => f.onChange(e.target.value)}
                        className="w-full px-[12px] py-[9px] text-[13px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-[12px]">
                <button type="button" onClick={createOrg} disabled={creating}
                  className="text-white text-[13px] font-semibold px-[20px] py-[10px] border-none cursor-pointer rounded-xl"
                  style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", fontFamily: "Poppins, sans-serif" }}>
                  {creating ? "Creating..." : "Create Organization"}
                </button>
                {createdCode && (
                  <span className="text-[13px] font-semibold flex items-center gap-[6px]" style={{ color: "#2E7D32", fontFamily: "Poppins, sans-serif" }}>
                    Created! Code: <code style={{ color: "#F59A00" }}>{createdCode}</code>
                    <button type="button" onClick={() => { navigator.clipboard.writeText(createdCode); setCopied(createdCode); setTimeout(() => setCopied(""), 2000); }}
                      className="bg-transparent border-none cursor-pointer p-[2px]" style={{ color: "#888" }}>
                      {copied === createdCode ? <Check size={14} stroke="#2E7D32" /> : <Copy size={14} />}
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="rounded-[16px] overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8F9FF" }}>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Organization</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Code</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Type</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Link</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Created</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {orgs.map((o, i) => {
                    const isActive = o.link_active === true;
                    const isEditing = editingOrg === o.id;
                    return (
                      <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                        {isEditing ? (
                          <>
                            <td className="px-[16px] py-[8px]" colSpan={2}>
                              <div className="flex gap-[4px]">
                                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="w-full px-[8px] py-[5px] text-[11px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Name" />
                                <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                  className="w-full px-[8px] py-[5px] text-[11px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Email" />
                              </div>
                            </td>
                            <td className="px-[16px] py-[8px]">
                              <input value={editForm.organization_type} onChange={(e) => setEditForm({ ...editForm, organization_type: e.target.value })}
                                className="w-full px-[8px] py-[5px] text-[11px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Type" />
                            </td>
                            <td className="px-[16px] py-[8px]">
                              <input value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                className="w-full px-[8px] py-[5px] text-[11px] rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5" }} placeholder="Country" />
                            </td>
                            <td className="px-[16px] py-[8px] text-[11px]" style={{ color: "#888" }}>{o.created_at ? new Date(o.created_at as string).toLocaleDateString() : "—"}</td>
                            <td className="px-[16px] py-[8px]">
                              <div className="flex gap-[4px]">
                                <button onClick={saveEditOrg} className="bg-transparent border-none cursor-pointer p-[3px]" title="Save"><Check size={13} stroke="#2E7D32" /></button>
                                <button onClick={() => setEditingOrg(null)} className="bg-transparent border-none cursor-pointer p-[3px]" title="Cancel"><X size={13} stroke="#D32F2F" /></button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-[16px] py-[12px]">
                              <div className="flex items-center gap-[10px]">
                                <Building2 size={16} stroke="#35319B" className="shrink-0" />
                                <button type="button" onClick={() => router.push(`/superadmin/dashboard/organizations/${o.id}`)}
                                  className="bg-transparent border-none cursor-pointer group text-left">
                                  <span className="text-[13px] font-medium transition-colors" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                                    {o.name as string}
                                  </span>
                                  <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-[6px]" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>
                                    Click to view →
                                  </span>
                                </button>
                              </div>
                            </td>
                            <td className="px-[16px] py-[12px]">
                              <div className="flex items-center gap-[6px]">
                                <code className="text-[12px] font-mono font-semibold" style={{ color: "#F59A00" }}>{String(o.link_code || o.unique_code || "")}</code>
                                <button type="button" onClick={() => copyCode(String(o.link_code || o.unique_code || ""))}
                                  className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70" style={{ color: "#888" }}>
                                  {copied === o.link_code || copied === o.unique_code ? <Check size={14} stroke="#2E7D32" /> : <Copy size={14} />}
                                </button>
                              </div>
                            </td>
                            <td className="px-[16px] py-[12px]">
                              <span className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full" style={{ background: "rgba(53,49,155,0.06)", color: "#35319B", fontFamily: "Poppins, sans-serif" }}>{o.organization_type as string}</span>
                            </td>
                            <td className="px-[16px] py-[12px]">
                              <div className="flex items-center gap-[6px]">
                                <button type="button" onClick={() => toggleOrgLink(o.id as string, isActive ? "active" : "inactive", o.name as string)} disabled={toggling === o.id}
                                  className="inline-flex items-center gap-[5px] text-[11px] font-semibold px-[8px] py-[3px] rounded-full border-none cursor-pointer transition-all disabled:opacity-60"
                                  style={{
                                    background: isActive ? "rgba(46,125,50,0.1)" : "rgba(211,47,47,0.1)",
                                    color: isActive ? "#2E7D32" : "#D32F2F",
                                    fontFamily: "Poppins, sans-serif",
                                  }}>
                                  <Power size={11} /> {isActive ? "Active" : "Paused"}
                                </button>
                              </div>
                            </td>
                            <td className="px-[16px] py-[12px] text-[13px]" style={{ color: "#888" }}>{o.created_at ? new Date(o.created_at as string).toLocaleDateString() : "—"}</td>
                            <td className="px-[16px] py-[12px]">
                              <div className="flex items-center gap-[4px]">
                                <button type="button" onClick={() => startEditOrg(o)} className="bg-transparent border-none cursor-pointer p-[3px] hover:opacity-70" title="Edit"><Edit2 size={13} stroke="#35319B" /></button>
                                <button type="button" onClick={() => { if (confirm("Delete this organization?")) confirmDeleteOrg(o.id as string); }} disabled={deleting === o.id}
                                  className="bg-transparent border-none cursor-pointer p-[3px] hover:opacity-70 disabled:opacity-40" title="Delete">
                                  <Trash2 size={13} stroke="#D32F2F" />
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
            <PaginationBar page={page} totalPages={totalPages} total={totalCount} limit={20} onPageChange={(p) => { setLoading(true); loadOrgs(p); }} />
          </div>
        </>
      )}
      </></DashboardShell>
  );
}
