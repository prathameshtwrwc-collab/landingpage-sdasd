"use client";

import { useEffect, useState } from "react";
import { cachedFetch } from "@/lib/client-cache";
import { useAuth } from "@/components/auth/AuthProvider";
import { useConsult } from "@/components/consult/ConsultContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import { useRouter } from "next/navigation";
import { Moon, Sparkles, Activity, TrendingUp, Calendar, Star, FileText, Download, Printer, Share2, ClipboardCopy, ExternalLink, ArrowRight, Stethoscope, Eye } from "lucide-react";
import { downloadPdf, openPdfForPrint, shareReport } from "@/lib/client-pdf";

interface DashboardData {
  member: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  recommendations: Record<string, unknown>[];
  assessments: Record<string, unknown>[];
  reports: Array<{
    id: string;
    result_id: string | null;
    generated_at: string;
    chronotype: string | null;
    totalScore: number | null;
    larkScore: number | null;
    eagleScore: number | null;
    owlScore: number | null;
  }>;
}

export default function MemberDashboardPage() {
  const { user, isLoading } = useAuth();
  const { open: openConsult } = useConsult();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [refCopied, setRefCopied] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      fetch(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            setFetchError(json.error);
            setData(null);
          } else {
            setData(json);
          }
          setDataLoading(false);
        })
        .catch((err) => { setFetchError(`Network error: ${err.message}`); setDataLoading(false); });
    } else if (!isLoading) {
      setDataLoading(false);
    }
  }, [user, isLoading]);

  if (isLoading || dataLoading) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
          <p className="text-[14px] text-[#888]">Loading...</p>
        </div>
      </DashboardShell>
    );
  }

  if (fetchError) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex flex-col items-center justify-center gap-[12px]" style={{ fontFamily: "Poppins, sans-serif" }}>
          <div className="p-[16px] rounded-xl max-w-[480px]" style={{ background: "rgba(211,47,47,0.06)" }}>
            <p className="m-0 text-[13px] leading-[1.5] text-center" style={{ color: "#D32F2F" }}>
              {fetchError}
            </p>
          </div>
          {fetchError.includes("relation") && (
            <div className="p-[16px] rounded-xl max-w-[480px] text-center" style={{ background: "rgba(53,49,155,0.04)" }}>
              <p className="m-0 text-[13px] font-semibold mb-[4px]" style={{ color: "#35319B" }}>Database setup required</p>
              <p className="m-0 text-[12px] leading-[1.5]" style={{ color: "#888" }}>
                Run the SQL schema files in this exact order in your Supabase SQL Editor:
              </p>
              <code className="block mt-[8px] text-[12px] font-mono" style={{ color: "#555", background: "rgba(0,0,0,0.03)", padding: "8px 12px", borderRadius: "8px" }}>
                1. supabase/schema.sql{'\n'}2. supabase/schema2.sql{'\n'}3. supabase/schema3.sql
              </code>
              <p className="m-0 mt-[8px] text-[12px]" style={{ color: "#888" }}>
                Then visit <a href="/api/health" style={{ color: "#35319B" }}>/api/health</a> to verify.
              </p>
            </div>
          )}
        </div>
      </DashboardShell>
    );
  }

  if (!user) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
          <p className="text-[14px] text-[#888]">Please log in to view your dashboard.</p>
        </div>
      </DashboardShell>
    );
  }

  const result = data?.result as Record<string, unknown> | undefined;
  const chronotype = (result?.chronotype as string) ?? "—";
  const larkScore = (result?.lark_score as number) ?? 0;
  const eagleScore = (result?.eagle_score as number) ?? 0;
  const owlScore = (result?.owl_score as number) ?? 0;
  const totalScore = (result?.total_score as number) ?? 0;
  const confidenceScore = (result?.confidence_score as number) ?? 0;

  const chronotypeLabels: Record<string, string> = {
    LARK: "Lark", EAGLE: "Eagle", OWL: "Owl",
  };

  return (
    <DashboardShell>
      <div
        className="relative overflow-hidden rounded-[20px] p-[24px] md:p-[32px] mb-[24px] md:mb-[28px]"
        style={{
          background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 40%, #FEF2F2 100%)",
        }}
      >
        <div className="absolute top-[-40px] right-[-20px] opacity-[0.06]">
          <Moon size={200} stroke="#35319B" strokeWidth={1} />
        </div>
        <div className="absolute bottom-[-30px] left-[-30px] opacity-[0.04]">
          <Sparkles size={160} stroke="#35319B" strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <p className="m-0 text-[13px] font-medium mb-[4px]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
            Welcome back, {user.name}
          </p>
          <h2 className="m-0 text-[24px] md:text-[28px] font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: "#19164F", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            {result ? `Your Chronotype: ${chronotypeLabels[chronotype] ?? chronotype}` : "Ready to understand your sleep?"}
          </h2>
          <p className="m-0 mt-[4px] text-[14px] leading-[1.5]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
            {result
              ? `You scored Lark: ${larkScore} | Eagle: ${eagleScore} | Owl: ${owlScore} | Confidence: ${confidenceScore}%`
              : "Complete your assessment to unlock personalized insights, recommendations, and your unique sleep chronotype."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[20px] mb-[24px] md:mb-[28px]">
        <StatCard
          label="Sleep Score"
          value={totalScore > 0 ? String(totalScore) : "—"}
          icon={<Activity size={20} />}
          trend={result ? `${confidenceScore}% confidence` : undefined}
          trendUp
        />
        <StatCard
          label="Chronotype"
          value={chronotypeLabels[chronotype] ?? "—"}
          icon={<Moon size={20} />}
        />
        <StatCard
          label="Assessments"
          value={String(data?.assessments?.length ?? 0)}
          icon={<TrendingUp size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] md:gap-[20px]">
        <div
          className="lg:col-span-2 rounded-[16px] p-[22px] md:p-[28px]"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div
              className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
              style={{ background: "rgba(53,49,155,0.06)" }}
            >
              <Calendar size={18} stroke="#35319B" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Recent Activity
            </h3>
          </div>
          {data?.assessments && data.assessments.length > 0 ? (
            <div className="flex flex-col gap-[10px]">
              {(data.assessments as Array<Record<string, unknown>>).slice(0, 5).map((a, i) => {
                const isCompleted = a.status === "COMPLETED";
                const linkHref = isCompleted ? "/r/" + a.id : "/dashboard";
                return (
                  <a
                    key={i}
                    href={linkHref}
                    target={isCompleted ? "_blank" : undefined}
                    rel={isCompleted ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between py-[8px] px-[12px] rounded-lg no-underline transition-all hover:translate-x-[2px]"
                    style={{ background: "#F8F9FF", cursor: "pointer" }}
                  >
                    <span className="text-[13px] font-medium" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                      Assessment #{String(i + 1)}
                    </span>
                    <span className="flex items-center gap-[5px] text-[12px] font-medium" style={{ fontFamily: "Poppins, sans-serif", color: isCompleted ? "#2E7D32" : "#F59A00" }}>
                      {String(a.status ?? "—")}
                      {isCompleted && <Eye size={13} />}
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-[20px]"
              style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}
            >
              <Sparkles size={32} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[10px] text-[13px] leading-[1.5] text-[#AAA] text-center max-w-[280px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                Complete your sleep assessment to see personalized insights and recommendations here.
              </p>
            </div>
          )}
        </div>

        {/* ─── Consult Card ─── */}
        <button
          type="button"
          onClick={openConsult}
          className="w-full text-left border-none cursor-pointer rounded-[16px] p-[22px] md:p-[28px] transition-all hover:translate-y-[-2px]"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <div className="flex items-center gap-[10px] mb-[12px]">
            <div
              className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
              style={{ background: "rgba(53,49,155,0.08)" }}
            >
              <Stethoscope size={18} stroke="#35319B" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Consult a Sleep Specialist
            </h3>
          </div>
          <p className="m-0 text-[13px] leading-[1.5] mb-[12px]" style={{ color: "#666", fontFamily: "Poppins, sans-serif" }}>
            Get personalized guidance from a qualified sleep professional. Discuss your chronotype results and create a tailored plan.
          </p>
          <span
            className="inline-flex items-center gap-[6px] text-[12px] font-semibold px-[14px] py-[7px] rounded-lg transition-colors"
            style={{ color: "#fff", background: "linear-gradient(135deg, #35319B, #5A55C0)" }}
          >
            Book a Consultation <ArrowRight size={14} />
          </span>
        </button>

        {/* ─── My Reports Card ─── */}
        {data?.reports && data.reports.length > 0 && (
          <button
            type="button"
            onClick={() => router.push("/dashboard/progress")}
            className="w-full text-left border-none cursor-pointer rounded-[16px] p-[22px] md:p-[28px] transition-all hover:translate-y-[-2px]"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <div className="flex items-center gap-[10px] mb-[12px]">
              <div
                className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
                style={{ background: "rgba(53,49,155,0.06)" }}
              >
                <FileText size={18} stroke="#35319B" />
              </div>
              <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                My Reports
              </h3>
            </div>
            <p className="m-0 text-[13px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
              {data.reports.length} report{data.reports.length > 1 ? "s" : ""} available
            </p>
            <span
              className="inline-flex items-center gap-[6px] text-[12px] font-semibold mt-[12px] px-[14px] py-[7px] rounded-lg transition-colors"
              style={{ color: "#35319B", background: "rgba(53,49,155,0.06)" }}
            >
              View All <ArrowRight size={14} />
            </span>
          </button>
        )}

        {/* ─── My Referral Link ─── */}
        <div
          className="rounded-[16px] p-[22px] md:p-[28px]"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-[10px] mb-[12px]">
            <div
              className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
              style={{ background: "rgba(245,154,0,0.08)" }}
            >
              <Share2 size={18} stroke="#F59A00" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              My Referral Link
            </h3>
          </div>
          <p className="m-0 text-[12px] leading-[1.4] mb-[10px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
            Share your link and help someone discover their chronotype.
          </p>
          {data?.member?.referral_code ? (
            <div>
              <code
                className="block w-full px-[12px] py-[9px] text-[13px] font-mono font-semibold rounded-lg truncate mb-[8px]"
                style={{ background: "#F5F5F5", color: "#35319B" }}
              >
                {typeof window !== "undefined" ? window.location.origin + "/?ref=" + (data.member?.referral_code as string) : data.member?.referral_code as string}
              </code>
              <div className="flex gap-[8px]">
                <button
                  type="button"
                  onClick={() => {
                    const code = data.member?.referral_code as string;
                    const url = (typeof window !== "undefined" ? window.location.origin + "/?ref=" : "") + code;
                    navigator.clipboard.writeText(url);
                    setRefCopied(true);
                    setTimeout(() => setRefCopied(false), 2000);
                  }}
                  className="flex items-center gap-[6px] text-[12px] font-semibold px-[14px] py-[7px] rounded-lg border-none cursor-pointer transition-colors"
                  style={{ color: "#35319B", background: refCopied ? "rgba(46,125,50,0.1)" : "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}
                >
                  <ClipboardCopy size={14} /> {refCopied ? "Copied!" : "Copy Link"}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const code = data?.member?.referral_code as string;
                    const url = (typeof window !== "undefined" ? window.location.origin + "/?ref=" : "") + code;
                    if (typeof navigator !== "undefined" && navigator.share) {
                      try { await navigator.share({ title: "Discover Your Chronotype", url }); return; } catch {}
                    }
                    await navigator.clipboard.writeText(url);
                    setRefCopied(true);
                    setTimeout(() => setRefCopied(false), 2000);
                  }}
                  className="flex items-center gap-[6px] text-[12px] font-semibold px-[14px] py-[7px] rounded-lg border-none cursor-pointer transition-colors"
                  style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}
                >
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>
          ) : (
            <p className="m-0 text-[12px] italic" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Complete an assessment to get your referral link.</p>
          )}
        </div>
      </div>

      {/* ── Reports Section ── */}
      {data?.reports && data.reports.length > 0 && (
        <div className="mt-[24px] md:mt-[28px]">
          <div
            className="rounded-[16px] p-[22px] md:p-[28px]"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div
                className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
                style={{ background: "rgba(53,49,155,0.06)" }}
              >
                <FileText size={18} stroke="#35319B" />
              </div>
              <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                Past Reports
              </h3>
            </div>
            <div className="flex flex-col gap-[10px]">
              {data.reports.map((r, i) => (
                <div
                  key={r.id || i}
                  className="flex items-center justify-between py-[10px] px-[14px] rounded-lg"
                  style={{ background: "#F8F9FF" }}
                >
                  <div className="flex items-center gap-[10px]">
                    <FileText size={16} stroke="#98A2B3" />
                    <div>
                      <p className="m-0 text-[13px] font-medium text-[#555]" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Chronotype Report{r.chronotype ? ` - ${r.chronotype}` : ""}
                      </p>
                      <p className="m-0 text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                        {r.generated_at ? new Date(r.generated_at).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <button
                      type="button"
                      onClick={() => downloadPdf({
                        firstName: data.member?.first_name as string || "",
                        lastName: data.member?.last_name as string || "",
                        email: data.member?.email as string || "",
                        chronotype: r.chronotype || "EAGLE",
                        totalScore: r.totalScore || 0,
                        larkScore: r.larkScore || 0,
                        eagleScore: r.eagleScore || 0,
                        owlScore: r.owlScore || 0,
                      })}
                      className="flex items-center gap-[5px] text-[11px] font-medium no-underline px-[10px] py-[5px] rounded-lg border-none cursor-pointer transition-colors"
                      style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}
                      title="Download PDF"
                    >
                      <Download size={13} /> PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => openPdfForPrint({
                        firstName: data.member?.first_name as string || "",
                        lastName: data.member?.last_name as string || "",
                        email: data.member?.email as string || "",
                        chronotype: r.chronotype || "EAGLE",
                        totalScore: r.totalScore || 0,
                        larkScore: r.larkScore || 0,
                        eagleScore: r.eagleScore || 0,
                        owlScore: r.owlScore || 0,
                      })}
                      className="flex items-center gap-[5px] text-[11px] font-medium no-underline px-[10px] py-[5px] rounded-lg border-none cursor-pointer transition-colors"
                      style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}
                      title="Print"
                    >
                      <Printer size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => shareReport({
                        firstName: data.member?.first_name as string || "",
                        lastName: data.member?.last_name as string || "",
                        email: data.member?.email as string || "",
                        chronotype: r.chronotype || "EAGLE",
                        totalScore: r.totalScore || 0,
                        larkScore: r.larkScore || 0,
                        eagleScore: r.eagleScore || 0,
                        owlScore: r.owlScore || 0,
                      })}
                      className="flex items-center gap-[5px] text-[11px] font-medium no-underline px-[10px] py-[5px] rounded-lg border-none cursor-pointer transition-colors"
                      style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}
                      title="Share"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
