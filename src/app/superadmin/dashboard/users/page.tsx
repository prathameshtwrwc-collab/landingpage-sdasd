"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Users, Plus, Shield, Mail, Search, Globe, Calendar, Building2, Eye, Edit2, Trash2, X, Check, Save } from "lucide-react";

export default function UsersPage() {
  const [admins, setAdmins] = useState<Array<Record<string, unknown>>>([]);
  const [members, setMembers] = useState<Array<Record<string, unknown>>>([]);
  const [orgs, setOrgs] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", organization_id: "" });
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [deleting, setDeleting] = useState<string | null>(null);
  const [serverError, setServerError] = useState("");

  const loadData = async () => {
    try {
      const r = await fetch("/api/admin");
      const data = await r.json();
      setAdmins(data.admins ?? []);
      setMembers(data.members ?? []);
      setOrgs(data.organizations ?? []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const createAdmin = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password || !form.organization_id) return;
    setCreating(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      await fetch("/api/admin?action=create_admin", { method: "POST", body: fd });
      setShowForm(false);
      setForm({ first_name: "", last_name: "", email: "", password: "", organization_id: "" });
      await loadData();
    } catch {}
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
      await loadData();
    } catch { setServerError("Failed to delete member"); }
    setDeleting(null);
  };

  const filteredAdmins = admins.filter((a) => {
    const q = search.toLowerCase();
    return (a.first_name as string ?? "").toLowerCase().includes(q) ||
           (a.last_name as string ?? "").toLowerCase().includes(q) ||
           (a.email as string ?? "").toLowerCase().includes(q);
  });

  const filteredMembers = members.filter((m) => {
    const q = memberSearch.toLowerCase();
    return (m.first_name as string ?? "").toLowerCase().includes(q) ||
           (m.last_name as string ?? "").toLowerCase().includes(q) ||
           (m.email as string ?? "").toLowerCase().includes(q);
  });

  return (
    <DashboardShell title="Users">
      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : (
        <>
          {serverError && (
            <div className="mb-[16px] p-[12px] rounded-xl text-[13px]" style={{ background: "rgba(211,47,47,0.08)", color: "#C62828", border: "1px solid rgba(211,47,47,0.15)" }}>
              {serverError} <button onClick={() => setServerError("")} className="bg-transparent border-none cursor-pointer ml-[8px]" style={{ color: "#C62828" }}>✕</button>
            </div>
          )}

          {/* ====== ADMINS SECTION ====== */}
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-[8px]">
              <Shield size={18} stroke="#D32F2F" />
              <h3 className="m-0 text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Admins ({admins.length})</h3>
            </div>
            <button type="button" onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-[6px] text-white text-[13px] font-semibold px-[16px] py-[10px] border-none cursor-pointer rounded-xl transition-all"
              style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", boxShadow: "0 4px 12px rgba(211,47,47,0.25)", fontFamily: "Poppins, sans-serif" }}>
              <Plus size={16} stroke="white" /> {showForm ? "Cancel" : "Add Admin"}
            </button>
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
                  {filteredAdmins.length === 0 ? (
                    <tr><td colSpan={5} className="px-[16px] py-[24px] text-center text-[13px]" style={{ color: "#AAA" }}>No admins found</td></tr>
                  ) : filteredAdmins.map((a, i) => {
                    const org = a.organizations as Record<string, unknown> | null;
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
                                <button onClick={() => startEditAdmin(a)} className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70" title="Edit"><Edit2 size={14} stroke="#35319B" /></button>
                                <button onClick={() => { if (confirm("Delete this admin?")) confirmDeleteAdmin(a.id as string); }} disabled={deleting === a.id}
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

          {/* ====== MEMBERS SECTION ====== */}
          <div className="flex items-center gap-[8px] mb-[16px] mt-[8px]">
            <Users size={18} stroke="#35319B" />
            <h3 className="m-0 text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>All Members ({members.length})</h3>
          </div>

          <div className="flex items-center gap-[12px] mb-[16px]">
            <div className="flex-1 flex items-center px-[14px] py-[10px] rounded-xl" style={{ border: "1.5px solid #E0E0E0", background: "#FFFFFF" }}>
              <Search size={16} stroke="#AAA" />
              <input type="text" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="Search members..."
                className="flex-1 bg-transparent border-none ml-[10px] text-[14px] outline-none" style={{ fontFamily: "Poppins, sans-serif" }} />
            </div>
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
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Joined</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr><td colSpan={8} className="px-[14px] py-[24px] text-center text-[13px]" style={{ color: "#AAA" }}>No members found</td></tr>
                  ) : filteredMembers.map((m, i) => {
                    const org = orgs.find((o) => o.id === m.organization_id);
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
                            <td className="px-[14px] py-[10px] text-[11px]" style={{ color: "#888" }}>{m.created_at ? new Date(m.created_at as string).toLocaleDateString() : "—"}</td>
                            <td className="px-[14px] py-[10px]">
                              <div className="flex items-center gap-[4px]">
                                <button onClick={() => startEditMember(m)} className="bg-transparent border-none cursor-pointer p-[3px] hover:opacity-70" title="Edit"><Edit2 size={12} stroke="#35319B" /></button>
                                <button onClick={() => { if (confirm("Delete this member?")) confirmDeleteMember(m.id as string); }} disabled={deleting === m.id}
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
          </div>
        </>
      )}
    </DashboardShell>
  );
}
