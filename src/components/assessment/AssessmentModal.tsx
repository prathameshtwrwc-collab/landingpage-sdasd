"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAssessment } from "./AssessmentContext";
import { getAssessmentData, createMemberAndStartAssessment, submitAssessment, abandonAndRestartAssessment, saveAnswer } from "@/lib/actions/assessment";
import { downloadPdf, openPdfForPrint } from "@/lib/client-pdf";
import TermsModal from "./TermsModal";

interface Question {
  id: string;
  question_text: string;
  question_order: number;
  category: string | null;
  options: Option[];
}

interface Option {
  id: string;
  question_id: string;
  option_text: string;
  option_value: string;
  option_order: number;
}

interface FormData {
  fname: string;
  lname: string;
  age: string;
  gender: string;
  maritalStatus: string;
  department: string;
  country: string;
  location: string;
  city: string;
  pincode: string;
  occupation: string;
  email: string;
  phone: string;
  orgCode: string;
  referralCode: string;
  agreed: boolean;
}

const initialForm: FormData = {
  fname: "", lname: "", age: "", gender: "", maritalStatus: "",
  department: "", country: "", location: "", city: "", pincode: "",
  occupation: "", email: "", phone: "", orgCode: "", referralCode: "", agreed: false,
};

function CheckCircle() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" stroke="#35319B" strokeWidth="3" />
      <path d="M20 32 l8 8 l16 -16" stroke="#35319B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AssessmentModal() {
  const { isOpen, close } = useAssessment();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  // URL-detected codes (locked fields)
  const [lockedFields, setLockedFields] = useState<{ orgCode: boolean; referralCode: boolean }>({ orgCode: false, referralCode: false });

  // Data from server
  const [questions, setQuestions] = useState<Question[]>([]);
  const [versionId, setVersionId] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [memberId, setMemberId] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [existingAssessment, setExistingAssessment] = useState<{
    resumeIndex: number;
    existingAnswers: Record<number, string>;
    prevAssessmentId: string;
  } | null>(null);
  const [chronotypeResult, setChronotypeResult] = useState<{
    chronotype: string;
    total_score: number;
    confidence_score: number;
    lark_score: number;
    eagle_score: number;
    owl_score: number;
  } | null>(null);
  const [submissionMeta, setSubmissionMeta] = useState<{ sourceType: string | null; orgName: string | null } | null>(null);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [memberReferralCode, setMemberReferralCode] = useState<string | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      loadAssessmentData();

      // Detect org code from URL path (e.g. /AB0001, /TO0001, /AAB001)
      const path = window.location.pathname.replace(/\/+$/, "");
      // Match any single path segment that has 2+ letters followed by 2+ digits (org codes)
      const segments = path.split("/").filter(Boolean);
      const urlOrgCode = segments.length === 1 && /^[A-Za-z]{1,8}\d{2,6}$/i.test(segments[0])
        ? segments[0].toUpperCase()
        : "";

      // Detect referral code from URL query params (e.g. ?ref=XXXXX)
      const params = new URLSearchParams(window.location.search);
      const urlRefCode = params.get("ref") || "";

      const newForm: Partial<FormData> = {};
      const locks = { orgCode: false, referralCode: false };

      if (urlOrgCode && !urlRefCode) {
        newForm.orgCode = urlOrgCode;
        locks.orgCode = true;
        locks.referralCode = true;
      }

      if (urlRefCode) {
        newForm.referralCode = urlRefCode;
        locks.orgCode = true;
        locks.referralCode = true;
        if (!urlOrgCode) newForm.orgCode = "";
      }

      if (urlOrgCode || urlRefCode) {
        setForm((prev) => ({ ...prev, ...newForm }));
        setLockedFields(locks);
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const loadAssessmentData = useCallback(async () => {
    try {
      const data = await getAssessmentData();
      setQuestions(data.questions);
      setVersionId(data.versionId);
    } catch {
      setServerError("Failed to load assessment. Please try again.");
    }
  }, []);

  if (!isOpen) return null;

  const totalQuestions = questions.length;
  const isFormStep = step === 0;
  const questionIndex = step - 1;
  const isLastQuestion = step === totalQuestions;
  const isResumeAllDone = step > 0 && !isFormStep && questionIndex >= totalQuestions && totalQuestions > 0;

  const updateForm = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.fname.trim()) e.fname = "Required";
    if (!form.lname.trim()) e.lname = "Required";
    if (!form.age) e.age = "Required";
    if (!form.gender) e.gender = "Required";
    if (!form.maritalStatus) e.maritalStatus = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.pincode.trim()) e.pincode = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (!form.occupation.trim()) e.occupation = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.agreed) e.agreed = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitForm = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setServerError("");
    try {
      const result = await createMemberAndStartAssessment({
        first_name: form.fname,
        last_name: form.lname,
        age: form.age,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        marital_status: form.maritalStatus,
        department: form.department,
        country: form.country,
        location: form.location,
        city: form.city,
        pincode: form.pincode,
        occupation: form.occupation,
        org_code: form.orgCode || undefined,
        referral_code: form.referralCode || undefined,
      });
      setMemberId(result.memberId);
      setAssessmentId(result.assessmentId);

      // Resume support: if user has an in-progress assessment, show prompt
      if ("hasExistingAssessment" in result && result.hasExistingAssessment) {
        setExistingAssessment({
          resumeIndex: (result as Record<string, unknown>).resumeIndex as number,
          existingAnswers: (result as Record<string, unknown>).existingAnswers as Record<number, string>,
          prevAssessmentId: result.assessmentId,
        });
      } else {
        setStep(1);
        setAnswers({});
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to start assessment");
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (option: string) => {
    const newAnswers = { ...answers, [questionIndex]: option };
    setAnswers(newAnswers);

    // Persist this answer to the database so resume works
    try {
      await saveAnswer(assessmentId, questions[questionIndex].id, option);
    } catch {
      // Non-blocking: continue even if save fails
    }

    if (questionIndex < totalQuestions - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setServerError("");
      try {
        const result = await submitAssessment(
          assessmentId,
          Object.entries(newAnswers).map(([qIdx, optId]) => ({
            question_id: questions[Number(qIdx)].id,
            selected_option_id: optId,
          }))
        );
        setChronotypeResult(result.result);
        setSubmissionMeta({ sourceType: result.sourceType ?? null, orgName: result.orgName ?? null });
        setMemberName(result.memberName ?? null);
        setMemberReferralCode(result.referralCode ?? null);
        setSubmitted(true);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Failed to submit assessment");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetAndClose = () => {
    setStep(0);
    setForm(initialForm);
    setAnswers({});
    setSubmitted(false);
    setErrors({});
    setServerError("");
    setChronotypeResult(null);
    setSubmissionMeta(null);
    setMemberName(null);
    setMemberReferralCode(null);
    setCopiedReferral(false);
    setExistingAssessment(null);
    setMemberId("");
    setAssessmentId("");
    setLockedFields({ orgCode: false, referralCode: false });
    close();
  };

  const chronotypeLabels: Record<string, string> = {
    LARK: "Lark (Morning Type)",
    EAGLE: "Eagle (Intermediate Type)",
    OWL: "Owl (Evening Type)",
  };

  const chronotypeDescs: Record<string, string> = {
    LARK: "You naturally wake early and peak in the morning. Schedule important tasks before noon.",
    EAGLE: "You are flexible and adapt well to most schedules. Your peak productivity is midday.",
    OWL: "You naturally peak in the evening and prefer later schedules. Your creativity shines at night.",
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto"
      style={{ background: "rgba(15, 13, 45, 0.65)", padding: "40px 16px" }}
      onClick={(e) => { if (e.target === e.currentTarget) resetAndClose(); }}
    >
      <div
        className="relative w-full bg-white shadow-2xl overflow-hidden"
        style={{
          maxWidth: "600px",
          borderRadius: "16px",
          fontFamily: "Poppins, sans-serif",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <div style={{ height: "4px", background: "linear-gradient(90deg, #35319B, #F59A00)", width: "100%" }} />

        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close"
          className="absolute top-[14px] right-[16px] w-[34px] h-[34px] flex items-center justify-center bg-transparent border-none cursor-pointer z-10 hover:bg-gray-100"
          style={{ borderRadius: "50%" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {serverError && (
          <div className="px-[20px] pt-[16px]">
            <p className="m-0 text-[13px] text-red-600 text-center" style={{ fontFamily: "Poppins, sans-serif" }}>
              {serverError}
            </p>
          </div>
        )}

        {submitted && chronotypeResult ? (
          <div className="px-[20px] py-[28px] md:px-[32px] md:py-[32px]">

              {/* ─── Header ─── */}
              <div className="flex items-center gap-[14px] mb-[20px]">
                <div className="flex items-center justify-center w-[48px] h-[48px] rounded-xl shrink-0" style={{ background: chronotypeResult.chronotype === "LARK" ? "linear-gradient(135deg, #F59A00, #FBBF24)" : chronotypeResult.chronotype === "EAGLE" ? "linear-gradient(135deg, #35319B, #818CF8)" : "linear-gradient(135deg, #2C2255, #7B68AE)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Assessment Complete</p>
                  <p className="m-0 text-[18px] font-medium" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>Welcome, {memberName ?? "You"}</p>
                </div>
              </div>

              {/* ─── Chronotype Hero Card ─── */}
              <div className="rounded-2xl p-[20px] md:p-[24px] mb-[20px]" style={{
                background: chronotypeResult.chronotype === "LARK"
                  ? "linear-gradient(135deg, #FFFBEB, #FEF3C7)"
                  : chronotypeResult.chronotype === "EAGLE"
                    ? "linear-gradient(135deg, #EEF2FF, #E0E7FF)"
                    : "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
              }}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center text-[15px] font-semibold px-[18px] py-[8px] rounded-full text-white" style={{
                      background: chronotypeResult.chronotype === "LARK"
                        ? "linear-gradient(135deg, #F59A00, #F97316)"
                        : chronotypeResult.chronotype === "EAGLE"
                          ? "linear-gradient(135deg, #35319B, #6366F1)"
                          : "linear-gradient(135deg, #2C2255, #7B68AE)",
                      fontFamily: "Poppins, sans-serif",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}>
                      {chronotypeResult.chronotype === "LARK" ? " Lark · Morning Type" : chronotypeResult.chronotype === "EAGLE" ? "🦅 Eagle · Intermediate Type" : "🦉 Owl · Evening Type"}
                    </span>
                    <p className="m-0 mt-[14px] text-[15px] leading-[1.7] max-w-[420px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                      {chronotypeResult.chronotype === "LARK"
                        ? "Your biology runs early. You wake naturally with the sun, and your mind is at its sharpest before noon. Mornings are your superpower."
                        : chronotypeResult.chronotype === "EAGLE"
                          ? "Your biology sits in the middle. You adapt well to most schedules with steady, balanced energy throughout the day."
                          : "Your biology leans later. You come alive when the day quiets down, with deeper creative focus toward evening."}
                    </p>
                  </div>
                </div>
                {/* Stats inline */}
                <div className="flex gap-[16px] mt-[16px]">
                  <div className="flex items-center gap-[10px] px-[14px] py-[8px] rounded-lg" style={{ background: "rgba(255,255,255,0.7)" }}>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: "#999", fontFamily: "Poppins, sans-serif" }}>Confidence</span>
                    <span className="text-[22px] font-bold" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>{chronotypeResult.confidence_score}%</span>
                  </div>
                  <div className="flex items-center gap-[10px] px-[14px] py-[8px] rounded-lg" style={{ background: "rgba(255,255,255,0.7)" }}>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: "#999", fontFamily: "Poppins, sans-serif" }}>Score</span>
                    <span className="text-[22px] font-bold" style={{ color: "#F59A00", fontFamily: "Poppins, sans-serif" }}>{chronotypeResult.total_score}</span>
                  </div>
                </div>
              </div>

              {/* ─── Score Bars ─── */}
              <div className="mb-[22px]">
                <p className="m-0 text-[14px] font-semibold mb-[12px]" style={{ color: "#444", fontFamily: "Poppins, sans-serif" }}>Dimension Scores</p>
                <div className="flex flex-col gap-[10px]">
                  {[
                    { label: "Lark", score: chronotypeResult.lark_score, color: "#F59A00", max: 60 },
                    { label: "Eagle", score: chronotypeResult.eagle_score, color: "#35319B", max: 60 },
                    { label: "Owl", score: chronotypeResult.owl_score, color: "#7B68AE", max: 60 },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-[12px]">
                      <span className="text-[13px] font-semibold w-[52px] shrink-0 text-right" style={{ color: s.color, fontFamily: "Poppins, sans-serif" }}>{s.label}</span>
                      <div className="flex-1 h-[9px] rounded-full" style={{ background: "#F0F0F0" }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (s.score / s.max) * 100)}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}dd)` }} />
                      </div>
                      <span className="text-[16px] font-bold w-[32px] text-right" style={{ color: s.color, fontFamily: "Poppins, sans-serif" }}>{s.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Strengths & Challenges (side by side on md+) ─── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-[22px]">
                <div className="p-[16px] rounded-xl" style={{ background: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.12)" }}>
                  <p className="m-0 text-[13px] font-bold mb-[10px] flex items-center gap-[6px]" style={{ color: "#2E7D32", fontFamily: "Poppins, sans-serif" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Strengths
                  </p>
                  {[
                    chronotypeResult.chronotype === "LARK" ? "Early morning peak productivity" : chronotypeResult.chronotype === "EAGLE" ? "Flexible schedule adaptability" : "Late-day creative focus",
                    chronotypeResult.chronotype === "LARK" ? "Consistent natural wake-up" : chronotypeResult.chronotype === "EAGLE" ? "Steady midday energy" : "Creative problem solving at night",
                    chronotypeResult.chronotype === "LARK" ? "Strong morning discipline" : chronotypeResult.chronotype === "EAGLE" ? "Socially adaptable timing" : "Comfort with flexible late blocks",
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-[8px] mb-[6px] last:mb-0">
                      <span className="text-[11px] mt-[3px] text-[#2E7D32]">●</span>
                      <span className="text-[13px] leading-[1.5]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div className="p-[16px] rounded-xl" style={{ background: "rgba(211,47,47,0.05)", border: "1px solid rgba(211,47,47,0.1)" }}>
                  <p className="m-0 text-[13px] font-bold mb-[10px] flex items-center gap-[6px]" style={{ color: "#D32F2F", fontFamily: "Poppins, sans-serif" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    Challenges
                  </p>
                  {[
                    chronotypeResult.chronotype === "LARK" ? "Evening social events drain quickly" : chronotypeResult.chronotype === "EAGLE" ? "Rigid schedules disrupt balance" : "Early starts are physically costly",
                    chronotypeResult.chronotype === "LARK" ? "Hard to stay awake past 10 PM" : chronotypeResult.chronotype === "EAGLE" ? "Can drift without a routine" : "Morning fog and slow waking",
                    chronotypeResult.chronotype === "LARK" ? "Late-night work is inefficient" : chronotypeResult.chronotype === "EAGLE" ? "Energy dips mid-afternoon" : "Fixed schedules create sleep debt",
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-[8px] mb-[6px] last:mb-0">
                      <span className="text-[11px] mt-[3px] text-[#D32F2F]">●</span>
                      <span className="text-[13px] leading-[1.5]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Optimization Tips ─── */}
              <div className="p-[16px] rounded-xl mb-[18px]" style={{ background: "rgba(53,49,155,0.04)", border: "1px solid rgba(53,49,155,0.08)" }}>
                <p className="m-0 text-[13px] font-bold mb-[10px]" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>Optimize Your Rhythm</p>
                <div className="flex flex-col gap-[6px]">
                  {[
                    chronotypeResult.chronotype === "LARK" ? "Schedule important tasks before noon — your peak window" : chronotypeResult.chronotype === "EAGLE" ? "Block 10 AM – 2 PM for deep focused work" : "Use bright light within 30 min of waking to shift your clock",
                    chronotypeResult.chronotype === "LARK" ? "Avoid caffeine after 2 PM to protect early sleep" : chronotypeResult.chronotype === "EAGLE" ? "Maintain consistent wake and bed times for stability" : "Avoid critical tasks before 9 AM if possible",
                    chronotypeResult.chronotype === "LARK" ? "Wind down with dim lighting by 9 PM" : chronotypeResult.chronotype === "EAGLE" ? "Use your midday energy for exercise" : "Build a consistent 30-min pre-sleep wind-down",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-[10px]">
                      <span className="flex items-center justify-center w-[22px] h-[22px] rounded-full text-[10px] font-bold shrink-0 mt-[1px]" style={{ background: "rgba(53,49,155,0.1)", color: "#35319B", fontFamily: "Poppins, sans-serif" }}>{i + 1}</span>
                      <span className="text-[13px] leading-[1.6]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Source Tag ─── */}
              {submissionMeta?.orgName && (
                <div className="text-center mb-[12px]">
                  <span className="inline-block text-[10px] font-medium px-[10px] py-[3px] rounded-full" style={{ background: "rgba(53,49,155,0.06)", color: "#35319B", fontFamily: "Poppins, sans-serif" }}>
                    {submissionMeta.orgName}
                  </span>
                </div>
              )}

              {/* ─── Referral Code ─── */}
              <div className="mb-[18px] p-[16px] rounded-xl" style={{ background: "#FFFFFF", border: "1.5px solid #EEEEEE" }}>
                <p className="m-0 text-[13px] font-semibold mb-[4px]" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>
                  Refer a Friend
                </p>
                <p className="m-0 text-[12px] leading-[1.4] mb-[10px]" style={{ color: "#999", fontFamily: "Poppins, sans-serif" }}>
                  Share your link and help someone discover their chronotype.
                </p>
                {memberReferralCode ? (
                  <div className="flex items-center gap-[8px]">
                    <code className="flex-1 px-[12px] py-[9px] text-[14px] font-mono font-semibold rounded-lg truncate" style={{ background: "#F5F5F5", color: "#35319B" }}>
                      {typeof window !== "undefined" ? window.location.origin + "/?ref=" + memberReferralCode : memberReferralCode}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText((typeof window !== "undefined" ? window.location.origin + "/?ref=" : "") + memberReferralCode);
                        setCopiedReferral(true);
                        setTimeout(() => setCopiedReferral(false), 2000);
                      }}
                      className="flex items-center justify-center w-[38px] h-[38px] rounded-lg border-none cursor-pointer"
                      style={{ background: copiedReferral ? "rgba(46,125,50,0.1)" : "rgba(53,49,155,0.08)" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={copiedReferral ? "#2E7D32" : "#35319B"} strokeWidth="2" strokeLinecap="round">
                        {copiedReferral
                          ? <><polyline points="20 6 9 17 4 12" /></>
                          : <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>
                        }
                      </svg>
                    </button>
                  </div>
                ) : (
                  <p className="m-0 text-[12px] italic" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Generating...</p>
                )}
              </div>

              {/* ─── Action Buttons ─── */}
              <div className="flex flex-col gap-[10px] max-w-[340px] mx-auto">
                <div className="grid grid-cols-3 gap-[10px]">
                  <button type="button" onClick={() => chronotypeResult && downloadPdf({ firstName: form.fname, lastName: form.lname, email: form.email, chronotype: chronotypeResult.chronotype, totalScore: chronotypeResult.total_score, larkScore: chronotypeResult.lark_score, eagleScore: chronotypeResult.eagle_score, owlScore: chronotypeResult.owl_score, summary: chronotypeDescs[chronotypeResult.chronotype], orgName: submissionMeta?.orgName ?? undefined })}
                    className="flex flex-col items-center gap-[4px] text-[12px] font-semibold py-[12px] px-[8px] border-none cursor-pointer rounded-xl transition-all"
                    style={{ color: "#fff", background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    PDF
                  </button>
                  <button type="button" onClick={() => chronotypeResult && openPdfForPrint({ firstName: form.fname, lastName: form.lname, email: form.email, chronotype: chronotypeResult.chronotype, totalScore: chronotypeResult.total_score, larkScore: chronotypeResult.lark_score, eagleScore: chronotypeResult.eagle_score, owlScore: chronotypeResult.owl_score, summary: chronotypeDescs[chronotypeResult.chronotype], orgName: submissionMeta?.orgName ?? undefined })}
                    className="flex flex-col items-center gap-[4px] text-[12px] font-semibold py-[12px] px-[8px] border-none cursor-pointer rounded-xl transition-all"
                    style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Print
                  </button>
                  <button type="button" onClick={async () => {
                    if (!assessmentId) return;
                    const shareUrl = typeof window !== "undefined" ? window.location.origin + "/r/" + assessmentId : "";
                    if (typeof navigator !== "undefined" && navigator.share) {
                      try { await navigator.share({ title: "My Chronotype Result", url: shareUrl }); return; } catch {}
                    }
                    await navigator.clipboard.writeText(shareUrl);
                    setCopiedReferral(true);
                    setTimeout(() => setCopiedReferral(false), 2000);
                  }}
                    className="flex flex-col items-center gap-[4px] text-[12px] font-semibold py-[12px] px-[8px] border-none cursor-pointer rounded-xl transition-all"
                    style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    {copiedReferral ? "Copied!" : "Share"}
                  </button>
                </div>
                <button type="button" onClick={() => { window.location.href = "/login"; }}
                  className="w-full text-white text-[14px] font-semibold py-[12px] border-none cursor-pointer rounded-xl transition-all"
                  style={{ background: "#171717", fontFamily: "Poppins, sans-serif" }}>
                  Open My Dashboard
                </button>
                <button type="button" onClick={resetAndClose}
                  className="w-full text-[13px] font-medium py-[10px] border-none cursor-pointer rounded-xl transition-all"
                  style={{ color: "#888", background: "#F5F5F5", fontFamily: "Poppins, sans-serif" }}>
                  Close
                </button>
              </div>
            </div>
        ) : existingAssessment ? (
          <div className="flex flex-col items-center px-[24px] py-[36px] md:px-[40px] md:py-[44px] text-center">
            <div
              className="flex items-center justify-center w-[60px] h-[60px] rounded-full mb-[16px]"
              style={{ background: "rgba(53,49,155,0.08)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#35319B" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="m-0 text-[20px] font-bold mb-[6px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              Assessment In Progress
            </h3>
            <p className="m-0 text-[14px] leading-[1.5] max-w-[380px] mb-[24px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
              You have an existing assessment in progress. Would you like to resume where you left off or start a fresh one?
            </p>

            <div className="flex flex-col gap-[10px] w-full max-w-[320px]">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setServerError("");
                  try {
                    setAnswers(existingAssessment.existingAnswers);

                    // If all questions already answered, submit instead of resuming
                    if (existingAssessment.resumeIndex >= questions.length) {
                      const answersArr = Object.entries(existingAssessment.existingAnswers).map(
                        ([qIdx, optId]) => ({
                          question_id: questions[Number(qIdx)].id,
                          selected_option_id: optId,
                        })
                      );
                      const result = await submitAssessment(assessmentId, answersArr);
                      setChronotypeResult(result.result);
                      setSubmissionMeta({ sourceType: result.sourceType ?? null, orgName: result.orgName ?? null });
                      setSubmitted(true);
                    } else {
                      setStep(existingAssessment.resumeIndex + 1);
                    }
                    setExistingAssessment(null);
                  } catch (err) {
                    setServerError(err instanceof Error ? err.message : "Failed to resume");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full text-white text-[15px] font-semibold py-[13px] border-none cursor-pointer transition-all disabled:opacity-60"
                style={{ borderRadius: "10px", background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 16px rgba(53,49,155,0.25)" }}
              >
                Resume Assessment
              </button>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setServerError("");
                  try {
                    const result = await abandonAndRestartAssessment(existingAssessment.prevAssessmentId, memberId);
                    setAssessmentId(result.assessmentId);
                    setStep(1);
                    setAnswers({});
                    setExistingAssessment(null);
                  } catch (err) {
                    setServerError(err instanceof Error ? err.message : "Failed to restart");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full text-[14px] font-medium py-[12px] border-none cursor-pointer transition-all disabled:opacity-60"
                style={{ borderRadius: "10px", color: "#888", background: "#F5F5F5", fontFamily: "Poppins, sans-serif" }}
              >
                Start Over
              </button>
            </div>
          </div>
        ) : isFormStep ? (
          <div className="px-[20px] py-[32px] md:px-[36px]">
            <div className="text-center mb-[28px]">
              <div
                className="inline-flex items-center justify-center w-[52px] h-[52px] rounded-full mb-[14px]"
                style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="m-0 text-[21px] font-semibold text-[#35319B]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginBottom: "4px" }}>
                Sleep Chronotype Assessment
              </h3>
              <p className="m-0 text-[13px] leading-[1.4] text-[#888]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                Fill in your details to begin the assessment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <Field label="First Name *" value={form.fname} onChange={(v) => updateForm("fname", v)} error={errors.fname} />
              <Field label="Last Name *" value={form.lname} onChange={(v) => updateForm("lname", v)} error={errors.lname} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <Field label="Age *" value={form.age} onChange={(v) => {
                const cleaned = v.replace(/[^0-9]/g, "").slice(0, 3);
                const num = parseInt(cleaned, 10);
                if (cleaned && (num < 1 || num > 100)) return;
                updateForm("age", cleaned);
              }} error={errors.age} type="text" inputMode="numeric" />
              <SelectField label="Gender *" value={form.gender} onChange={(v) => updateForm("gender", v)} error={errors.gender} options={["Male", "Female", "Other"]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <SelectField label="Marital Status *" value={form.maritalStatus} onChange={(v) => updateForm("maritalStatus", v)} error={errors.maritalStatus} options={["Single", "Married", "Divorced", "Widowed"]} />
              <Field label="Department (Optional)" value={form.department} onChange={(v) => updateForm("department", v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <Field label="Country *" value={form.country} onChange={(v) => updateForm("country", v)} error={errors.country} />
              <Field label="City *" value={form.city} onChange={(v) => updateForm("city", v)} error={errors.city} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <Field label="Pincode *" value={form.pincode} onChange={(v) => updateForm("pincode", v)} error={errors.pincode} />
              <div className="relative">
                <SelectField label="Occupation *" value={form.occupation.startsWith("Other:") ? "Other" : form.occupation}
                  onChange={(v) => {
                    if (v === "Other") {
                      updateForm("occupation", "Other: ");
                    } else {
                      updateForm("occupation", v);
                    }
                  }}
                  error={errors.occupation}
                  options={["Student", "Homemaker", "Working Professional", "Business Owner", "Healthcare Professional", "Retired", "Other"]}
                />
                {form.occupation.startsWith("Other:") && (
                  <input
                    type="text"
                    value={form.occupation.replace("Other: ", "")}
                    onChange={(e) => updateForm("occupation", `Other: ${e.target.value}`)}
                    placeholder="Please specify..."
                    autoFocus
                    className="w-full px-[13px] py-[10px] text-[14px] bg-white rounded-lg outline-none mt-[8px]"
                    style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <Field label="Email *" value={form.email} onChange={(v) => updateForm("email", v)} error={errors.email} type="email" />
              <Field label="Phone *" value={form.phone} onChange={(v) => updateForm("phone", v)} error={errors.phone} type="tel" />
            </div>
            <div className="mb-[14px]">
              <Field label="State *" value={form.location} onChange={(v) => updateForm("location", v)} error={errors.location} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <Field label="Organization Code" value={form.orgCode} onChange={(v) => updateForm("orgCode", v)} readonly={lockedFields.orgCode} placeholder={lockedFields.orgCode ? "Auto-detected" : "Optional"} />
              <Field label="Referral Code" value={form.referralCode} onChange={(v) => updateForm("referralCode", v)} readonly={lockedFields.referralCode} placeholder={lockedFields.referralCode ? "Auto-detected" : "Optional"} />
            </div>

            <label className="flex items-start gap-[10px] mt-[18px] mb-[18px] cursor-pointer group">
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={(e) => updateForm("agreed", e.target.checked)}
                className="mt-[3px] shrink-0 w-[17px] h-[17px] accent-[#35319B]"
                style={{ borderRadius: "3px" }}
              />
              <span className="text-[13px] leading-[1.45] text-[#444] group-hover:text-[#35319B] transition-colors" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                I agree to the{" "}
                <button type="button" onClick={() => setShowTerms(true)}
                  className="text-[#35319B] underline font-semibold bg-transparent border-none cursor-pointer inline text-[13px] p-0"
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  terms and conditions
                </button>{" "}
                and{" "}
                <button type="button" onClick={() => setShowTerms(true)}
                  className="text-[#35319B] underline font-semibold bg-transparent border-none cursor-pointer inline text-[13px] p-0"
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  privacy policy
                </button>{" "}
                *
              </span>
            </label>
            {errors.agreed && <p className="m-0 text-[12px] text-red-500 mb-[12px]" style={{ fontFamily: "Poppins, sans-serif" }}>Please agree to continue</p>}

            <button
              type="button"
              onClick={submitForm}
              disabled={loading}
              className="w-full bg-[#3B35A3] hover:bg-[#2D2890] text-white text-[15px] font-semibold py-[14px] border-none cursor-pointer transition-colors disabled:opacity-60"
              style={{ borderRadius: "10px", fontFamily: "Poppins, sans-serif", letterSpacing: "0.01em" }}
            >
              {loading ? "Creating Account..." : "Start Assessment"}
            </button>
          </div>
        ) : loading && !questions.length ? (
          <div className="flex items-center justify-center py-[60px]">
            <p className="text-[14px] text-[#888]" style={{ fontFamily: "Poppins, sans-serif" }}>Loading questions...</p>
          </div>
        ) : questions.length > 0 ? (
          <QuestionsView
            questions={questions}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            answers={answers}
            step={step}
            setStep={setStep}
            loading={loading}
            answerQuestion={answerQuestion}
          />
        ) : (
          <div className="flex items-center justify-center py-[60px]">
            <p className="text-[14px] text-[#888]" style={{ fontFamily: "Poppins, sans-serif" }}>Loading questions...</p>
          </div>
        )}

        <style
          dangerouslySetInnerHTML={{
            __html: `
              input, select { font-family: Poppins, sans-serif; }
              input:focus, select:focus { outline: 2px solid #3B35A3; outline-offset: -1px; border-color: transparent !important; border-radius: 6px; }
              input[type="number"]::-webkit-outer-spin-button,
              input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
              input[type="number"] { -moz-appearance: textfield; appearance: textfield; }
            `,
          }}
        />

        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>
    </div>
  );
}

/* ----- FIELD COMPONENTS ----- */

function Field({ label, value, onChange, error, type = "text", inputMode, readonly, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; inputMode?: "text" | "numeric" | "tel" | "email" | "url"; readonly?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#444] mb-[5px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => { if (!readonly) onChange(e.target.value); }}
        inputMode={inputMode}
        readOnly={readonly}
        placeholder={placeholder}
        className="w-full px-[13px] py-[10px] text-[14px] bg-white transition-shadow"
        style={{
          borderRadius: "8px",
          border: `1.5px solid ${readonly ? "#E0E0E0" : "#D5D5D5"}`,
          fontFamily: "Poppins, sans-serif",
          background: readonly ? "#F8F8F8" : "#FFFFFF",
          color: readonly ? "#888" : "#171717",
          cursor: readonly ? "not-allowed" : "auto",
        }}
      />
      {error && <p className="m-0 text-[12px] text-red-500 mt-[3px]" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, error, options }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; options: string[];
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#444] mb-[5px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-[13px] py-[10px] text-[14px] bg-white transition-shadow"
        style={{ borderRadius: "8px", border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="m-0 text-[12px] text-red-500 mt-[3px]" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>}
    </div>
  );
}

function QuestionsView({ questions, questionIndex, totalQuestions, answers, step, setStep, loading, answerQuestion }: {
  questions: { id: string; question_text: string; question_order: number; category: string | null; options: { id: string; option_text: string; option_value: string; option_order: number }[] }[];
  questionIndex: number;
  totalQuestions: number;
  answers: Record<number, string>;
  step: number;
  setStep: (s: number) => void;
  loading: boolean;
  answerQuestion: (optionId: string) => void;
}) {
  const [animDir, setAnimDir] = useState<"left" | "right">("left");
  const [animating, setAnimating] = useState(false);
  const [displayedIdx, setDisplayedIdx] = useState(questionIndex);

  useEffect(() => {
    if (questionIndex !== displayedIdx) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setDisplayedIdx(questionIndex);
        setAnimating(false);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [questionIndex, displayedIdx]);

  const q = questions[displayedIdx];
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center px-[24px] py-[48px]" style={{ minHeight: "200px" }}>
        <p className="text-[14px] text-[#888] text-center" style={{ fontFamily: "Poppins, sans-serif" }}>Loading question...</p>
      </div>
    );
  }

  const handleOptionClick = (optId: string) => {
    if (loading || animating) return;
    answerQuestion(optId);
  };

  const handleBack = () => {
    if (animating) return;
    setAnimDir("right");
    setStep(step - 1);
  };

  const catColors: Record<string, string> = {
    sleep: "#2E7D32", routine: "#35319B", energy: "#F59A00", focus: "#D32F2F",
    health: "#7B68AE", lifestyle: "#E91E63", default: "#35319B",
  };
  const catBg: Record<string, string> = {
    sleep: "rgba(46,125,50,0.08)", routine: "rgba(53,49,155,0.08)", energy: "rgba(245,154,0,0.08)",
    focus: "rgba(211,47,47,0.08)", health: "rgba(123,104,174,0.08)", lifestyle: "rgba(233,30,99,0.08)",
    default: "rgba(53,49,155,0.08)",
  };

  return (
    <div className="px-[24px] py-[28px] md:px-[40px] md:py-[36px]" style={{ position: "relative", overflow: "hidden" }}>
      {/* Progress bar */}
      <div className="mb-[16px]">
        <div className="flex items-center justify-between mb-[6px]">
          <span className="text-[12px] font-medium" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-[12px] font-semibold" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-[5px]" style={{ background: "#F0F0F0", borderRadius: "3px", overflow: "hidden" }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #35319B, #7B76D4)",
              borderRadius: "3px",
            }}
          />
        </div>
      </div>

      {/* Step dots */}
      <div className="flex gap-[6px] mb-[24px] flex-wrap">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isAnswered = !!answers[idx];
          const isCurrent = idx === questionIndex;
          return (
            <div
              key={idx}
              className="transition-all duration-300"
              style={{
                width: isCurrent ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: isAnswered ? "linear-gradient(90deg, #35319B, #7B76D4)" : isCurrent ? "#35319B" : "#E8E8E8",
                opacity: isCurrent ? 1 : isAnswered ? 0.9 : 0.45,
                transform: isCurrent ? "scaleY(1.15)" : "scaleY(1)",
                transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          );
        })}
      </div>

      {/* Category badge */}
      {q.category && (
        <div className="mb-[12px]">
          <span
            className="inline-block text-[11px] font-semibold px-[10px] py-[4px] rounded-full uppercase tracking-[0.04em]"
            style={{
              background: catBg[q.category.toLowerCase()] ?? catBg.default,
              color: catColors[q.category.toLowerCase()] ?? catColors.default,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {q.category}
          </span>
        </div>
      )}

      {/* Question text */}
      <div
        className="mb-[22px]"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? `translateX(${animDir === "left" ? "16px" : "-16px"})` : "translateX(0)",
          transition: "opacity 0.18s ease, transform 0.2s ease",
        }}
      >
        <p
          className="m-0 text-[18px] leading-[1.55] font-semibold"
          style={{ color: "#171717", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
        >
          {q.question_text}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-[10px]">
        {q.options.map((opt, optIdx) => {
          const isSelected = answers[questionIndex] === opt.id;
          const letter = String.fromCharCode(65 + optIdx);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleOptionClick(opt.id)}
              disabled={loading}
              className="w-full text-left cursor-pointer transition-all duration-200 group"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                borderRadius: "12px",
                border: "1.5px solid",
                borderColor: isSelected ? "#35319B" : "#E8E8E8",
                background: isSelected
                  ? "linear-gradient(135deg, #F5F4FF 0%, #EDEBFF 100%)"
                  : "#FFFFFF",
                color: "#171717",
                padding: 0,
                opacity: loading ? 0.6 : 1,
                boxShadow: isSelected
                  ? "0 4px 16px rgba(53, 49, 155, 0.15), 0 1px 3px rgba(0,0,0,0.04)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
                transform: isSelected ? "scale(1.01)" : "scale(1)",
                transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onMouseEnter={(e) => {
                if (!isSelected && !loading) {
                  e.currentTarget.style.borderColor = "#7B76D4";
                  e.currentTarget.style.background = "#FAFAFF";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(53, 49, 155, 0.08)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected && !loading) {
                  e.currentTarget.style.borderColor = "#E8E8E8";
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <div className="flex items-center gap-[14px] px-[18px] py-[14px]">
                <span
                  className="inline-flex items-center justify-center font-bold shrink-0"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "10px",
                    background: isSelected ? "#35319B" : "#F0F0F0",
                    color: isSelected ? "#FFFFFF" : "#888",
                    fontSize: "13px",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    transition: "all 0.2s ease",
                  }}
                >
                  {letter}
                </span>
                <span className="flex-1 text-[15px] leading-[1.4]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                  {opt.option_text}
                </span>
                {isSelected && (
                  <span
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#35319B",
                      animation: "fadeInScale 0.25s ease",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Back */}
      <div className="flex justify-start mt-[22px]">
        <button
          type="button"
          onClick={handleBack}
          disabled={animating}
          className="text-[13px] font-medium bg-transparent border-none cursor-pointer transition-all duration-200 inline-flex items-center gap-[5px] disabled:opacity-40"
          style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#35319B"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#AAA"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
