"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Phone, Mail, Calendar, Clock, MapPin, Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock as ClockIcon, Eye, Trash2, ArrowUpDown } from "lucide-react";

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

function StatusBadge({ status, onClick }: { status: string; onClick?: () => void }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return (
    <span onClick={onClick}
      className={`inline-flex items-center gap-[4px] text-[11px] font-semibold px-[8px] py-[3px] rounded-full ${onClick ? "cursor-pointer hover:opacity-80" : ""}`}
      style={{ background: s.bg, color: s.color, fontFamily: "Poppins, sans-serif", transition: "opacity 0.15s" }}>
      {s.icon} {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default function ConsultationLeadsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState<ConsultationLead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (statusFilter) params.set("status", statusFilter);
    if (searchQuery) params.set("search", searchQuery);

    fetch(`/api/consultation-leads?${params}`)
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [page, statusFilter, searchQuery]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

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

  const cycleStatus = (current: string) => {
    const idx = STATUS_OPTIONS.indexOf(current as typeof STATUS_OPTIONS[number]);
    return STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
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
              <span>Location</span>
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
                    <StatusBadge status={lead.status} />
                  </div>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[12px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif", wordBreak: "break-all" }}>{lead.email}</span>
                  <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{lead.phone}</span>
                </div>
                <span className="text-[12px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                  {lead.city}, {lead.state}
                </span>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[12px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{lead.schedule_date}</span>
                  <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{lead.schedule_time}</span>
                </div>
                {/* Status - click to cycle */}
                <div title="Click to cycle status">
                  <StatusBadge status={lead.status} onClick={() => updateStatus(lead.id, cycleStatus(lead.status))} />
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
                  Page {data.page} of {data.totalPages} ({data.total} total)
                </span>
                <div className="flex items-center gap-[6px]">
                  <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                    className="flex items-center gap-[4px] text-[12px] font-medium px-[10px] py-[6px] rounded-lg border-none cursor-pointer disabled:opacity-40 disabled:cursor-default transition-colors"
                    style={{ color: "#555", background: "#F5F5F5", fontFamily: "Poppins, sans-serif" }}>
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button type="button" onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages}
                    className="flex items-center gap-[4px] text-[12px] font-medium px-[10px] py-[6px] rounded-lg border-none cursor-pointer disabled:opacity-40 disabled:cursor-default transition-colors"
                    style={{ color: "#555", background: "#F5F5F5", fontFamily: "Poppins, sans-serif" }}>
                    Next <ChevronRight size={14} />
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
          <div className="w-full max-w-[480px] rounded-[16px] overflow-hidden" style={{ background: "#FFF", fontFamily: "Poppins, sans-serif", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ height: "4px", background: "linear-gradient(90deg, #35319B, #F59A00)" }} />
            <div className="p-[24px]">
              <div className="flex items-center justify-between mb-[20px]">
                <h3 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                  Lead Details
                </h3>
                <button type="button" onClick={() => setSelectedLead(null)}
                  className="w-[30px] h-[30px] flex items-center justify-center rounded-lg border-none cursor-pointer bg-transparent hover:bg-gray-100"
                  style={{ color: "#888" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              <div className="flex flex-col gap-[10px] mb-[20px]">
                <DetailRow label="Name" value={`${selectedLead.fname} ${selectedLead.lname}`} />
                <DetailRow label="Age" value={selectedLead.age} />
                <DetailRow label="Gender" value={selectedLead.gender} />
                <DetailRow label="Marital Status" value={selectedLead.marital_status} />
                <DetailRow label="Email" value={selectedLead.email} />
                <DetailRow label="Phone" value={selectedLead.phone} />
                <DetailRow label="Location" value={`${selectedLead.city}, ${selectedLead.state}, ${selectedLead.country} - ${selectedLead.pincode}`} />
                <DetailRow label="Schedule Date" value={selectedLead.schedule_date} />
                <DetailRow label="Schedule Time" value={selectedLead.schedule_time} />
                <DetailRow label="Submitted At" value={new Date(selectedLead.created_at).toLocaleString()} />
                <div className="flex items-center gap-[8px] py-[2px]">
                  <span className="text-[12px] font-semibold w-[120px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Status</span>
                  <StatusBadge status={selectedLead.status} />
                </div>
              </div>

              {/* Status Actions */}
              <p className="m-0 text-[12px] font-semibold mb-[8px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Update Status</p>
              <div className="flex flex-wrap gap-[6px] mb-[12px]">
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

              {/* Delete */}
              <button type="button" onClick={() => { if (confirm("Delete this lead permanently?")) { deleteLead(selectedLead.id); } }}
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
    </DashboardShell>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-[8px] py-[2px]">
      <span className="text-[12px] font-semibold w-[120px] shrink-0" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{label}</span>
      <span className="text-[13px]" style={{ color: "#333", fontFamily: "Poppins, sans-serif", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}