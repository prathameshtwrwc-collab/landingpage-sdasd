"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2, X, SunMedium, BriefcaseBusiness, MoonStar, Zap,
  UsersRound, Target, Coffee, Moon, CalendarDays, Stethoscope,
  UserRoundPlus, ArrowRight, Download, Share2, ShieldCheck, Bird, Sunrise,
} from "lucide-react";
import { useAssessment } from "./AssessmentContext";
import { getAssessmentData, createMemberAndStartAssessment, submitAssessment, abandonAndRestartAssessment, saveAnswer } from "@/lib/actions/assessment";
import { downloadPdf, openPdfForPrint } from "@/lib/client-pdf";
import { CHRONOTYPE_LABELS, CHRONOTYPE_DESCRIPTIONS, CHRONOTYPE_PEAK_TIMES, CHRONOTYPE_BLUEPRINT } from "@/lib/chronotype-utils";
import { useConsult } from "@/components/consult/ConsultContext";
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
  const { isOpen, close, retestMemberId } = useAssessment();
  const { open: openConsult } = useConsult();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
  const [submissionMeta, setSubmissionMeta] = useState<{ sourceType: string | null; orgName: string | null; orgLogoUrl?: string | null } | null>(null);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [memberReferralCode, setMemberReferralCode] = useState<string | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    loadAssessmentData();

    // Lock body scroll, save position
    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    // Detect org code from URL path (e.g. /AB0001, /TO0001, /AAB001)
    const path = window.location.pathname.replace(/\/+$/, "");
    const segments = path.split("/").filter(Boolean);
    const urlOrgCode = segments.length === 1 && /^[A-Za-z]{1,8}\d{2,6}$/i.test(segments[0])
      ? segments[0].toUpperCase()
      : "";

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

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Handle retest: check for in-progress assessment or start fresh
  useEffect(() => {
    if (isOpen && retestMemberId && step === 0) {
      loadAssessmentData();
      (async () => {
        try {
          const result = await createMemberAndStartAssessment({
            first_name: "",
            last_name: "",
            age: "",
            email: "",
            phone: "",
            gender: "",
            marital_status: "",
            department: "",
            country: "",
            location: "",
            city: "",
            pincode: "",
            occupation: "",
            member_id: retestMemberId,
          });
          setMemberId(result.memberId);
          setAssessmentId(result.assessmentId);

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
        } catch {
          setServerError("Failed to start retest. Please try again.");
        }
      })();
    }
  }, [isOpen, retestMemberId]);

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
    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));

    try {
      await saveAnswer(assessmentId, questions[questionIndex].id, option);
    } catch {
      // Non-blocking
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex < totalQuestions - 1) {
      setStep(step + 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setSubmitting(true);
    setServerError("");
    try {
      const result = await submitAssessment(
        assessmentId,
        Object.entries(answers).map(([qIdx, optId]) => ({
          question_id: questions[Number(qIdx)].id,
          selected_option_id: optId,
        }))
      );
      setChronotypeResult(result.result);
      setSubmissionMeta({ sourceType: result.sourceType ?? null, orgName: result.orgName ?? null, orgLogoUrl: result.orgLogoUrl ?? null });
      setMemberName(result.memberName ?? null);
      setMemberReferralCode(result.referralCode ?? null);
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to submit assessment");
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(0);
    setForm(initialForm);
    setAnswers({});
    setSubmitted(false);
    setSubmitting(false);
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

  const isResultView = submitted && chronotypeResult;

  return (
    <div
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-heading"
      className="fixed inset-0 z-[9999] flex items-start justify-center result-modal-overlay"
      style={{
        background: "rgba(19, 22, 64, 0.72)",
        backdropFilter: isResultView ? "blur(5px)" : "none",
        padding: isResultView ? "12px 24px" : "40px 16px",
        overflow: "hidden",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) resetAndClose(); }}
    >
      <div
        className="relative bg-white result-modal-container"
        style={{
          maxWidth: isResultView ? "1480px" : "600px",
          borderRadius: isResultView ? "22px" : "16px",
          fontFamily: "Poppins, sans-serif",
          margin: "auto",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarGutter: "stable",
          boxSizing: "border-box",
          boxShadow: isResultView ? "0 24px 80px rgba(18, 20, 57, 0.28)" : undefined,
        }}
      >
        {!isResultView && <div style={{ height: "4px", background: "linear-gradient(90deg, #35319B, #F59A00)", width: "100%" }} />}

        {!isResultView && (
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
        )}

        {serverError && (
          <div className="px-[20px] pt-[16px]">
            <p className="m-0 text-[13px] text-red-600 text-center" style={{ fontFamily: "Poppins, sans-serif" }}>
              {serverError}
            </p>
          </div>
        )}

        {submitted && chronotypeResult ? (
          <EnhancedResult
            chronotypeResult={chronotypeResult}
            submissionMeta={submissionMeta}
            memberName={memberName}
            memberReferralCode={memberReferralCode}
            assessmentId={assessmentId}
            form={form}
            chronotypeDescs={chronotypeDescs}
            copiedReferral={copiedReferral}
            setCopiedReferral={setCopiedReferral}
            resetAndClose={resetAndClose}
            openConsult={openConsult}
          />
        ) : submitting ? (
          <div className="flex flex-col items-center justify-center px-[24px] py-[60px] text-center">
            <div className="relative mb-[28px]">
              <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #35319B, #7B76D4)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="absolute inset-0 w-[72px] h-[72px] rounded-full" style={{
                border: "3px solid rgba(53,49,155,0.15)",
                borderTopColor: "#35319B",
                animation: "spin 0.8s linear infinite",
              }} />
            </div>
            <h3 className="m-0 text-[20px] font-bold mb-[6px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              Analyzing Your Responses
            </h3>
            <p className="m-0 text-[14px] leading-[1.6] max-w-[340px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
              We're scoring your answers and generating your personalized chronotype profile. Just a moment...
            </p>
            <div className="flex gap-[6px] mt-[24px]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-[8px] h-[8px] rounded-full" style={{
                  background: "#35319B",
                  animation: "bounceLoader 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
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
                      setSubmissionMeta({ sourceType: result.sourceType ?? null, orgName: result.orgName ?? null, orgLogoUrl: result.orgLogoUrl ?? null });
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
            onNext={handleNextQuestion}
            onSubmit={handleSubmitAssessment}
            isSubmitting={submitting}
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
              .result-modal-container { overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable; box-sizing: border-box; width: calc(100vw - 48px); max-height: calc(100dvh - 20px); }
              .result-modal-container > :last-child { margin-bottom: 0; }
              .result-content .result-hero { min-height: 0; }
              .result-next-steps .result-step-item:first-child { border-left: none !important; }
              .result-overlay { overflow: hidden; }
              .chronotype-illustration svg { display: block; width: 100%; height: auto; max-height: 76px; }
              @media (max-width: 767px) {
                .result-modal-container { border-radius: 0 !important; max-width: 100% !important; max-height: 100dvh !important; width: 100% !important; min-height: 100dvh !important; }
                .result-hero { grid-template-columns: 1fr !important; gap: 12px !important; }
                .result-hero .chronotype-illustration { max-width: 90px !important; }
                .result-metrics-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
                .result-metrics-grid > .result-metric-item { border-left: none !important; border-bottom: 1px solid #E2E2EA !important; padding: 10px 16px !important; }
                .result-metrics-grid > .result-metric-item:last-child { border-bottom: none !important; }
                .result-insights { grid-template-columns: 1fr !important; }
                .result-next-steps-grid { grid-template-columns: 1fr !important; }
                .result-next-steps .result-step-item { border-left: none !important; padding: 6px 0 !important; }
                .result-action-cards { grid-template-columns: 1fr !important; }
                .result-action-card { grid-template-columns: 1fr !important; justify-items: center; text-align: center; min-height: auto !important; }
                .result-action-card > .min-w-0 { text-align: center; }
                .result-bottom-actions { grid-template-columns: 1fr !important; }
                .result-success-banner { max-width: 100% !important; }
                .result-footer { grid-template-columns: 1fr !important; gap: 6px !important; justify-items: center !important; text-align: center !important; }
              }
              @media (max-width: 399px) {
                .result-hero h2 { font-size: 1.5rem !important; }
                .result-hero .inline-block { font-size: 13px !important; padding: 4px 10px !important; }
                .result-hero p { font-size: 13px !important; }
                .result-metric-item { padding: 8px 12px !important; gap: 10px !important; }
                .result-metric-item > div:first-child { width: 40px !important; height: 40px !important; }
                .result-metric-item p:first-of-type { font-size: 16px !important; }
                .result-insights > div { padding: 8px 12px !important; }
                .result-insights p.text-\[15px\] { font-size: 14px !important; }
                .result-action-card { padding: 8px 12px !important; }
                .result-action-card h4 { font-size: 13px !important; }
                .result-bottom-actions button { font-size: 13px !important; min-height: 40px !important; }
                .result-content { gap: 6px !important; padding-left: 14px !important; padding-right: 14px !important; }
                .result-success-banner { padding: 7px 10px !important; }
                .result-success-banner p:first-of-type { font-size: 14px !important; }
                .result-success-banner p:last-of-type { font-size: 11px !important; }
              }
              @media (min-width: 768px) and (max-width: 899px) {
                .result-modal-container { max-width: calc(100vw - 32px) !important; }
                .result-hero { grid-template-columns: 1fr 1fr !important; }
                .result-metric-item { padding: 0 14px !important; gap: 12px !important; }
              }
              @media (min-width: 900px) and (max-width: 1199px) {
                .result-modal-container { max-width: calc(100vw - 40px) !important; }
              }
              @media (max-width: 899px) {
                .result-insights { grid-template-columns: 1fr !important; }
                .result-action-cards { grid-template-columns: 1fr !important; }
                .result-bottom-actions { grid-template-columns: 1fr !important; }
              }
              @media (max-width: 899px) {
                .result-action-card { grid-template-columns: 1fr !important; justify-items: center; text-align: center; min-height: auto !important; }
                .result-action-card > .min-w-0 { text-align: center; }
              }
              @media (max-width: 767px) {
                .result-modal-overlay { padding: 0 !important; }
              }
              @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
                .result-bottom-actions button, .result-action-card button { transform: none !important; }
              }
              @media (hover: none) {
                .result-bottom-actions button:hover, .result-action-card button:hover { transform: none !important; }
              }
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

function QuestionsView({ questions, questionIndex, totalQuestions, answers, step, setStep, loading, answerQuestion, onNext, onSubmit, isSubmitting }: {
  questions: { id: string; question_text: string; question_order: number; category: string | null; options: { id: string; option_text: string; option_value: string; option_order: number }[] }[];
  questionIndex: number;
  totalQuestions: number;
  answers: Record<number, string>;
  step: number;
  setStep: (s: number) => void;
  loading: boolean;
  answerQuestion: (optionId: string) => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
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
    if (loading || animating || isSubmitting) return;
    answerQuestion(optId);
  };

  const handleBack = () => {
    if (animating || isSubmitting) return;
    setAnimDir("right");
    setStep(step - 1);
  };

  const isLastQ = questionIndex === totalQuestions - 1;
  const hasSelection = !!answers[questionIndex];

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
      <div className="flex items-center justify-between mt-[22px]">
        <button
          type="button"
          onClick={handleBack}
          disabled={animating || isSubmitting}
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

        {isLastQ ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!hasSelection || isSubmitting}
            className="flex items-center gap-[8px] text-[14px] font-semibold px-[24px] py-[11px] border-none cursor-pointer transition-all duration-200 disabled:opacity-40"
            style={{
              borderRadius: "10px",
              color: "#FFF",
              background: "linear-gradient(135deg, #2E7D32, #43A047)",
              fontFamily: "Poppins, sans-serif",
              boxShadow: hasSelection && !isSubmitting ? "0 4px 14px rgba(46,125,50,0.35)" : "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!hasSelection || isSubmitting}
            className="flex items-center gap-[8px] text-[14px] font-semibold px-[24px] py-[11px] border-none cursor-pointer transition-all duration-200 disabled:opacity-40"
            style={{
              borderRadius: "10px",
              color: "#FFF",
              background: "linear-gradient(135deg, #35319B, #5A55C0)",
              fontFamily: "Poppins, sans-serif",
              boxShadow: hasSelection && !isSubmitting ? "0 4px 14px rgba(53,49,155,0.25)" : "none",
            }}
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounceLoader {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

/* ─── CHRONOTYPE ILLUSTRATIONS ─── */

function LarkIllustration() {
  return <Sunrise size={80} strokeWidth={1.4} stroke="#EE8300" aria-hidden="true" />;
}

function EagleIllustration() {
  return <Bird size={80} strokeWidth={1.4} stroke="#30268F" aria-hidden="true" />;
}

function OwlIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-auto">
      <path d="M60 60 Q100 100 140 60" stroke="#30268F" strokeWidth="1.6" fill="#F6F4FF" opacity="0.7" strokeLinecap="round" />
      <circle cx="72" cy="75" r="4" fill="#30268F" opacity="0.3" />
      <circle cx="128" cy="75" r="4" fill="#30268F" opacity="0.3" />
      <circle cx="100" cy="85" r="12" stroke="#30268F" strokeWidth="1.3" fill="#F6F4FF" opacity="0.5" strokeLinecap="round" />
      <path d="M60 42 L60 120" stroke="#30268F" strokeWidth="1.2" opacity="0.2" />
      <path d="M140 42 L140 120" stroke="#30268F" strokeWidth="1.2" opacity="0.2" />
      <circle cx="30" cy="40" r="6" stroke="#30268F" strokeWidth="1" fill="#F6F4FF" opacity="0.4" />
      <circle cx="170" cy="50" r="4" stroke="#30268F" strokeWidth="0.8" fill="#F6F4FF" opacity="0.3" />
    </svg>
  );
}

/* ─── REDESIGNED RESULT SCREEN ─── */

function EnhancedResult({
  chronotypeResult, submissionMeta, memberName, memberReferralCode,
  assessmentId, form, chronotypeDescs, copiedReferral, setCopiedReferral, resetAndClose, openConsult,
}: {
  chronotypeResult: { chronotype: string; total_score: number; confidence_score: number; lark_score: number; eagle_score: number; owl_score: number };
  submissionMeta: { sourceType: string | null; orgName: string | null; orgLogoUrl?: string | null } | null;
  memberName: string | null;
  memberReferralCode: string | null;
  assessmentId: string;
  form: FormData;
  chronotypeDescs: Record<string, string>;
  copiedReferral: boolean;
  setCopiedReferral: (v: boolean) => void;
  resetAndClose: () => void;
  openConsult: () => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const chrono = chronotypeResult.chronotype as "LARK" | "EAGLE" | "OWL";
  const isLark = chrono === "LARK";
  const isEagle = chrono === "EAGLE";
  const isOwl = chrono === "OWL";

  const peaks = CHRONOTYPE_PEAK_TIMES[chrono];
  const blueprint = CHRONOTYPE_BLUEPRINT[chrono];
  const label = CHRONOTYPE_LABELS[chrono];

  const subtitle = isLark ? "Morning Type" : isEagle ? "Intermediate Type" : "Evening Type";

  const wakeTime = blueprint.window.split(" – ")[1] ?? "";
  const bedtime = blueprint.window.split(" – ")[0] ?? "";

  const wakeHour = wakeTime.replace(/^0/, "");
  const bedHour = bedtime;

  const strengths = isLark
    ? [
        { text: "Daytime energy peaks before noon", icon: Zap },
        { text: "Consistent early-morning wake-up", icon: SunMedium },
        { text: "Strong focus in the early hours", icon: Target },
      ]
    : isEagle
      ? [
          { text: "Steady midday energy for deep work", icon: Zap },
          { text: "Adaptable to most daily routines", icon: UsersRound },
          { text: "Balanced social and work timing", icon: Target },
        ]
      : [
          { text: "Late-day creative focus", icon: Zap },
          { text: "Comfortable with flexible schedules", icon: UsersRound },
          { text: "Strong problem-solving at night", icon: Target },
        ];

  const watchOuts = isLark
    ? [
        { text: "Evening social events drain energy quickly", icon: Coffee },
        { text: "Hard to stay awake past 10 PM", icon: Moon },
        { text: "Weekend sleep drift disrupts rhythm", icon: CalendarDays },
      ]
    : isEagle
      ? [
          { text: "Rigid schedules can disrupt balance", icon: Coffee },
          { text: "Energy dips mid-afternoon", icon: Moon },
          { text: "Can drift without a consistent routine", icon: CalendarDays },
        ]
      : [
          { text: "Early mornings feel physically costly", icon: Coffee },
          { text: "Morning fog and slow waking", icon: Moon },
          { text: "Fixed schedules create sleep debt", icon: CalendarDays },
        ];

  const tips = isLark
    ? ["Schedule important tasks before your noon peak", "Avoid caffeine after 2 PM to protect early sleep", "Wind down with dim lighting by 9 PM"]
    : isEagle
      ? ["Block 10 AM – 2 PM for your deepest focus", "Keep consistent wake and bed times for stability", "Use midday energy for physical activity"]
      : ["Use bright light within 30 min of waking", "Avoid critical tasks before 9 AM if possible", "Build a consistent 30-min pre-sleep routine"];

  const chronotypeName = label.split(" (")[0];

  const IllustrationComponent = isLark ? LarkIllustration : isEagle ? EagleIllustration : OwlIllustration;

  return (
    <div className="result-content px-[18px] lg:px-[28px] lg:pt-[18px] lg:pb-[8px]" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* ─── Close Button ─── */}
      <button
        type="button"
        onClick={resetAndClose}
        aria-label="Close result"
        className="absolute top-[20px] right-[20px] flex items-center justify-center bg-transparent border-none cursor-pointer z-50 rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f] hover:bg-[#E6E6EE]"
        style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px" }}
      >
        <X size={25} strokeWidth={1.75} stroke="#66677A" />
      </button>

      {/* ─── Success Message ─── */}
      <div
        className="flex items-center gap-[10px] rounded-xl result-success-banner"
      style={{
        background: "#F5FBF7",
        border: "1px solid #C9DFD1",
        padding: "9px 14px",
        maxWidth: "62%",
        minHeight: "0",
      }}
      >
        <CheckCircle2 size={22} strokeWidth={1.75} stroke="#18794E" className="shrink-0" />
        <div>
          <p className="m-0 text-[15px] font-semibold leading-[1.35]" style={{ color: "#17172B", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
            Assessment complete
          </p>
          <p className="m-0 text-[12px] leading-[1.35] mt-[1px]" style={{ color: "#66677A", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
            Thank you for taking the Sleep Chronotype Assessment. Your personalised result is ready.
          </p>
        </div>
      </div>

      {/* ─── Chronotype Hero ─── */}
      <div className="result-hero" style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(240px, 0.6fr)",
        alignItems: "center",
        gap: "24px",
        minHeight: "118px",
      }}>
        <div>
          <h2 id="result-heading" className="m-0 font-bold tracking-[-0.025em] leading-[1.08]" style={{
            color: "#30268F",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 2.2vw, 2.6rem)",
          }}>
            Your chronotype is {chronotypeName}
          </h2>
          <span className="inline-block mt-[8px] px-[14px] py-[5px] text-[15px] font-medium rounded-[999px]" style={{
            color: "#EE8300",
            background: "#FFF8EF",
            border: "1px solid #F5CF9E",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}>
            {subtitle}
          </span>
          <p className="m-0 mt-[9px] leading-[1.4] max-w-[64ch]" style={{
            color: "#66677A",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
          }}>
            {chronotypeDescs[chrono]}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center chronotype-visual-group" style={{ gap: "7px", height: "120px", overflow: "visible" }}>
          <div className="chronotype-illustration" style={{ width: "100%", maxWidth: "110px", maxHeight: "76px", overflow: "visible" }}>
            <IllustrationComponent />
          </div>
          <span className="inline-flex items-center text-[13px] font-medium px-[12px] py-[4px] rounded-[999px]" style={{
            color: "#30268F",
            background: "#F6F4FF",
            border: "1px solid #D8D3FA",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}>
            Peak focus &middot; {peaks.focus}
          </span>
        </div>
      </div>

      {/* ─── Key Schedule Metrics ─── */}
      <div className="result-metrics-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        border: "1px solid #E2E2EA",
        borderRadius: "12px",
        background: "#FFFFFF",
        padding: "9px 0",
        minHeight: "82px",
      }}>
        {[
          { icon: SunMedium, label: "Ideal wake time", value: wakeHour, color: "#EE8300" },
          { icon: BriefcaseBusiness, label: "Best focus window", value: peaks.focus, color: "#30268F" },
          { icon: MoonStar, label: "Ideal bedtime", value: bedHour, color: "#30268F" },
        ].map((item, i) => (
          <div key={item.label} className="result-metric-item" style={{
            display: "grid",
            gridTemplateColumns: "52px minmax(0, 1fr)",
            alignItems: "center",
            gap: "14px",
            padding: "0 24px",
            borderLeft: i > 0 ? "1px solid #E2E2EA" : "none",
          }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: "48px", height: "48px", background: `${item.color}0d` }}>
              <item.icon size={23} strokeWidth={1.75} stroke={item.color} />
            </div>
            <div className="min-w-0">
              <p className="m-0 font-semibold leading-[1.3] truncate" style={{ fontSize: "clamp(18px, 1.8vw, 22px)", color: "#17172B", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                {item.value}
              </p>
              <p className="m-0 mt-[1px] text-[12px]" style={{ color: "#66677A", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Strengths & Watch-Outs ─── */}
      <div className="result-insights" style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "14px",
      }}>
        <div className="rounded-xl" style={{ padding: "10px 16px", background: "#F5FBF7", border: "1px solid #C9DFD1" }}>
          <p className="m-0 text-[15px] font-semibold leading-[1.3] mb-[6px]" style={{ color: "#18794E", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
            Natural strengths
          </p>
          <div className="flex flex-col" style={{ gap: "3px" }}>
            {strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-[9px]" style={{ minHeight: "32px" }}>
                <span className="flex items-center justify-center shrink-0 rounded-full" style={{ width: "32px", height: "32px", border: "1.5px solid rgba(24,121,78,0.2)" }}>
                  <s.icon size={16} strokeWidth={1.75} stroke="#18794E" />
                </span>
                <span className="text-[13px] leading-[1.3]" style={{ color: "#17172B", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                  {s.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl" style={{ padding: "10px 16px", background: "#FFF8EF", border: "1px solid #F5CF9E" }}>
          <p className="m-0 text-[15px] font-semibold leading-[1.3] mb-[6px]" style={{ color: "#EE8300", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
            Watch-outs
          </p>
          <div className="flex flex-col" style={{ gap: "3px" }}>
            {watchOuts.map((w, i) => (
              <div key={i} className="flex items-start gap-[9px]" style={{ minHeight: "32px" }}>
                <span className="flex items-center justify-center shrink-0 rounded-full" style={{ width: "32px", height: "32px", border: "1.5px solid rgba(238,131,0,0.2)" }}>
                  <w.icon size={16} strokeWidth={1.75} stroke="#EE8300" />
                </span>
                <span className="text-[13px] leading-[1.3]" style={{ color: "#17172B", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                  {w.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Best Next Steps ─── */}
      <div className="result-next-steps" style={{
        background: "#F6F4FF",
        border: "1px solid #D8D3FA",
        borderRadius: "12px",
        padding: "8px 16px 9px",
      }}>
        <p className="m-0 text-[14px] font-semibold mb-[7px]" style={{ color: "#30268F", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          Your best next steps
        </p>
        <div className="result-next-steps-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          alignItems: "center",
        }}>
          {tips.map((tip, i) => (
            <div key={i} className="result-step-item" style={{
              display: "grid",
              gridTemplateColumns: "30px minmax(0, 1fr)",
              alignItems: "center",
              gap: "9px",
              padding: "0 14px",
              borderLeft: i > 0 ? "1px solid #D8D3FA" : "none",
              minHeight: "36px",
            }}>
              <span className="flex items-center justify-center rounded-full text-[12px] font-semibold" style={{ width: "30px", height: "30px", background: "#30268F", color: "#FFFFFF", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                {i + 1}
              </span>
              <span className="text-[13px] leading-[1.35]" style={{ color: "#17172B", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Action Cards ─── */}
      <div className="result-action-cards" style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "14px",
      }}>
        {/* Consult a Doctor */}
        <div className="result-action-card" style={{
          display: "grid",
          gridTemplateColumns: "46px minmax(0, 1fr) auto",
          alignItems: "center",
          gap: "12px",
          padding: "8px 14px",
          borderRadius: "12px",
          minHeight: "70px",
          background: "#FFF8EF",
          border: "1px solid #F5CF9E",
        }}>
          <div className="flex items-center justify-center rounded-full" style={{ width: "46px", height: "46px", minWidth: "46px", background: "rgba(238,131,0,0.08)" }}>
            <Stethoscope size={24} strokeWidth={1.75} stroke="#EE8300" />
          </div>
          <div className="min-w-0">
            <h4 className="m-0 text-[14px] font-semibold" style={{ color: "#17172B", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              Consult a doctor
            </h4>
            <p className="m-0 text-[12px] leading-[1.35] mt-[1px]" style={{ color: "#66677A", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
              Get personalised guidance from a sleep specialist.
            </p>
          </div>
          <button
            type="button"
            onClick={openConsult}
            className="inline-flex items-center gap-[7px] text-[13px] font-semibold px-[14px] border-none cursor-pointer rounded-lg transition-all duration-200 hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f] shrink-0"
            style={{ minHeight: "42px", color: "#FFFFFF", background: "#EE8300", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
          >
            Book consultation
            <ArrowRight size={14} strokeWidth={1.75} />
          </button>
        </div>
        {/* Refer a Friend */}
        <div className="result-action-card" style={{
          display: "grid",
          gridTemplateColumns: "46px minmax(0, 1fr) auto",
          alignItems: "center",
          gap: "12px",
          padding: "8px 14px",
          borderRadius: "12px",
          minHeight: "70px",
          background: "#F6F4FF",
          border: "1px solid #D8D3FA",
        }}>
          <div className="flex items-center justify-center rounded-full" style={{ width: "46px", height: "46px", minWidth: "46px", background: "rgba(48,38,143,0.08)" }}>
            <UserRoundPlus size={24} strokeWidth={1.75} stroke="#30268F" />
          </div>
          <div className="min-w-0">
            <h4 className="m-0 text-[14px] font-semibold" style={{ color: "#17172B", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              Refer a friend
            </h4>
            <p className="m-0 text-[12px] leading-[1.35] mt-[1px]" style={{ color: "#66677A", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
              Help someone discover their natural sleep rhythm.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!memberReferralCode) return;
              const link = (typeof window !== "undefined" ? window.location.origin + "/?ref=" : "") + memberReferralCode;
              if (typeof navigator !== "undefined" && navigator.share) {
                try { await navigator.share({ title: "Discover your sleep chronotype", url: link }); return; } catch {}
              }
              await navigator.clipboard.writeText(link);
              setCopiedReferral(true);
              setTimeout(() => setCopiedReferral(false), 2000);
            }}
            className="inline-flex items-center gap-[7px] text-[13px] font-semibold px-[14px] border-none cursor-pointer rounded-lg transition-all duration-200 hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f] shrink-0"
            style={{ minHeight: "42px", color: "#FFFFFF", background: "#30268F", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
          >
            {copiedReferral ? "Link copied" : "Send referral"}
            <ArrowRight size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* ─── Bottom Actions ─── */}
      <div className="result-bottom-actions" style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr 0.85fr",
        gap: "12px",
      }}>
        <button
          type="button"
          disabled={downloading}
          onClick={async () => { if (downloading) return; setDownloading(true); try { await downloadPdf({ firstName: form.fname, lastName: form.lname, email: form.email, chronotype: chronotypeResult.chronotype, totalScore: chronotypeResult.total_score, larkScore: chronotypeResult.lark_score, eagleScore: chronotypeResult.eagle_score, owlScore: chronotypeResult.owl_score, summary: chronotypeDescs[chronotypeResult.chronotype], orgName: submissionMeta?.orgName ?? undefined }); } finally { setDownloading(false); } }}
          className="inline-flex items-center justify-center gap-[9px] text-[14px] font-semibold border-none cursor-pointer rounded-lg transition-all duration-200 hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{ minHeight: "44px", color: "#FFFFFF", background: "#30268F", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
        >
          <Download size={19} strokeWidth={1.75} />
          {downloading ? "Generating report…" : "Download full report"}
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!assessmentId) return;
            const shareUrl = typeof window !== "undefined" ? window.location.origin + "/r/" + assessmentId : "";
            if (typeof navigator !== "undefined" && navigator.share) {
              try { await navigator.share({ title: "My Chronotype Result", url: shareUrl }); return; } catch {}
            }
            await navigator.clipboard.writeText(shareUrl);
            setCopiedReferral(true);
            setTimeout(() => setCopiedReferral(false), 2000);
          }}
          className="inline-flex items-center justify-center gap-[9px] text-[14px] font-semibold border rounded-lg transition-all duration-200 hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f]"
          style={{ minHeight: "44px", color: "#17172B", background: "#FFFFFF", border: "1px solid #E2E2EA", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
        >
          <Share2 size={19} strokeWidth={1.75} />
          Share result
        </button>
        <button
          type="button"
          onClick={() => { window.location.href = "/login"; }}
          className="inline-flex items-center justify-center text-[14px] font-medium bg-transparent border-none cursor-pointer rounded-lg transition-all duration-200 hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f]"
          style={{ minHeight: "44px", color: "#30268F", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
        >
          Retake assessment
        </button>
      </div>

      {/* ─── Footer: Logos + Disclaimer ─── */}
      <div className="result-footer" style={{
        display: "grid",
        gridTemplateColumns: submissionMeta?.orgLogoUrl ? "minmax(0, 1fr) auto" : "1fr",
        alignItems: "center",
        gap: "20px",
        minHeight: "36px",
        paddingTop: "7px",
        borderTop: "1px solid #E6E6EE",
      }}>
        {submissionMeta?.orgLogoUrl ? (
          <div className="flex items-center flex-wrap gap-[8px 16px]" style={{ fontSize: "11px", color: "#77788A", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
            <span>Participating organisations:</span>
            <img
              src={submissionMeta.orgLogoUrl}
              alt={submissionMeta.orgName ? `${submissionMeta.orgName} logo` : "Partner organisation logo"}
              style={{ width: "auto", maxWidth: "90px", height: "auto", maxHeight: "19px", objectFit: "contain", opacity: 0.72, filter: "grayscale(1)" }}
              loading="lazy"
            />
          </div>
        ) : null}
        <div className="flex items-center justify-center gap-[6px]" style={{ gridColumn: submissionMeta?.orgLogoUrl ? "auto" : "1 / -1" }}>
          <ShieldCheck size={14} strokeWidth={1.75} stroke="#9999AA" />
          <p className="m-0 text-[11px] whitespace-nowrap" style={{ color: "#9999AA", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
            Wellness guidance only &mdash; not a medical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
}
