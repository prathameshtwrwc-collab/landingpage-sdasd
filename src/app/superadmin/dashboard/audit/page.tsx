"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { FileText, Search, Filter, ChevronLeft, ChevronRight, CheckCircle, XCircle, UserPlus, ClipboardCheck, LogIn, AlertTriangle, Clock, ArrowUpDown } from "lucide-react";

interface AuditEntry {
  id: string;
  activity_type: string;
  description: string;
  member_id: string | null;
  email?: string;
  ip_address?: string;
  success?: boolean;
  created_at: string;
  _source: string;
}

interface AuditResponse {
  data: AuditEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  activityTypes: string[];
}

const ACTIVITY_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  LOGIN_SUCCESS: { icon: <LogIn size={14} />, color: "#2E7D32" },
  LOGIN_FAILED: { icon: <XCircle size={14} />, color: "#D32F2F" },
  ASSESSMENT_COMPLETED: { icon: <ClipboardCheck size={14} />, color: "#35319B" },
  ASSESSMENT_STARTED: { icon: <Clock size={14} />, color: "#F59A00" },
  MEMBER_REGISTERED: { icon: <UserPlus size={14} />, color: "#2E7D32" },
};

function getActivityIcon(type: string) {
  return ACTIVITY_ICONS[type] ?? { icon: <FileText size={14} />, color: "#888" };
}

export default function AuditPage() {
  const [data, setData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;

  const fetchAudit = (p: number, s: string, t: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(limit) });
    if (s) params.set("search", s);
    if (t) params.set("type", t);
    fetch(`/api/admin-audit?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAudit(1, "", ""); }, []);

  const doSearch = () => { setPage(1); fetchAudit(1, search, typeFilter); };

  const goPage = (p: number) => { if (p >= 1 && p <= (data?.totalPages ?? 1)) { setPage(p); fetchAudit(p, search, typeFilter); } };

  return (
    <DashboardShell title="Audit Log">
      <div className="mb-[20px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Audit</span>
        <h1 className="m-0 text-[18px] font-bold mt-[2px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
          Platform Activity Log
        </h1>
        <p className="m-0 text-[12px] mt-[2px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
          {data ? `${data.total.toLocaleString()} total events` : "Tracking all platform activity"}
        </p>
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-wrap items-center gap-[12px] mb-[20px]">
        <div className="flex-1 min-w-[200px] flex items-center px-[14px] py-[9px] rounded-xl" style={{ border: "1.5px solid #E0E0E0", background: "#FFFFFF" }}>
          <Search size={15} stroke="#AAA" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSearch()} placeholder="Search activity..."
            className="flex-1 bg-transparent border-none ml-[8px] text-[13px] outline-none" style={{ fontFamily: "Poppins, sans-serif" }} />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); fetchAudit(1, search, e.target.value); }}
          className="px-[12px] py-[9px] rounded-xl border text-[12px] cursor-pointer" style={{ borderColor: "#E0E0E0", color: "#333", background: "#FFFFFF", fontFamily: "Poppins, sans-serif", outline: "none" }}>
          <option value="">All Types</option>
          <option value="LOGIN">Logins</option>
          <option value="login_audit">Login Audit</option>
          {data?.activityTypes?.filter((t) => t).map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
          ))}
        </select>
        <button type="button" onClick={doSearch}
          className="px-[16px] py-[9px] rounded-xl border-none cursor-pointer text-[12px] font-semibold text-white transition-colors"
          style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}>
          <Filter size={14} className="inline mr-[4px]" /> Filter
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-[60px]">
          <div className="w-[24px] h-[24px] rounded-full border-2 border-[#35319B] border-t-transparent animate-spin" />
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && data && data.data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-[60px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <FileText size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>No activity logs found</p>
          <p className="m-0 mt-[4px] text-[12px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Try changing filters or wait for platform activity.</p>
        </div>
      )}

      {/* ── Activity Feed ── */}
      {data && data.data.length > 0 && (
        <>
          <div className="flex flex-col gap-[4px] rounded-[16px] overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            {/* Header */}
            <div className="grid grid-cols-[50px_1fr_180px_120px_100px] gap-[8px] px-[20px] py-[10px] text-[11px] font-semibold uppercase" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif", borderBottom: "1px solid #F0F0F0", background: "#FAFBFF" }}>
              <span></span>
              <span>Event</span>
              <span>Type</span>
              <span>User</span>
              <span className="text-right">Timestamp</span>
            </div>

            {/* Rows */}
            {data.data.map((entry, i) => {
              const actIcon = getActivityIcon(entry.activity_type);
              const date = new Date(entry.created_at);
              const timeStr = date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
              const showBorder = i < data.data.length - 1;
              return (
                <div key={`${entry._source}-${entry.id}-${i}`}
                  className="grid grid-cols-[50px_1fr_180px_120px_100px] gap-[8px] px-[20px] py-[11px] items-center transition-colors hover:bg-[#F8F9FF]"
                  style={{ borderBottom: showBorder ? "1px solid #F5F5F5" : "none" }}>
                  {/* Icon */}
                  <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: `${actIcon.color}12`, color: actIcon.color }}>
                    {actIcon.icon}
                  </div>
                  {/* Description */}
                  <div>
                    <p className="m-0 text-[13px] font-medium truncate" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>
                      {entry.description || "—"}
                    </p>
                    {entry.ip_address && (
                      <p className="m-0 text-[10px] mt-[2px]" style={{ color: "#BBB", fontFamily: "Poppins, sans-serif" }}>
                        IP: {entry.ip_address}
                      </p>
                    )}
                  </div>
                  {/* Type */}
                  <div>
                    <span className="inline-block text-[10px] font-semibold uppercase px-[8px] py-[3px] rounded-full" style={{
                      color: actIcon.color,
                      background: `${actIcon.color}10`,
                      fontFamily: "Poppins, sans-serif",
                    }}>
                      {entry.activity_type?.replace(/_/g, " ") || "—"}
                    </span>
                  </div>
                  {/* User */}
                  <div>
                    <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                      {entry.email ? entry.email.split("@")[0] : entry.member_id?.slice(0, 8) ?? "—"}
                    </span>
                  </div>
                  {/* Timestamp */}
                  <div className="text-right">
                    <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                      {timeStr}
                    </span>
                    <p className="m-0 text-[10px]" style={{ color: "#CCC", fontFamily: "Poppins, sans-serif" }}>
                      {date.toLocaleDateString("en-US", { year: "numeric" }) === new Date().toLocaleDateString("en-US", { year: "numeric" }) ? "" : date.getFullYear()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination ── */}
          <div className="flex items-center justify-between mt-[16px] px-[4px]">
            <p className="m-0 text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, data.total)} of {data.total}
            </p>
            <div className="flex items-center gap-[6px]">
              <button type="button" onClick={() => goPage(page - 1)} disabled={page <= 1}
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
                  <button key={p} type="button" onClick={() => goPage(p)}
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
              <button type="button" onClick={() => goPage(page + 1)} disabled={page >= data.totalPages}
                className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border-none cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
                style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
