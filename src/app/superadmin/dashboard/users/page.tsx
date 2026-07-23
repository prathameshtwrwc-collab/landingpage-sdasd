"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Users, Plus, Shield, Mail, Search, Globe, Calendar, Building2, Eye } from "lucide-react";

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

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then((data) => {
        setAdmins(data.admins ?? []);
        setMembers(data.members ?? []);
        setOrgs(data.organizations ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const createAdmin = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password || !form.organization_id) return;
    setCreating(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      await fetch("/api/admin?action=create_admin", { method: "POST", body: fd });
      setShowForm(false);
      setForm({ first_name: "", last_name: "", email: "", password: "", organization_id: "" });
      const refreshed = await fetch("/api/admin").then((r) => r.json());
      setAdmins(refreshed.admins ?? []);
      setMembers(refreshed.members ?? []);
    } catch {}
    setCreating(false);
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
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Admin</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Email</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Role</th>
                    <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Organization</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr><td colSpan={4} className="px-[16px] py-[24px] text-center text-[13px]" style={{ color: "#AAA" }}>No admins found</td></tr>
                  ) : filteredAdmins.map((a, i) => {
                    const org = a.organizations as Record<string, unknown> | null;
                    return (
                      <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
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
              <input type="text" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="Search members by name or email..."
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
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}>Joined</th>
                    <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase" style={{ color: "#888" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr><td colSpan={7} className="px-[14px] py-[24px] text-center text-[13px]" style={{ color: "#AAA" }}>No members found</td></tr>
                  ) : filteredMembers.map((m, i) => {
                    const org = orgs.find((o) => o.id === m.organization_id);
                    return (
                      <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
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
                        <td className="px-[14px] py-[10px] text-[12px]" style={{ color: "#888" }}>{m.created_at ? new Date(m.created_at as string).toLocaleDateString() : "—"}</td>
                        <td className="px-[14px] py-[10px]">
                          {org && (
                            <span className="flex items-center gap-[4px] text-[10px]" style={{ color: "#AAA" }}>
                              <Building2 size={10} /> {org.name as string}
                            </span>
                          )}
                        </td>
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
