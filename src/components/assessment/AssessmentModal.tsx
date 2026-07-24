"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAssessment } from "./AssessmentContext";
import { getAssessmentData, createMemberAndStartAssessment, submitAssessment } from "@/lib/actions/assessment";

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

  // URL-detected codes (locked fields)
  const [lockedFields, setLockedFields] = useState<{ orgCode: boolean; referralCode: boolean }>({ orgCode: false, referralCode: false });

  // Data from server
  const [questions, setQuestions] = useState<Question[]>([]);
  const [versionId, setVersionId] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [memberId, setMemberId] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [chronotypeResult, setChronotypeResult] = useState<{
    chronotype: string;
    total_score: number;
    confidence_score: number;
    lark_score: number;
    eagle_score: number;
    owl_score: number;
  } | null>(null);
  const [submissionMeta, setSubmissionMeta] = useState<{ sourceType: string | null; orgName: string | null } | null>(null);

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
      const { memberId: mId, assessmentId: aId } = await createMemberAndStartAssessment({
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
      setMemberId(mId);
      setAssessmentId(aId);
      setStep(1);
      setAnswers({});
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to start assessment");
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (option: string) => {
    const newAnswers = { ...answers, [questionIndex]: option };
    setAnswers(newAnswers);

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
    setMemberId("");
    setAssessmentId("");
    setLockedFields({ orgCode: false, referralCode: false });
    close();
  };

  const chronotypeLabels: Record<string, string> = {
    LARK: "Lion (Morning Type)",
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
          <div className="flex flex-col items-center px-[24px] py-[40px] md:px-[40px]">
            <div style={{ marginBottom: "16px" }}>
              <CheckCircle />
            </div>
            <h3 className="m-0 text-[22px] font-semibold text-[#35319B] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginBottom: "4px" }}>
              Your Chronotype Result
            </h3>
            <p className="m-0 text-[20px] font-bold text-[#F59A00] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, marginBottom: "6px" }}>
              {chronotypeLabels[chronotypeResult.chronotype] ?? chronotypeResult.chronotype}
            </p>
            <p className="m-0 text-[14px] leading-[1.6] text-[#555] text-center max-w-[420px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "16px" }}>
              {chronotypeDescs[chronotypeResult.chronotype] ?? "Your unique sleep chronotype has been identified."}
            </p>

            <div className="w-full grid grid-cols-3 gap-[10px] mb-[20px] max-w-[380px]">
              {[
                { label: "Lark", score: chronotypeResult.lark_score, color: "#f4b54d" },
                { label: "Eagle", score: chronotypeResult.eagle_score, color: "#354a82" },
                { label: "Owl", score: chronotypeResult.owl_score, color: "#7B68AE" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center p-[10px] rounded-xl" style={{ background: "rgba(53,49,155,0.04)" }}>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                    {item.label}
                  </span>
                  <span className="text-[22px] font-bold" style={{ color: item.color, fontFamily: "Poppins, sans-serif" }}>
                    {item.score}
                  </span>
                </div>
              ))}
            </div>

            <p className="m-0 text-[13px] leading-[1.5] text-[#888] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "12px" }}>
              Confidence: {chronotypeResult.confidence_score}% | Total Score: {chronotypeResult.total_score}
            </p>

            {submissionMeta?.orgName && (
              <p className="m-0 text-[12px] font-medium text-center px-[14px] py-[6px] rounded-full mb-[16px]" style={{ background: "rgba(53,49,155,0.06)", color: "#35319B", fontFamily: "Poppins, sans-serif" }}>
                Registered under {submissionMeta.orgName}
              </p>
            )}
            {submissionMeta?.sourceType === "REFERRAL" && !submissionMeta?.orgName && (
              <p className="m-0 text-[12px] font-medium text-center px-[14px] py-[6px] rounded-full mb-[16px]" style={{ background: "rgba(245,154,0,0.08)", color: "#F59A00", fontFamily: "Poppins, sans-serif" }}>
                You were referred by a friend
              </p>
            )}

            <div className="flex flex-col gap-[10px] w-full max-w-[320px]">
              <button
                type="button"
                onClick={resetAndClose}
                className="bg-[#3B35A3] hover:bg-[#2D2890] text-white text-[15px] font-semibold px-[44px] py-[12px] border-none cursor-pointer transition-colors w-full"
                style={{ borderRadius: "8px", fontFamily: "Poppins, sans-serif" }}
              >
                Close
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
              <Field label="Occupation *" value={form.occupation} onChange={(v) => updateForm("occupation", v)} error={errors.occupation} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <Field label="Email *" value={form.email} onChange={(v) => updateForm("email", v)} error={errors.email} type="email" />
              <Field label="Phone *" value={form.phone} onChange={(v) => updateForm("phone", v)} error={errors.phone} type="tel" />
            </div>
            <div className="mb-[14px]">
              <Field label="State (Optional)" value={form.location} onChange={(v) => updateForm("location", v)} />
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
                I agree to the terms and conditions and privacy policy *
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
