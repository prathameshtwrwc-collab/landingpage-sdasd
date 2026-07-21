"use client";

import React, { useState, useEffect } from "react";
import { useAssessment } from "./AssessmentContext";

const questions = [
  {
    q: "What time do you usually wake up on a free day (no alarm, no obligations)?",
    options: [
      "Before 6:30 AM",
      "Between 6:30\u20138:00 AM",
      "After 8:00 AM",
    ],
  },
  {
    q: "When do you usually go to bed on a free day (no need to wake early)?",
    options: [
      "Before 10:00 PM",
      "Between 10:00\u201311:30 PM",
      "After 11:30 PM or 9:00 AM",
    ],
  },
  {
    q: "When do you feel most alert and productive?",
    options: [
      "Early morning (6:00 AM\u20139:00 AM)",
      "Midday to late afternoon (10:00 AM\u20135:00 PM)",
      "Evening/night (6:00 PM\u201312:00 AM)",
    ],
  },
  {
    q: "If you could design your ideal work schedule, when would you start your day?",
    options: [
      "Before 8:00 AM",
      "Between 8:00\u201310:00 AM",
      "After 10:00 AM or after 12:00 noon",
    ],
  },
  {
    q: "How easy is it for you to wake up in the morning without an alarm?",
    options: [
      "Very easy \u2014 I wake up on my own",
      "Somewhat easy \u2014 I need a little push",
      "Very difficult \u2014 I hit snooze several times",
    ],
  },
  {
    q: "What time of day do you feel the most mentally clear and focused?",
    options: [
      "Early morning (before 8:00 AM)",
      "Midday (10:00 AM\u20132:00 PM)",
      "Late afternoon to night (after 2:00 PM)",
    ],
  },
  {
    q: "What time of day do you prefer to exercise, if given the choice?",
    options: [
      "Early morning (before 8:00 AM)",
      "Midday to early evening (10:00 AM\u20136:00 PM)",
      "Evening (after 6:00 PM)",
    ],
  },
  {
    q: "How do you typically feel in the first hour after waking?",
    options: [
      "Alert and ready to go",
      "Slightly groggy but okay",
      "Very sluggish or foggy",
    ],
  },
  {
    q: "How do you feel during evening social events, such as dinners or parties?",
    options: [
      "Tired or withdrawn",
      "Neutral or slightly energized",
      "Most alive and sociable",
    ],
  },
  {
    q: "When do you naturally feel sleepy, not forced by your schedule?",
    options: [
      "Before 9:30 PM",
      "Between 9:30\u201311:00 PM",
      "After 11:00 PM",
    ],
  },
  {
    q: "Which best describes your current work or study schedule?",
    options: [
      "Mostly morning \u2014 starts before 8:00 AM",
      "Flexible or regular daytime \u2014 starts between 8:00 AM and 10:00 AM",
      "Mostly evening/night shift or irregular schedule",
    ],
  },
];

interface FormData {
  fname: string;
  lname: string;
  age: string;
  gender: string;
  maritalStatus: string;
  department: string;
  country: string;
  state: string;
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
  fname: "",
  lname: "",
  age: "",
  gender: "",
  maritalStatus: "",
  department: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  occupation: "",
  email: "",
  phone: "",
  orgCode: "",
  referralCode: "",
  agreed: false,
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
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const submitForm = () => {
    if (!validateForm()) return;
    setStep(1);
    setAnswers([]);
  };

