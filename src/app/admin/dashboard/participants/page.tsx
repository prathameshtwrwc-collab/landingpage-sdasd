"use client";

import { useEffect, useState } from "react"
import { cachedFetch } from "@/lib/client-cache";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Users, Mail, Calendar, Search, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { SkeletonStatCard, SkeletonTable, SkeletonChart, SkeletonHero } from "@/components/skeleton/SkeletonCard";

const PAGE_SIZE = 10;

export default function ParticipantsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [members, setMembers] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMembers = (p: number, query = search) => {
    setLoading(true);
    const params = new URLSearchParams({ member_page: String(p), member_limit: String(PAGE_SIZE) });
    if (query) params.set("member_search", query);
    cachedFetch(`/api/admin-portal?${params.toString()}`).then((d: any) => {
      const m = d.members as Record<string, unknown>;
      setMembers(Array.isArray(m?.data) ? m.data as Array<Record<string, unknown>> : Array.isArray(m) ? m as Array<Record<string, unknown>> : []);
      setTotal((m?.total as number) ?? (Array.isArray(m) ? (m as Array<Record<string, unknown>>).length : 0));
      setTotalPages((m?.totalPages as number) ?? 1);
      setPage((m?.page as number) ?? p);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchMembers(search ? 1 : page); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const goPage = (p: number) => {
    if (p >= 1 && p <= totalPages) { setPage(p); fetchMembers(p); }
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
    fetchMembers(1, v);
  };

  const sourceLabel = (src: string | undefined | null): string => {
    if (!src || src === "DIRECT") return "Direct";
    if (src === "ORGANIZATION") return "Organization";
    if (src === "REFERRAL") return "Referral";
    return src;
  };

  return (
    <DashboardShell title="Participants"><>
      <button type="button" onClick={() => router.push("/admin/dashboard")}
        className="inline-flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer mb-[16px] transition-colors"
        style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#35319B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#98A2B3"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </button>{loading ? (
        <SkeletonTable rows={6} cols={4} />
      ) : (
        <>
          <div className="flex items-center gap-[12px] mb-[20px]">
            <div className="flex-1 flex items-center px-[14px] py-[10px] rounded-xl" style={{ border: "1.5px solid #E0E0E0", background: "#FFFFFF" }}>
              <Search size={16} stroke="#AAA" />
              <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search participants..."
                className="flex-1 bg-transparent border-none ml-[10px] text-[14px] outline-none" style={{ fontFamily: "Poppins, sans-serif" }} />
            </div>
            <span className="text-[13px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{total} members</span>
          </div>

          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
              <Users size={40} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{search ? "No matching participants" : "No members yet"}</p>
            </div>
          ) : (
            <div className="rounded-[16px] overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ fontFamily: "Poppins, sans-serif", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F8F9FF" }}>
                      <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Member</th>
                      <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Email</th>
                      <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Source</th>
                      <th className="px-[16px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888" }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                        <td className="px-[16px] py-[12px]">
                          <div className="flex items-center gap-[10px]">
                            <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-white text-[12px] font-bold" style={{ background: "linear-gradient(135deg, #35319B, #7B76D4)", fontFamily: "Poppins, sans-serif" }}>
                              {((m.first_name as string)?.[0] ?? "?")}{((m.last_name as string)?.[0] ?? "")}
                            </div>
                            <span className="text-[13px] font-medium" style={{ color: "#171717" }}>{m.first_name as string} {m.last_name as string}</span>
                          </div>
                        </td>
                        <td className="px-[16px] py-[12px] text-[13px]" style={{ color: "#555" }}>{m.email as string}</td>
                        <td className="px-[16px] py-[12px]">
                          <span className="inline-flex items-center gap-[5px] text-[11px] font-semibold px-[8px] py-[3px] rounded-full" style={{
                            background: (m.source_type as string) === "ORGANIZATION" ? "rgba(53,49,155,0.08)" : "rgba(245,154,0,0.08)",
                            color: (m.source_type as string) === "ORGANIZATION" ? "#35319B" : "#F59A00",
                            fontFamily: "Poppins, sans-serif",
                          }}>
                            <Globe size={11} />
                            {sourceLabel(m.source_type as string | undefined | null)}
                          </span>
                        </td>
                        <td className="px-[16px] py-[12px] text-[13px]" style={{ color: "#888" }}>{m.created_at ? new Date(m.created_at as string).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-[20px] py-[14px]" style={{ borderTop: "1px solid #F0F0F0" }}>
                  <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                    Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                  </span>
                  <div className="flex items-center gap-[6px]">
                    <button type="button" onClick={() => goPage(page - 1)} disabled={page <= 1}
                      className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border-none cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
                      style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let p: number;
                      if (totalPages <= 7) p = i + 1;
                      else if (page <= 4) p = i + 1;
                      else if (page >= totalPages - 3) p = totalPages - 6 + i;
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
                    <button type="button" onClick={() => goPage(page + 1)} disabled={page >= totalPages}
                      className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border-none cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
                      style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      </></DashboardShell>
  );
}
