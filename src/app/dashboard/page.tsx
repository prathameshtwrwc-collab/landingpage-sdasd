"use client";

import { useEffect, useState } from "react";
import { cachedFetch } from "@/lib/client-cache";
import { useAuth } from "@/components/auth/AuthProvider";
import { useConsult } from "@/components/consult/ConsultContext";
import { useAssessment } from "@/components/assessment/AssessmentContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import { useRouter } from "next/navigation";
import { Moon, Sparkles, Activity, TrendingUp, Calendar, Star, FileText, Download, Printer, Share2, ClipboardCopy, ExternalLink, ArrowRight, Stethoscope, Eye, Phone, Heart, Check } from "lucide-react";
import DonateModal from "@/components/DonateModal";
import { chronotypeImageSrcs, chronotypeImageSrcsMobile } from "@/lib/chronotype-image";

interface DashboardData {
  member: Record<string, unknown> | null;
  orgCode: string;
  result: Record<string, unknown> | null;
  recommendations: Record<string, unknown>[];
  assessments: Record<string, unknown>[];
  schedule?: { wakeTime: string | null; bedtime: string | null; peakFocus: string | null } | null;
  reports: Array<{
    id: string;
    result_id: string | null;
    assessment_id: string | null;
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
  const { open: openConsult, openPrefilled } = useConsult();
  const { openForRetest } = useAssessment();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [refCopied, setRefCopied] = useState(false);
  const [refShareResult, setRefShareResult] = useState<"idle" | "shared" | "copied">("idle");
  const [resultShared, setResultShared] = useState(false);
  const [showAllReports, setShowAllReports] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
const [cardGradient] = useState(() => {
  const gradients = [
    "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 40%, #FEF2F2 100%)",
    "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 40%, #F0F0FF 100%)",
    "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 40%, #FFF0F0 100%)",
    "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 40%, #F0FDF4 100%)",
    "linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 40%, #FFF7ED 100%)",
    "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 40%, #EFF6FF 100%)",
    "linear-gradient(135deg, #F0FFF4 0%, #DCFCE7 40%, #FFF5F5 100%)",
    "linear-gradient(135deg, #FEF9C3 0%, #FEF08A 30%, #EFF6FF 100%)",
    "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 40%, #F5F3FF 100%)",
    "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 40%, #FFF7ED 100%)",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
  });

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    setMounted(true);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (user && user.email) {
      cachedFetch<Record<string, unknown>>(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((json) => {
          if (json.error) {
            setFetchError(json.error as string);
            setData(null);
          } else {
            setData(json as unknown as typeof data);
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

  const latestReport = data?.reports?.length ? data.reports[0] : null;
  const memberRecord = data?.member as Record<string, unknown> | undefined;

  const referralLink = memberRecord?.referral_code
    ? (typeof window !== "undefined" ? window.location.origin + "/?ref=" : "") + memberRecord.referral_code
    : "";

  const handleShareReferral = async () => {
    if (!referralLink) return;

    const sharerName = ((memberRecord?.first_name as string) || user?.name?.split(" ")[0] || "").trim();
    const intro = sharerName ? `Hi! I'm ${sharerName} \u2014 I just took the Sleep Chronotype Assessment and honestly, it was eye-opening.` : "Hi! I just took the Sleep Chronotype Assessment and honestly, it was eye-opening.";

    const message = `${intro}

It takes only about 2 minutes, and in that time it gives you a beautifully detailed breakdown of your natural sleep type (Lark, Eagle, or Owl) \u2014 your ideal sleep and wake times, when your focus peaks during the day, and simple, practical tips to feel more energized.

I genuinely thought of you when I got my result, so here's a personal invite to try it for free:

${referralLink}

I'd love to hear what your result is!`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Discover Your Sleep Chronotype", text: message });
        setRefShareResult("shared");
        setTimeout(() => setRefShareResult("idle"), 2500);
        return;
      } catch {
        // User dismissed the share sheet — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(message);
      setRefShareResult("copied");
      setTimeout(() => setRefShareResult("idle"), 2500);
    } catch {}
  };

  const handleShareResult = async () => {
    if (!latestReport || !latestReport.assessment_id) return;
    const resultLink = (typeof window !== "undefined" ? window.location.origin : "") + "/r/" + latestReport.assessment_id;
    const chronoLabel = chronotypeLabels[(latestReport.chronotype as string) ?? ""] ?? latestReport.chronotype ?? "Eagle";
    const article = /^[aeiou]/i.test(chronoLabel) ? "an" : "a";
    const sharerName = ((memberRecord?.first_name as string) || user?.name?.split(" ")[0] || "").trim();
    const intro = sharerName
      ? `Hi! I'm ${sharerName} \u2014 I just discovered my sleep chronotype, and it turns out I'm ${article} ${chronoLabel}!`
      : `Hi! I just discovered my sleep chronotype \u2014 it turns out I'm ${article} ${chronoLabel}!`;

    const message = `${intro}

The assessment took just 2 minutes and gave me a beautifully detailed breakdown of my natural sleep rhythm \u2014 my ideal sleep and wake times, when my focus peaks through the day, and practical tips I can actually use to feel more energized.

You can see my full result right here:

${resultLink}

Give it a try and let me know your result too!`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "My Sleep Chronotype Result", text: message });
        setResultShared(true);
        setTimeout(() => setResultShared(false), 2500);
        return;
      } catch {
        // User dismissed the share sheet — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(message);
      setResultShared(true);
      setTimeout(() => setResultShared(false), 2500);
    } catch {}
  };

  const handleDownloadReport = async () => {
    if (downloading || !latestReport) return;
    setDownloading(true);
    try {
      const { downloadPdf } = await import("@/lib/client-pdf");
      await downloadPdf({
        firstName: (memberRecord?.first_name as string) || "",
        lastName: (memberRecord?.last_name as string) || "",
        email: (memberRecord?.email as string) || "",
        chronotype: (latestReport.chronotype as string) || "EAGLE",
        totalScore: latestReport.totalScore || 0,
        larkScore: latestReport.larkScore || 0,
        eagleScore: latestReport.eagleScore || 0,
        owlScore: latestReport.owlScore || 0,
        wakeTime: data?.schedule?.wakeTime ?? undefined,
        bedtime: data?.schedule?.bedtime ?? undefined,
        peakFocus: data?.schedule?.peakFocus ?? undefined,
        assessmentDate: latestReport.generated_at || undefined,
      });
    } catch {
      // Non-blocking; the download button will just re-enable
    } finally {
      setDownloading(false);
    }
  };

  const handleConsultPrefilled = () => {
    openPrefilled({
      fname: (memberRecord?.first_name as string) || undefined,
      lname: (memberRecord?.last_name as string) || undefined,
      age: memberRecord?.age ? String(memberRecord.age) : undefined,
      gender: (memberRecord?.gender as string) || undefined,
      maritalStatus: (memberRecord?.marital_status as string) || undefined,
      country: (memberRecord?.country as string) || undefined,
      state: (memberRecord?.location as string) || undefined,
      city: (memberRecord?.city as string) || undefined,
      pincode: (memberRecord?.pincode as string) || undefined,
      email: (memberRecord?.email as string) || undefined,
      phone: (memberRecord?.phone as string) || undefined,
    });
  };

  return (
    <DashboardShell orgCode={data?.orgCode || undefined}>
      <div
        className="relative overflow-hidden rounded-[20px] p-[24px] md:p-[32px] mb-[24px] md:mb-[28px]"
        style={{ background: cardGradient }}
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
          <div className="flex flex-wrap items-center gap-[10px] mt-[2px]">
            <h2 className="m-0 text-[24px] md:text-[28px] font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: "#19164F", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              {result ? `Your Chronotype: ${chronotypeLabels[chronotype] ?? chronotype}` : "Ready to understand your sleep?"}
            </h2>
            {result && (
              <button type="button" onClick={() => router.push("/dashboard/chronotype")}
                className="inline-flex items-center gap-[4px] text-[12px] font-semibold px-[12px] py-[6px] rounded-lg border-none cursor-pointer transition-all hover:-translate-y-[0.5px]"
                style={{ color: "#35319B", background: "rgba(53,49,155,0.08)", fontFamily: "Poppins, sans-serif" }}>
                Know More <ArrowRight size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-[16px] mt-[8px]">
            <span className="text-[13px]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
              Sleep Score: <strong>{totalScore > 0 ? totalScore : "\u2014"}</strong>
            </span>
            <span className="text-[13px]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
              Assessments: <strong>{String(data?.assessments?.length ?? 0)}</strong>
            </span>
            {result && (
              <span className="text-[13px]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
                Confidence: <strong>{confidenceScore}%</strong>
              </span>
            )}
          </div>

          {/* Quick actions: referral · report · consult · donate */}
          <div className="flex flex-wrap items-center gap-[10px] mt-[16px] pt-[14px]" style={{ borderTop: "1px solid rgba(25,22,79,0.10)" }}>
            {referralLink && (
              <button type="button" onClick={handleShareReferral}
                title="Share your referral link with a personal message"
                className="inline-flex items-center gap-[8px] text-[12px] font-semibold px-[12px] py-[7px] rounded-lg border-none cursor-pointer transition-all hover:-translate-y-[0.5px]"
                style={{ color: "#19164F", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(25,22,79,0.12)", fontFamily: "Poppins, sans-serif" }}>
                <span style={{ opacity: 0.7 }}>Referral</span>
                <code className="text-[12px] font-semibold">{String(memberRecord?.referral_code ?? "")}</code>
                {refShareResult === "shared" || refShareResult === "copied" ? <Check size={13} stroke="#2E7D32" /> : <Share2 size={13} />}
                {refShareResult === "shared" && <span style={{ color: "#2E7D32" }}>Shared!</span>}
                {refShareResult === "copied" && <span style={{ color: "#2E7D32" }}>Copied!</span>}
              </button>
            )}
            <button type="button" onClick={handleDownloadReport}
              disabled={!latestReport || downloading}
              title={latestReport ? "Download your latest report (PDF)" : "No report available yet — complete an assessment first"}
              className="inline-flex items-center gap-[8px] text-[12px] font-semibold px-[12px] py-[7px] rounded-lg border-none cursor-pointer transition-all hover:-translate-y-[0.5px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ color: "#19164F", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(25,22,79,0.12)", fontFamily: "Poppins, sans-serif" }}>
              <Download size={13} />
              {downloading ? "Generating…" : "Download Report"}
            </button>
            <button type="button" onClick={handleShareResult}
              disabled={!latestReport || !latestReport.assessment_id}
              title={latestReport ? "Share your latest result with a personal message" : "No result available yet — complete an assessment first"}
              className="inline-flex items-center gap-[8px] text-[12px] font-semibold px-[12px] py-[7px] rounded-lg border-none cursor-pointer transition-all hover:-translate-y-[0.5px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ color: "#19164F", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(25,22,79,0.12)", fontFamily: "Poppins, sans-serif" }}>
              {resultShared ? <Check size={13} stroke="#2E7D32" /> : <Share2 size={13} />}
              {resultShared ? "Shared!" : "Share Result"}
            </button>
            <button type="button" onClick={handleConsultPrefilled}
              title="Book a consultation with your details pre-filled"
              className="inline-flex items-center gap-[8px] text-[12px] font-semibold px-[12px] py-[7px] rounded-lg border-none cursor-pointer transition-all hover:-translate-y-[0.5px]"
              style={{ color: "#19164F", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(25,22,79,0.12)", fontFamily: "Poppins, sans-serif" }}>
              <Stethoscope size={13} /> Consult
            </button>
            <button type="button" onClick={() => setDonateOpen(true)}
              title="Donate"
              className="inline-flex items-center gap-[8px] text-[12px] font-semibold px-[12px] py-[7px] rounded-lg border-none cursor-pointer transition-all hover:-translate-y-[0.5px]"
              style={{ color: "#19164F", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(25,22,79,0.12)", fontFamily: "Poppins, sans-serif" }}>
              <Heart size={13} fill="#FF6B6B" stroke="#FF6B6B" /> Donate
            </button>
          </div>
        </div>
      </div>

      {/* ─── Chronotype Gallery (one-by-one) ─── */}
      {result && mounted && (() => {
        const key = chronotype === "LARK" ? "LARK" : chronotype === "OWL" ? "OWL" : "EAGLE";
        const galleryLabel = chronotypeLabels[key] ?? key;
        const galleryImgs = isMobile && key === "EAGLE" ? chronotypeImageSrcsMobile(key) : chronotypeImageSrcs(key);
        return (
          <div className="rounded-[16px] p-[22px] md:p-[28px] mt-[16px] md:mt-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: key === "LARK" ? "#EE8300" : key === "OWL" ? "#7B68AE" : "#30268F", fontFamily: "Poppins, sans-serif" }}>
              Visual journey
            </span>
            <h3 className="m-0 mt-[4px] text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              Your {galleryLabel} gallery
            </h3>
            <p className="m-0 mt-[2px] mb-[12px] text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
              A visual journey through your {galleryLabel} rhythm.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {galleryImgs.map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noreferrer" aria-label={`${galleryLabel} image ${i + 1}`}
                  className="flex items-center gap-[12px]"
                  style={{ padding: "6px", borderRadius: "12px", border: "1px solid #EFEFF5", background: "#F7F7FA", textDecoration: "none" }}>
                  <span className="flex items-center justify-center rounded-full text-[13px] font-semibold shrink-0"
                    style={{ width: "30px", height: "30px", background: "#35319B", color: "#FFFFFF", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                    {i + 1}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${galleryLabel} image ${i + 1}`} loading={i === 0 ? "eager" : "lazy"}
                    style={{ flex: 1, minWidth: 0, width: "100%", height: "auto", borderRadius: "8px", display: "block" }} />
                </a>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] md:gap-[20px]">
        <div className="rounded-[16px] p-[22px] md:p-[28px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-[10px] mb-[12px]">
            <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(245,154,0,0.08)" }}>
              <Share2 size={18} stroke="#F59A00" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>My Referral Link</h3>
          </div>
          <p className="m-0 text-[12px] leading-[1.4] mb-[10px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
            Share your link and help someone discover their chronotype.
          </p>
          {data?.member?.referral_code ? (
            <div>
              <code className="block w-full px-[12px] py-[9px] text-[13px] font-mono font-semibold rounded-lg truncate mb-[8px]" style={{ background: "#F5F5F5", color: "#35319B" }}>
                {typeof window !== "undefined" ? window.location.origin + "/?ref=" + (data.member?.referral_code as string) : data.member?.referral_code as string}
              </code>
              <div className="flex gap-[8px]">
                <button type="button" onClick={() => { const code = data.member?.referral_code as string; navigator.clipboard.writeText((typeof window !== "undefined" ? window.location.origin + "/?ref=" : "") + code); setRefCopied(true); setTimeout(() => setRefCopied(false), 2000); }}
                  className="flex items-center gap-[6px] text-[12px] font-semibold px-[14px] py-[7px] rounded-lg border-none cursor-pointer transition-colors"
                  style={{ color: "#35319B", background: refCopied ? "rgba(46,125,50,0.1)" : "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                  <ClipboardCopy size={14} /> {refCopied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          ) : (
            <p className="m-0 text-[12px] italic" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Complete an assessment to get your referral link.</p>
          )}
        </div>

        <div className="lg:col-span-2 rounded-[16px] p-[22px] md:p-[28px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
              <FileText size={18} stroke="#35319B" />
            </div>
            <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>My Reports</h3>
          </div>
          {data?.reports && data.reports.length > 0 ? (
            <div className="flex flex-col gap-[10px]">
              {(data.reports as Array<Record<string, unknown>>)
                .slice(0, showAllReports ? undefined : 5)
                .map((r, i) => (
                <div key={String(r.id ?? i)} className="flex items-center justify-between py-[10px] px-[14px] rounded-lg" style={{ background: "#F8F9FF" }}>
                  <div className="flex items-center gap-[10px]">
                    <FileText size={16} stroke="#98A2B3" />
                    <div>
                      <p className="m-0 text-[13px] font-medium text-[#555]" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Report - {String(r.chronotype ?? "Chronotype")}
                      </p>
                      <p className="m-0 text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                        {r.generated_at ? new Date(r.generated_at as string).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <button type="button" onClick={() => { const aid = r.assessment_id as string | null | undefined; if (aid) window.location.href = `/r/${aid}`; }}
                      disabled={!r.assessment_id}
                      title="View Result"
                      className="flex items-center justify-center w-[32px] h-[30px] rounded-lg border-none cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ color: "#7B68AE", background: "rgba(123,104,174,0.08)", fontFamily: "Poppins, sans-serif" }}>
                      <Eye size={14} />
                    </button>
                    <button type="button" disabled={downloading} onClick={async () => { if (downloading) return; setDownloading(true); try { const { downloadPdf } = await import("@/lib/client-pdf"); await downloadPdf({ firstName: data.member?.first_name as string || "", lastName: data.member?.last_name as string || "", email: data.member?.email as string || "", chronotype: r.chronotype as string || "EAGLE", totalScore: r.totalScore as number || 0, larkScore: r.larkScore as number || 0, eagleScore: r.eagleScore as number || 0, owlScore: r.owlScore as number || 0, wakeTime: data.schedule?.wakeTime ?? undefined, bedtime: data.schedule?.bedtime ?? undefined, peakFocus: data.schedule?.peakFocus ?? undefined, assessmentDate: (r.generated_at as string) || undefined }); } finally { setDownloading(false); } }}
                      className="flex items-center gap-[5px] text-[11px] font-medium no-underline px-[10px] py-[5px] rounded-lg border-none cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> {downloading ? "Generating…" : "PDF"}
                    </button>
                  </div>
                </div>
              ))}
              {data.reports.length > 5 && (
                <button type="button" onClick={() => setShowAllReports(!showAllReports)}
                  className="flex items-center justify-center gap-[6px] text-[12px] font-semibold py-[9px] rounded-xl border-none cursor-pointer transition-colors mt-[4px]"
                  style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                  {showAllReports ? "Show Less" : `View All Reports (${data.reports.length})`}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[20px]" style={{ border: "1.5px dashed #E0E0E0", borderRadius: "12px" }}>
              <FileText size={32} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[10px] text-[13px] leading-[1.5] text-[#AAA] text-center max-w-[280px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                Complete your assessment to see your reports here.
              </p>
            </div>
          )}
          {data?.assessments && data.assessments.length > 0 && (
            <button type="button" onClick={() => { const m = data.member; if (m?.id) openForRetest(m.id as string); }}
              className="mt-[12px] w-full flex items-center justify-center gap-[6px] text-[12px] font-semibold py-[9px] rounded-xl border-none cursor-pointer transition-colors"
              style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              Take Test Again
            </button>
          )}
        </div>
      </div>

      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />

      {/* ─── Consult a Sleep Specialist Card ─── */}
      <div className="mt-[16px] md:mt-[20px] rounded-[16px] p-[22px] md:p-[28px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
          <div className="flex items-start gap-[14px]">
            <div className="w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}>
              <Phone size={22} stroke="white" />
            </div>
            <div>
              <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>Consult a Sleep Specialist</h3>
              <p className="m-0 mt-[4px] text-[13px] leading-[1.5] max-w-[480px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                Speak with a qualified sleep professional who can help you understand your results and guide you toward better sleep.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const m = data?.member as Record<string, unknown> | undefined;
              openPrefilled({
                fname: (m?.first_name as string) || undefined,
                lname: (m?.last_name as string) || undefined,
                age: m?.age ? String(m.age) : undefined,
                gender: (m?.gender as string) || undefined,
                maritalStatus: (m?.marital_status as string) || undefined,
                country: (m?.country as string) || undefined,
                state: (m?.location as string) || undefined,
                city: (m?.city as string) || undefined,
                pincode: (m?.pincode as string) || undefined,
                email: (m?.email as string) || undefined,
                phone: (m?.phone as string) || undefined,
              });
            }}
            className="shrink-0 flex items-center gap-[8px] text-[14px] font-semibold px-[20px] py-[11px] rounded-xl border-none cursor-pointer transition-all whitespace-nowrap"
            style={{ color: "#FFF", background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}
          >
            <Stethoscope size={16} /> Book Consultation
          </button>
        </div>
      </div>

      {/* ─── Donate for a Good Cause Card ─── */}
      <div className="mt-[16px] md:mt-[20px] rounded-[16px] p-[22px] md:p-[28px]" style={{ background: "linear-gradient(135deg, #FFF5F5, #FFF0E6)", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
          <div className="flex items-start gap-[14px]">
            <div className="w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #FF6B6B, #FF8E53)" }}>
              <Heart size={22} stroke="white" fill="white" />
            </div>
            <div>
              <h3 className="m-0 text-[16px] font-bold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>Support Better Sleep for All</h3>
              <p className="m-0 mt-[4px] text-[13px] leading-[1.5] max-w-[520px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                Your generous contribution helps provide free sleep consultations, wellness programs, and educational resources to underserved communities worldwide. Every donation brings us closer to a world where quality sleep health is accessible to everyone, regardless of circumstance.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDonateOpen(true)}
            className="shrink-0 flex items-center gap-[8px] text-[14px] font-semibold px-[20px] py-[11px] rounded-xl border-none cursor-pointer transition-all whitespace-nowrap"
            style={{ color: "#FFF", background: "linear-gradient(135deg, #FF6B6B, #FF8E53)", fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 14px rgba(255,107,107,0.35)" }}
          >
            <Heart size={16} fill="white" /> Donate Now
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}