  const answerQuestion = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
    if (questionIndex < totalQuestions - 1) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };

  const resetAndClose = () => {
    setStep(0);
    setForm(initialForm);
    setAnswers([]);
    setSubmitted(false);
    setErrors({});
    close();
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
        {/* Purple accent bar */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #35319B, #F59A00)", width: "100%" }} />

        {/* Close button */}
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

        {submitted ? (
          /* ----- COMPLETION ----- */
          <div className="flex flex-col items-center px-[24px] py-[48px] md:px-[40px]">
            <div style={{ marginBottom: "20px" }}>
              <CheckCircle />
            </div>
            <h3 className="m-0 text-[22px] font-semibold text-[#35319B] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginBottom: "8px" }}>
              Assessment Complete
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[#555] text-center max-w-[400px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "28px" }}>
              Thank you for completing the assessment. Your responses have been recorded successfully.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="bg-[#3B35A3] hover:bg-[#2D2890] text-white text-[15px] font-semibold px-[44px] py-[12px] border-none cursor-pointer transition-colors"
              style={{ borderRadius: "8px", fontFamily: "Poppins, sans-serif" }}
            >
              Close
            </button>
          </div>
        ) : isFormStep ? (
          /* ----- REGISTRATION FORM ----- */
          <div className="px-[20px] py-[32px] md:px-[36px]">
            {/* Header */}
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

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <Field label="First Name *" value={form.fname} onChange={(v) => updateForm("fname", v)} error={errors.fname} />
              <Field label="Last Name *" value={form.lname} onChange={(v) => updateForm("lname", v)} error={errors.lname} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <AgeSelect label="Age *" value={form.age} onChange={(v) => updateForm("age", v)} error={errors.age} />
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
              <Field label="State (Optional)" value={form.state} onChange={(v) => updateForm("state", v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <Field label="Organization Code (Optional)" value={form.orgCode} onChange={(v) => updateForm("orgCode", v)} />
              <Field label="Referral Code (Optional)" value={form.referralCode} onChange={(v) => updateForm("referralCode", v)} />
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
              className="w-full bg-[#3B35A3] hover:bg-[#2D2890] text-white text-[15px] font-semibold py-[14px] border-none cursor-pointer transition-colors"
              style={{ borderRadius: "10px", fontFamily: "Poppins, sans-serif", letterSpacing: "0.01em" }}
            >
              Start Assessment
            </button>
          </div>
        ) : (
          /* ----- QUESTIONS ----- */
          <div className="px-[20px] py-[28px] md:px-[36px] md:py-[32px]">
            {/* Progress bar */}
            <div className="mb-[24px]">
              <div className="flex items-center justify-between mb-[8px]">
                <span className="text-[13px] font-medium text-[#888]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                  Question {questionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-[13px] font-semibold text-[#35319B]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  {Math.round(((questionIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full h-[6px] bg-gray-100" style={{ borderRadius: "3px" }}>
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
                    background: "linear-gradient(90deg, #35319B, #F59A00)",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-[5px] mb-[24px] flex-wrap">
              {Array.from({ length: totalQuestions }).map((_, idx) => {
                const isAnswered = !!answers[idx];
                const isCurrent = idx === questionIndex;
                return (
                  <div
                    key={idx}
                    className="transition-all duration-200"
                    style={{
                      width: isCurrent ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      background: isAnswered ? "#35319B" : isCurrent ? "#35319B" : "#E0E0E0",
                      opacity: isCurrent ? 1 : answers[idx] ? 1 : 0.5,
                    }}
                  />
                );
              })}
            </div>

            {/* Question */}
            <p className="m-0 text-[17px] leading-[1.55] font-semibold text-[#171717] mb-[22px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              {questions[questionIndex].q}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-[10px]">
              {questions[questionIndex].options.map((opt, optIdx) => {
                const isSelected = answers[questionIndex] === opt;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => answerQuestion(opt)}
                    className="w-full text-left px-[18px] py-[14px] text-[14px] leading-[1.45] cursor-pointer transition-all duration-150 group"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      borderRadius: "10px",
                      border: isSelected ? "2px solid #35319B" : "1.5px solid #D5D5D5",
                      background: isSelected ? "#F5F4FF" : "#FFFFFF",
                      color: "#171717",
                      boxShadow: isSelected ? "0 2px 8px rgba(53, 49, 155, 0.12)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "#35319B";
                        e.currentTarget.style.background = "#FAFAFF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "#D5D5D5";
                        e.currentTarget.style.background = "#FFFFFF";
                      }
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center font-semibold mr-[10px] shrink-0"
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: isSelected ? "#35319B" : "#F0F0F0",
                        color: isSelected ? "#FFFFFF" : "#888",
                        fontSize: "13px",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {String.fromCharCode(97 + optIdx)}
                    </span>
                    <span className="align-middle">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Back */}
            <div className="flex justify-start mt-[24px]">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-[14px] font-medium text-[#888] bg-none border-none cursor-pointer hover:text-[#35319B] transition-colors"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, padding: "4px 0" }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </span>
              </button>
            </div>
          </div>
        )}

        <style
          dangerouslySetInnerHTML={{
            __html: `
              input, select { font-family: Poppins, sans-serif; }
              input:focus, select:focus { outline: 2px solid #3B35A3; outline-offset: -1px; border-color: transparent !important; border-radius: 6px; }
            `,
          }}
        />
      </div>
    </div>
  );
}

/* ----- FIELD COMPONENTS ----- */

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#444] mb-[5px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-[13px] py-[10px] text-[14px] bg-white transition-shadow"
        style={{
          borderRadius: "8px",
          border: "1.5px solid #D5D5D5",
          fontFamily: "Poppins, sans-serif",
        }}
      />
      {error && <p className="m-0 text-[12px] text-red-500 mt-[3px]" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>}
    </div>
  );
}

const ageRanges = [
  "5 - 7",
  "7 - 15",
  "15 - 18",
  "18 - 25",
  "25 - 35",
  "35 - 45",
  "45 - 55",
  "55 - 65",
  "65+",
];

function AgeSelect({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
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
        <option value="">Select Age Range</option>
        {ageRanges.map((range) => (
          <option key={range} value={range}>{range}</option>
        ))}
      </select>
      {error && <p className="m-0 text-[12px] text-red-500 mt-[3px]" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  error,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  options: string[];
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
