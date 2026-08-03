"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Phone, Mail, Calendar, Clock, MapPin, Search, ChevronLeft, ChevronRight, ChevronDown, CheckCircle, XCircle, Clock as ClockIcon, Eye, Trash2, Download, Stethoscope, UserRoundCheck } from "lucide-react";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import InfoModal from "@/components/dialogs/InfoModal";
import ConsultPatientModal from "@/components/consult/ConsultPatientModal";
import { useAuth } from "@/components/auth/AuthProvider";

interface ConsultationLead {
  id: string;
  fname: string;
  lname: string;
  age: string;
  gender: string;
  marital_status: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  email: string;
  phone: string;
  schedule_date: string;
  schedule_time: string;
  status: string;
  notes: string | null;
  consulted_by?: string | null;
  consult_notes?: string | null;
  consulted_at?: string | null;
  created_at: string;
}

interface ApiResponse {
  data: ConsultationLead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_OPTIONS = ["PENDING", "CONTACTED", "SCHEDULED", "COMPLETED", "CANCELLED"] as const;

const STATUS_STYLES: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  PENDING: { bg: "rgba(245,154,0,0.1)", color: "#F59A00", icon: <ClockIcon size={12} /> },
  CONTACTED: { bg: "rgba(53,49,155,0.08)", color: "#35319B", icon: <Phone size={12} /> },
  SCHEDULED: { bg: "rgba(46,125,50,0.08)", color: "#2E7D32", icon: <Calendar size={12} /> },
  COMPLETED: { bg: "rgba(46,125,50,0.1)", color: "#2E7D32", icon: <CheckCircle size={12} /> },
  CANCELLED: { bg: "rgba(211,47,47,0.08)", color: "#D32F2F", icon: <XCircle size={12} /> },
};

