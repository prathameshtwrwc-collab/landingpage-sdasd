"use client";

import { useEffect, useState, useCallback } from "react";
import { cachedFetch } from "@/lib/client-cache";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Bell, Search, ChevronLeft, ChevronRight, Trash2, CheckCircle, Clock, ArrowRightLeft, Loader2, User, Eye, X } from "lucide-react";

const PAGE_SIZE = 10;

type Ticket = {
  id: string;
  issue_type: string;
  description: string;
  request_callback: boolean;
  status: string;
  raised_by: string;
  raised_by_role: "member" | "admin" | "superadmin";
  assigned_to: string | null;
  organization_id: string | null;
  member_id: string | null;
  forwarded_by: string | null;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  sender_email?: string;
  sender_phone?: string;
  sender_org?: string;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [senderTicket, setSenderTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("chronotype_org_id") : null;
    if (stored) setOrgId(stored);
  }, []);

  const fetchTickets = useCallback((p: number, query = search) => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String((p - 1) * PAGE_SIZE), role: "member" });
    if (orgId) params.set("organization_id", orgId);
    if (query) params.set("search", query);
    cachedFetch(`/api/support-tickets?${params.toString()}`).then((d: any) => {
      setTickets(Array.isArray(d?.data) ? d.data : []);
      setTotal(d?.total ?? 0);
      setTotalPages(Math.max(1, Math.ceil((d?.total ?? 0) / PAGE_SIZE)));
      setPage(d?.offset ? Math.floor(d.offset / PAGE_SIZE) + 1 : p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, orgId]);

  useEffect(() => { fetchTickets(search ? 1 : page); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const goPage = (p: number) => {
    if (p >= 1 && p <= totalPages) { setPage(p); fetchTickets(p); }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/support-tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    fetchTickets(page);
  };

  const forwardToSuperadmin = async (id: string) => {
    await fetch(`/api/support-tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "forwarded" }),
    });
    fetchTickets(page);
  };

  const deleteTicket = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/support-tickets/${id}`, { method: "DELETE", credentials: "include" });
    setDeletingId(null);
    fetchTickets(page);
  };

  const getStatusColor = (status: string) => {
    if (status === "resolved") return { bg: "rgba(34,197,94,0.08)", color: "#16a34a" };
    if (status === "forwarded") return { bg: "rgba(245,154,0,0.08)", color: "#d97706" };
    return { bg: "rgba(239,68,68,0.08)", color: "#dc2626" };
  };

  return (
    <DashboardShell title="Notifications">
      <div className="rounded-[16px] p-[20px] md:p-[24px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-[16px] flex-wrap gap-[12px]">
          <h2 className="text-[18px] md:text-[20px] font-bold flex items-center gap-[8px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#171717" }}>
            <Bell size={22} style={{ color: "#35319B" }} />
            Member Callback Requests
          </h2>
          <div className="relative">
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="pl-[32px] pr-[12px] py-[8px] rounded-[8px] border-none text-[13px]"
              style={{ fontFamily: "Poppins, sans-serif", background: "#F7F7FA", border: "1px solid #E5E7EB", color: "#171717", outline: "none", width: "240px" }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-[40px]">
            <Loader2 size={24} className="animate-spin" style={{ color: "#35319B" }} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[40px]">
            <Bell size={40} stroke="#CCC" strokeWidth={1.5} />
            <p className="m-0 mt-[12px] text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>No callback requests yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8F9FF" }}>
                  <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase text-left" style={{ color: "#888" }}>Member</th>
                  <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase text-left" style={{ color: "#888" }}>Issue Type</th>
                  <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase text-left" style={{ color: "#888" }}>Description</th>
                  <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase text-left" style={{ color: "#888" }}>Status</th>
                  <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase text-left" style={{ color: "#888" }}>Date</th>
                  <th className="px-[14px] py-[10px] text-[10px] font-semibold uppercase text-right" style={{ color: "#888" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => {
                  const statusColor = getStatusColor(ticket.status);
                  return (
                    <tr key={ticket.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                      <td className="px-[14px] py-[10px]">
                        <button
                          type="button"
                          onClick={() => setSenderTicket(ticket)}
                          className="flex items-center gap-[6px] bg-transparent border-none cursor-pointer text-left"
                          style={{ padding: 0 }}
                        >
                          <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(53,49,155,0.08)" }}>
                            <User size={12} style={{ color: "#35319B" }} />
                          </div>
                          <span className="text-[11px] underline underline-offset-2" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                            {ticket.sender_name || "Member"}
                          </span>
                          <Eye size={12} style={{ color: "#35319B" }} />
                        </button>
                      </td>
                      <td className="px-[14px] py-[10px] text-[12px] font-medium" style={{ color: "#171717" }}>{ticket.issue_type}</td>
                      <td className="px-[14px] py-[10px] text-[11px] max-w-[250px] truncate" style={{ color: "#555" }}>{ticket.description}</td>
                      <td className="px-[14px] py-[10px]">
                        <select
                          value={ticket.status}
                          onChange={(e) => updateStatus(ticket.id, e.target.value)}
                          className="rounded-[6px] border-none px-[8px] py-[4px] text-[11px] font-semibold cursor-pointer"
                          style={{ fontFamily: "Poppins, sans-serif", background: statusColor.bg, color: statusColor.color, outline: "none" }}
                        >
                          <option value="open">Not Resolved</option>
                          <option value="resolved">Resolved</option>
                          <option value="forwarded">Forwarded to Superadmin</option>
                        </select>
                      </td>
                      <td className="px-[14px] py-[10px] text-[11px]" style={{ color: "#888" }}>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-[14px] py-[10px] text-right">
                        <div className="flex items-center justify-end gap-[6px]">
                          <button
                            type="button"
                            onClick={() => forwardToSuperadmin(ticket.id)}
                            disabled={ticket.status === "forwarded"}
                            className="p-[6px] rounded-[6px] border-none cursor-pointer transition-colors disabled:opacity-40"
                            style={{ background: "rgba(245,154,0,0.08)", color: "#d97706" }}
                            title="Forward to Superadmin"
                          >
                            <ArrowRightLeft size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(ticket.id, ticket.status === "resolved" ? "open" : "resolved")}
                            className="p-[6px] rounded-[6px] border-none cursor-pointer transition-colors"
                            style={{ background: ticket.status === "resolved" ? "rgba(34,197,94,0.08)" : "rgba(245,154,0,0.08)", color: ticket.status === "resolved" ? "#16a34a" : "#d97706" }}
                            title={ticket.status === "resolved" ? "Mark as Open" : "Mark as Resolved"}
                          >
                            {ticket.status === "resolved" ? <CheckCircle size={14} /> : <Clock size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTicket(ticket.id)}
                            disabled={deletingId === ticket.id}
                            className="p-[6px] rounded-[6px] border-none cursor-pointer transition-colors disabled:opacity-50"
                            style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}
                            title="Delete"
                          >
                            {deletingId === ticket.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-[16px]">
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
       )}
      </div>

      {senderTicket && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center p-[16px]"
          style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)" }}
          onClick={() => setSenderTicket(null)}
        >
          <div
            className="w-full max-w-[420px] rounded-[16px] overflow-hidden"
            style={{ background: "#FFFFFF", boxShadow: "0 16px 40px rgba(0,0,0,0.18)", fontFamily: "Poppins, sans-serif" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-[20px] py-[16px]" style={{ borderBottom: "1px solid #F1F4FA", background: "#F8F9FF" }}>
              <h3 className="m-0 text-[15px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Sender Details</h3>
              <button onClick={() => setSenderTicket(null)} className="bg-transparent border-none cursor-pointer p-[4px]" style={{ color: "#98A2B3" }} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="px-[20px] py-[16px]">
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center justify-between py-[8px]" style={{ borderBottom: "1px solid #F5F5F5" }}>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.03em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Name</span>
                  <span className="text-[13px] text-right" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{senderTicket.sender_name || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-[8px]" style={{ borderBottom: "1px solid #F5F5F5" }}>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.03em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Role</span>
                  <span className="text-[13px] text-right capitalize" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{senderTicket.raised_by_role}</span>
                </div>
                <div className="flex items-center justify-between py-[8px]" style={{ borderBottom: "1px solid #F5F5F5" }}>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.03em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Email</span>
                  <span className="text-[13px] text-right" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{senderTicket.sender_email || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-[8px]" style={{ borderBottom: "1px solid #F5F5F5" }}>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.03em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Phone</span>
                  <span className="text-[13px] text-right" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{senderTicket.sender_phone || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-[8px]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.03em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Organization</span>
                  <span className="text-[13px] text-right" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{senderTicket.sender_org || "—"}</span>
                </div>
              </div>
            </div>
            <div className="px-[20px] py-[14px]" style={{ borderTop: "1px solid #F1F4FA" }}>
              <button
                onClick={() => setSenderTicket(null)}
                className="w-full px-[14px] py-[10px] rounded-xl border-none cursor-pointer text-[13px] font-semibold text-white transition-colors"
                style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