export default function ConsultationLeadsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState<ConsultationLead | null>(null);
  const [consultingLead, setConsultingLead] = useState<ConsultationLead | null>(null);
  const [viewConsultLead, setViewConsultLead] = useState<ConsultationLead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (statusFilter) params.set("status", statusFilter);
    if (searchQuery) params.set("search", searchQuery);

    fetch(`/api/consultation-leads?${params}`)
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [page, statusFilter, searchQuery]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpenId) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-status-dropdown]")) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpenId]);

  const doSearch = () => {
    setPage(1);
    setSearchQuery(searchInput);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/consultation-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed");
      fetchLeads();
      setSelectedLead(null);
    } catch {}
  };

  const deleteLead = async (id: string) => {
    try {
      const res = await fetch("/api/consultation-leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed");
      setDeleteConfirm(null);
      setSelectedLead(null);
      fetchLeads();
    } catch {}
  };

  const handleConsultSaved = () => {
    fetchLeads();
    // Refresh the open detail modal with the updated lead data.
    if (selectedLead && consultingLead && selectedLead.id === consultingLead.id) {
      const fresh = data?.data.find((l) => l.id === consultingLead.id);
      if (fresh) setSelectedLead(fresh);
    }
    setConsultingLead(null);
  };

  return (
    <DashboardShell title="Consultation Leads">
      <div className="mb-[20px]">
        <p className="m-0 text-[13px] font-medium" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
          {data ? `${data.total} total lead(s)` : "Loading..."}
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-[12px] mb-[20px]">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#AAA", pointerEvents: "none" }} />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-[36px] pr-[12px] py-[9px] text-[13px] rounded-lg outline-none"
            style={{ border: "1.5px solid #E0E0E0", fontFamily: "Poppins, sans-serif", background: "#FFF" }}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-[12px] py-[9px] text-[13px] rounded-lg outline-none cursor-pointer"
          style={{ border: "1.5px solid #E0E0E0", fontFamily: "Poppins, sans-serif", background: "#FFF" }}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <button type="button" onClick={doSearch}
          className="px-[16px] py-[9px] text-[13px] font-semibold rounded-lg border-none cursor-pointer text-white transition-colors"
          style={{ background: "#35319B", fontFamily: "Poppins, sans-serif" }}>
          Search
        </button>
        {data && data.data.length > 0 && (
          <button type="button" onClick={() => {
            const cols = [
              { key: "fname", label: "First Name" }, { key: "lname", label: "Last Name" },
              { key: "age", label: "Age" }, { key: "gender", label: "Gender" },
              { key: "marital_status", label: "Marital Status" }, { key: "email", label: "Email" },
              { key: "phone", label: "Phone" }, { key: "country", label: "Country" },
              { key: "state", label: "State" }, { key: "city", label: "City" },
              { key: "pincode", label: "Pincode" },
              { key: "schedule_date", label: "Schedule Date" }, { key: "schedule_time", label: "Schedule Time" },
              { key: "status", label: "Status" }, { key: "created_at", label: "Submitted At" },
            ];
            const csvRows: string[][] = [cols.map((c) => c.label)];
            data.data.forEach((lead) => {
              csvRows.push(cols.map((c) => {
                const val = (lead as unknown as Record<string, unknown>)[c.key];
                const s = val === null || val === undefined ? "" : String(val);
                return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
              }));
            });
            const csv = csvRows.map((r) => r.join(",")).join("\r\n");
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;bom" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "consultation-leads.csv"; a.click();
            URL.revokeObjectURL(url);
          }}
            className="px-[16px] py-[9px] text-[13px] font-semibold rounded-lg border cursor-pointer transition-colors"
            style={{ borderColor: "#E0E0E0", color: "#555", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
            <Download size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} /> Export CSV
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
        {loading ? (
          <div className="flex items-center justify-center py-[60px]">
            <div className="w-[24px] h-[24px] rounded-full border-2 border-[#35319B] border-t-transparent animate-spin" />
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="flex flex-col items-center py-[60px]">
            <Phone size={40} stroke="#CCC" strokeWidth={1.5} />
            <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>No consultation leads found</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-[12px] px-[20px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: "#888", fontFamily: "Poppins, sans-serif", borderBottom: "1px solid #F0F0F0" }}>
              <span>Name</span>
              <span>Contact</span>
              <span>Consult</span>
              <span>Scheduled</span>
              <span>Status</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table rows */}
            {data.data.map((lead) => (
              <div key={lead.id} className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-[8px] md:gap-[12px] px-[20px] py-[14px] items-start" style={{ borderBottom: "1px solid #F8F8F8" }}>
                <div className="flex flex-col md:flex-row md:items-center gap-[4px]">
                  <span className="text-[14px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                    {lead.fname} {lead.lname}
                  </span>
                  <div className="flex items-center gap-[6px] md:hidden">
                    <span className="text-[11px]" style={{ color: "#888" }}>{lead.age} · {lead.gender}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[12px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif", wordBreak: "break-all" }}>{lead.email}</span>
                  <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{lead.phone}</span>
                </div>
                <div className="flex items-center flex-wrap gap-[8px]">
                  {lead.consulted_by ? (
                    <>
                      <span className="inline-flex items-center gap-[5px] text-[11px] font-semibold px-[9px] py-[4px] rounded-full"
                        style={{ background: "rgba(46,125,50,0.08)", color: "#2E7D32", fontFamily: "Poppins, sans-serif" }}>
                        <UserRoundCheck size={12} /> {lead.consulted_by}
                      </span>
                      <button type="button" onClick={() => setViewConsultLead(lead)}
                        className="flex items-center justify-center w-[28px] h-[28px] rounded-lg border-none cursor-pointer transition-colors hover:opacity-80"
                        style={{ color: "#2E7D32", background: "rgba(46,125,50,0.08)" }}
                        title="View Consultation Info">
                        <Eye size={13} />
                      </button>
                      <button type="button" onClick={() => setConsultingLead(lead)}
                        className="inline-flex items-center gap-[5px] text-[11px] font-semibold px-[10px] py-[5px] rounded-lg border-none cursor-pointer transition-colors hover:opacity-80"
                        style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}
                        title="Update Consultation">
                        <Stethoscope size={12} /> Update
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setConsultingLead(lead)}
                      className="inline-flex items-center gap-[5px] text-[11px] font-semibold px-[10px] py-[5px] rounded-lg border-none cursor-pointer transition-colors hover:opacity-80"
                      style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                      <Stethoscope size={13} /> Consult
                    </button>
                  )}
                  {lead.consult_notes && (
                    <span className="inline-flex items-center gap-[4px] text-[11px] px-[8px] py-[3px] rounded-full" style={{ background: "#F1F1F5", color: "#888", fontFamily: "Poppins, sans-serif" }}>
                      <Mail size={11} /> Notes
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[12px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{lead.schedule_date}</span>
                  <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{lead.schedule_time}</span>
                </div>
                {/* Status - click to open dropdown */}
                <div className="relative" data-status-dropdown>
                  <button type="button" onClick={() => setDropdownOpenId(dropdownOpenId === lead.id ? null : lead.id)}
                    className="inline-flex items-center gap-[4px] border-none cursor-pointer rounded-full px-[8px] py-[3px] transition-colors hover:opacity-80"
                    style={{ background: (STATUS_STYLES[lead.status] || STATUS_STYLES.PENDING).bg, color: (STATUS_STYLES[lead.status] || STATUS_STYLES.PENDING).color, fontFamily: "Poppins, sans-serif" }}>
                    {(STATUS_STYLES[lead.status] || STATUS_STYLES.PENDING).icon}
                    <span className="text-[11px] font-semibold">{lead.status.charAt(0) + lead.status.slice(1).toLowerCase()}</span>
                    <ChevronDown size={10} />
                  </button>
                  {dropdownOpenId === lead.id && (
                    <div className="absolute right-0 top-full mt-[4px] z-50 min-w-[140px] rounded-lg overflow-hidden shadow-lg"
                      style={{ background: "#FFF", border: "1px solid #E0E0E0" }}>
                      {STATUS_OPTIONS.map((s) => {
                        const st = STATUS_STYLES[s];
                        return (
                          <button key={s} type="button" onClick={() => { updateStatus(lead.id, s); setDropdownOpenId(null); }}
                            className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-medium border-none cursor-pointer transition-colors hover:opacity-80"
                            style={{ background: lead.status === s ? `${st.bg}` : "#FFF", color: st.color, fontFamily: "Poppins, sans-serif" }}>
                            {st.icon}
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                            {lead.status === s && <span className="ml-auto text-[10px]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {/* Actions */}
                <div className="flex items-center justify-center gap-[4px]">
                  <button type="button" onClick={() => setSelectedLead(lead)}
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-lg border-none cursor-pointer transition-colors"
                    style={{ color: "#35319B", background: "rgba(53,49,155,0.06)" }}
                    title="View Details">
                    <Eye size={14} />
                  </button>
                  {deleteConfirm === lead.id ? (
                    <div className="flex items-center gap-[4px]">
                      <button type="button" onClick={() => deleteLead(lead.id)}
                        className="text-[10px] font-semibold px-[8px] py-[4px] rounded border-none cursor-pointer text-white"
                        style={{ background: "#D32F2F", fontFamily: "Poppins, sans-serif" }}>
                        Confirm
                      </button>
                      <button type="button" onClick={() => setDeleteConfirm(null)}
                        className="text-[10px] font-semibold px-[8px] py-[4px] rounded border-none cursor-pointer"
                        style={{ background: "#F5F5F5", color: "#888", fontFamily: "Poppins, sans-serif" }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setDeleteConfirm(lead.id)}
                      className="flex items-center justify-center w-[30px] h-[30px] rounded-lg border-none cursor-pointer transition-colors"
                      style={{ color: "#D32F2F", background: "rgba(211,47,47,0.06)" }}
                      title="Delete Lead">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Mobile extra info */}
                <div className="flex items-center gap-[8px] md:hidden col-span-full mt-[-4px] mb-[4px]">
                  <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Age: {lead.age}</span>
                  <span style={{ color: "#DDD" }}>|</span>
                  <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{lead.gender}</span>
                  <span style={{ color: "#DDD" }}>|</span>
                  <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{lead.marital_status}</span>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between px-[20px] py-[14px]" style={{ borderTop: "1px solid #F0F0F0" }}>
                <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                  Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, data.total)} of {data.total}
                </span>
                <div className="flex items-center gap-[6px]">
                  <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                    className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border-none cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
                    style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                    <ChevronLeft size={15} />
                  </button>
                  {Array.from({ length: Math.min(data.totalPages, 7) }, (_, i) => {
                    let p: number;
                    if (data.totalPages <= 7) p = i + 1;
                    else if (page <= 4) p = i + 1;
                    else if (page >= data.totalPages - 3) p = data.totalPages - 6 + i;
                    else p = page - 3 + i;
                    return (
                      <button key={p} type="button" onClick={() => setPage(p)}
                        className="flex items-center justify-center min-w-[34px] h-[34px] rounded-lg border-none cursor-pointer text-[12px] font-semibold transition-colors"
                        style={{
                          color: p === page ? "#FFFFFF" : "#35319B",
                          background: p === page ? "#35319B" : "rgba(53,49,155,0.06)",
                          fontFamily: "Poppins, sans-serif",
                        }}>
                        {p}
                      </button>
                    );
                  })}
                  <button type="button" onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages}
                    className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border-none cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
                    style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedLead && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-[16px]" style={{ background: "rgba(15,13,45,0.65)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedLead(null); }}>
          <div className="w-full max-w-[520px] rounded-[16px] overflow-hidden" style={{ background: "#FFF", fontFamily: "Poppins, sans-serif", maxHeight: "92vh", overflowY: "auto" }}>
            <div style={{ height: "4px", background: "linear-gradient(90deg, #35319B, #F59A00)" }} />
            <div className="p-[22px] md:p-[26px]">
              {/* Header with avatar */}
              <div className="flex items-center justify-between mb-[16px]">
                <div className="flex items-center gap-[12px] min-w-0">
                  <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0"
                    style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}>
                    {(selectedLead.fname?.[0] ?? "?").toUpperCase()}{(selectedLead.lname?.[0] ?? "").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="m-0 text-[17px] font-bold leading-[1.2] truncate" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                      {selectedLead.fname} {selectedLead.lname}
                    </h3>
                    <p className="m-0 text-[12px]" style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}>
                      {selectedLead.age} · {selectedLead.gender} · {selectedLead.marital_status}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedLead(null)}
                  className="w-[30px] h-[30px] flex items-center justify-center rounded-lg border-none cursor-pointer bg-transparent hover:bg-gray-100 shrink-0"
                  style={{ color: "#888" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-[8px] mb-[18px]">
                <span className="inline-flex items-center gap-[4px] text-[11px] font-semibold px-[9px] py-[4px] rounded-full"
                  style={{ background: (STATUS_STYLES[selectedLead.status] || STATUS_STYLES.PENDING).bg, color: (STATUS_STYLES[selectedLead.status] || STATUS_STYLES.PENDING).color, fontFamily: "Poppins, sans-serif" }}>
                  {(STATUS_STYLES[selectedLead.status] || STATUS_STYLES.PENDING).icon}
                  {selectedLead.status.charAt(0) + selectedLead.status.slice(1).toLowerCase()}
                </span>
                {selectedLead.consulted_by && (
                  <span className="inline-flex items-center gap-[4px] text-[11px] font-semibold px-[9px] py-[4px] rounded-full" style={{ background: "rgba(46,125,50,0.08)", color: "#2E7D32", fontFamily: "Poppins, sans-serif" }}>
                    <UserRoundCheck size={12} /> Consulted
                  </span>
                )}
              </div>

              {/* Patient details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[16px] gap-y-[6px] mb-[18px]">
                <DetailRow label="Email" value={selectedLead.email} />
                <DetailRow label="Phone" value={selectedLead.phone} />
                <DetailRow label="Location" value={`${selectedLead.city}, ${selectedLead.state}, ${selectedLead.country}${selectedLead.pincode ? ` - ${selectedLead.pincode}` : ""}`} />
                <DetailRow label="Schedule" value={`${selectedLead.schedule_date} · ${selectedLead.schedule_time}`} />
                <DetailRow label="Submitted At" value={new Date(selectedLead.created_at).toLocaleString()} />
              </div>

              {/* Consultation info */}
              {selectedLead.consulted_by && (
                <div className="rounded-[12px] p-[14px] mb-[18px]" style={{ background: "rgba(46,125,50,0.05)", border: "1px solid rgba(46,125,50,0.18)" }}>
                  <p className="m-0 mb-[8px] text-[11px] font-semibold uppercase tracking-[0.06em] flex items-center gap-[6px]" style={{ color: "#2E7D32", fontFamily: "Poppins, sans-serif" }}>
                    <UserRoundCheck size={13} /> Consultation Info
                  </p>
                  <div className="flex flex-col gap-[6px]">
                    <DetailRow label="Consulted By" value={selectedLead.consulted_by} />
                    <DetailRow label="Consulted At" value={selectedLead.consulted_at ? new Date(selectedLead.consulted_at).toLocaleString() : "—"} />
                    <div>
                      <span className="text-[12px] font-semibold block mb-[4px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Consult Notes</span>
                      <p className="m-0 text-[13px] leading-[1.55]" style={{ color: "#333", fontFamily: "Poppins, sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {selectedLead.consult_notes || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Update Status */}
              <p className="m-0 text-[12px] font-semibold mb-[8px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Update Status</p>
              <div className="flex flex-wrap gap-[6px] mb-[18px]">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => updateStatus(selectedLead.id, s)}
                    className="text-[11px] font-semibold px-[10px] py-[5px] rounded-full border-none cursor-pointer transition-all"
                    style={{
                      background: selectedLead.status === s ? "rgba(53,49,155,0.12)" : "#F5F5F5",
                      color: selectedLead.status === s ? "#35319B" : "#888",
                      fontFamily: "Poppins, sans-serif",
                    }}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Actions */}
              {selectedLead.consulted_by && (
                <button type="button" onClick={() => setViewConsultLead(selectedLead)}
                  className="w-full flex items-center justify-center gap-[6px] py-[10px] rounded-xl border-none cursor-pointer text-[14px] font-semibold transition-colors mb-[8px]"
                  style={{ color: "#2E7D32", background: "rgba(46,125,50,0.08)", fontFamily: "Poppins, sans-serif" }}>
                  <Eye size={14} /> View Consultation Info
                </button>
              )}
              <button type="button" onClick={() => { setConsultingLead(selectedLead); }}
                className="w-full flex items-center justify-center gap-[6px] py-[10px] rounded-xl border-none cursor-pointer text-white text-[14px] font-semibold transition-colors mb-[8px]"
                style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}>
                <Stethoscope size={14} /> {selectedLead.consulted_by ? "Update Consultation" : "Consult This Patient"}
              </button>

              {/* Delete */}
              <button type="button" onClick={() => setDeleteConfirm(selectedLead.id)}
                className="w-full flex items-center justify-center gap-[6px] py-[10px] rounded-xl border-none cursor-pointer text-white text-[14px] font-semibold transition-colors"
                style={{ background: "#D32F2F", fontFamily: "Poppins, sans-serif" }}>
                <Trash2 size={14} /> Delete Lead
              </button>

              <button type="button" onClick={() => setSelectedLead(null)}
                className="w-full mt-[8px] py-[10px] rounded-xl border-none cursor-pointer text-[14px] font-semibold transition-colors"
                style={{ background: "#F5F5F5", color: "#555", fontFamily: "Poppins, sans-serif" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConsultPatientModal
        lead={consultingLead}
        consultedByDefault={user?.name ?? ""}
        onClose={() => setConsultingLead(null)}
        onSaved={handleConsultSaved}
      />

      {/* Consultation info modal */}
      <InfoModal
        open={!!viewConsultLead}
        title={viewConsultLead ? `${viewConsultLead.fname} ${viewConsultLead.lname}` : ""}
        subtitle={viewConsultLead?.email}
        onClose={() => setViewConsultLead(null)}
        avatar={viewConsultLead ? {
          initials: `${(viewConsultLead.fname?.[0] ?? "?").toUpperCase()}${(viewConsultLead.lname?.[0] ?? "").toUpperCase()}`,
          bg: "linear-gradient(135deg, #2E7D32, #43A047)",
        } : undefined}
        fields={[
          { label: "Consulted By", value: viewConsultLead?.consulted_by ?? "—" },
          { label: "Consulted At", value: viewConsultLead?.consulted_at ? new Date(viewConsultLead.consulted_at).toLocaleString() : "—" },
          { label: "Consult Notes", value: viewConsultLead?.consult_notes ?? "—" },
          { label: "Phone", value: viewConsultLead?.phone ?? "—" },
          { label: "Email", value: viewConsultLead?.email ?? "—" },
          { label: "Lead ID", value: viewConsultLead?.id ?? "" },
        ]}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete lead?"
        message="This will permanently delete this consultation lead. This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => { if (deleteConfirm) deleteLead(deleteConfirm); }}
      />
    </DashboardShell>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-[8px] py-[3px]">
      <span className="text-[12px] font-semibold shrink-0" style={{ color: "#888", fontFamily: "Poppins, sans-serif", minWidth: 92 }}>{label}</span>
      <span className="text-[13px] text-right min-w-0" style={{ color: "#333", fontFamily: "Poppins, sans-serif", wordBreak: "break-word" }}>{value || "—"}</span>
    </div>
  );
}