"use client";

import React, { useState } from "react";
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

export default function AssessmentModal() {
  const { isOpen, close } = useAssessment();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.55)", padding: "40px 16px" }}
      onClick={(e) => { if (e.target === e.currentTarget) resetAndClose(); }}
    >
      <div
        className="relative w-full bg-white shadow-xl"
        style={{ maxWidth: "580px", borderRadius: 0, fontFamily: "Poppins, sans-serif" }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close"
          className="absolute top-[12px] right-[14px] w-[32px] h-[32px] flex items-center justify-center bg-transparent border-none cursor-pointer z-10"
          style={{ borderRadius: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitted ? (
          <div className="px-[28px] py-[48px] text-center">
            <h3 className="m-0 text-[22px] font-semibold text-[#35319B]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginBottom: "12px" }}>
              Assessment Complete
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "24px" }}>
              Thank you for completing the assessment. Your responses have been recorded.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="bg-[#3B35A3] text-white text-[15px] font-semibold px-[40px] py-[12px] border-none cursor-pointer"
              style={{ borderRadius: 0, fontFamily: "Poppins, sans-serif" }}
            >
              Close
            </button>
          </div>
        ) : isFormStep ? (
          /* Registration form */
          <div className="px-[24px] py-[36px] md:px-[32px]">
            <h3 className="m-0 text-[20px] font-semibold text-[#35319B] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginBottom: "6px" }}>
              Sleep Chronotype Assessment
            </h3>
            <p className="m-0 text-[13px] leading-[1.4] text-[#666] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "24px" }}>
              Fill in your details to begin the assessment
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <Field label="First Name *" value={form.fname} onChange={(v) => updateForm("fname", v)} error={errors.fname} />
              <Field label="Last Name *" value={form.lname} onChange={(v) => updateForm("lname", v)} error={errors.lname} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <AgeSelect label="Age *" value={form.age} onChange={(v) => updateForm("age", v)} error={errors.age} />
              <SelectField label="Gender *" value={form.gender} onChange={(v) => updateForm("gender", v)} error={errors.gender} options={["Male", "Female", "Other"]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <SelectField label="Marital Status *" value={form.maritalStatus} onChange={(v) => updateForm("maritalStatus", v)} error={errors.maritalStatus} options={["Single", "Married", "Divorced", "Widowed"]} />
              <Field label="Department (Optional)" value={form.department} onChange={(v) => updateForm("department", v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <Field label="Country *" value={form.country} onChange={(v) => updateForm("country", v)} error={errors.country} />
              <Field label="City *" value={form.city} onChange={(v) => updateForm("city", v)} error={errors.city} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <Field label="Pincode *" value={form.pincode} onChange={(v) => updateForm("pincode", v)} error={errors.pincode} />
              <Field label="Occupation *" value={form.occupation} onChange={(v) => updateForm("occupation", v)} error={errors.occupation} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <Field label="Email *" value={form.email} onChange={(v) => updateForm("email", v)} error={errors.email} type="email" />
              <Field label="Phone *" value={form.phone} onChange={(v) => updateForm("phone", v)} error={errors.phone} type="tel" />
            </div>
            <div className="mb-[12px]">
              <Field label="State (Optional)" value={form.state} onChange={(v) => updateForm("state", v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <Field label="Organization Code (Optional)" value={form.orgCode} onChange={(v) => updateForm("orgCode", v)} />
              <Field label="Referral Code (Optional)" value={form.referralCode} onChange={(v) => updateForm("referralCode", v)} />
            </div>

            <label className="flex items-start gap-[10px] mt-[16px] mb-[16px] cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={(e) => updateForm("agreed", e.target.checked)}
                className="mt-[3px] shrink-0 w-[16px] h-[16px]"
              />
              <span className="text-[13px] leading-[1.45] text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                I agree to the terms and conditions and privacy policy *
              </span>
            </label>
            {errors.agreed && <p className="m-0 text-[12px] text-red-500 mb-[12px]" style={{ fontFamily: "Poppins, sans-serif" }}>Please agree to continue</p>}

            <button
              type="button"
              onClick={submitForm}
              className="w-full bg-[#3B35A3] text-white text-[15px] font-semibold py-[14px] border-none cursor-pointer hover:bg-[#332D92] transition-colors"
              style={{ borderRadius: 0, fontFamily: "Poppins, sans-serif" }}
            >
              Take Test
            </button>
          </div>
        ) : (
          /* Question step */
          <div className="px-[24px] py-[36px] md:px-[32px]">
            <div className="flex items-center justify-between mb-[20px]">
              <span className="text-[13px] text-[#888]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                Question {questionIndex + 1} of {totalQuestions}
              </span>
              <div className="flex gap-[4px]">
                {Array.from({ length: totalQuestions }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-[20px] h-[4px]"
                    style={{ background: answers[idx] ? "#F59A00" : "#E0E0E0", borderRadius: 0 }}
                  />
                ))}
              </div>
            </div>

            <p className="m-0 text-[16px] leading-[1.5] font-semibold text-[#171717] mb-[24px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              {questions[questionIndex].q}
            </p>

            <div className="flex flex-col gap-[10px]">
              {questions[questionIndex].options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => answerQuestion(opt)}
                  className="w-full text-left px-[16px] py-[14px] border text-[14px] leading-[1.4] cursor-pointer transition-colors hover:bg-[#F5F4FF]"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    borderRadius: 0,
                    border: "1.5px solid #D0D0D0",
                    background: "#fff",
                    color: "#171717",
                  }}
                >
                  <span className="font-semibold mr-[8px] text-[#35319B]">{String.fromCharCode(97 + optIdx)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-[28px]">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-[14px] font-medium text-[#666] bg-none border-none cursor-pointer hover:text-[#35319B]"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
              >
                &larr; Back
              </button>
              {questionIndex > 0 && answers[questionIndex - 1] && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-[14px] font-medium text-[#35319B] bg-none border-none cursor-pointer"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
                >
                  Previous Question
                </button>
              )}
            </div>
          </div>
        )}

        <style
          dangerouslySetInnerHTML={{
            __html: `
              input, select { font-family: Poppins, sans-serif; }
              input:focus, select:focus { outline: 2px solid #3B35A3; outline-offset: -1px; }
            `,
          }}
        />
      </div>
    </div>
  );
}

/* Reusable field components */
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
      <label className="block text-[13px] font-medium text-[#444] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-[12px] py-[10px] text-[14px] bg-white"
        style={{ borderRadius: 0, border: "1.5px solid #D0D0D0", fontFamily: "Poppins, sans-serif" }}
      />
      {error && <p className="m-0 text-[12px] text-red-500 mt-[2px]" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>}
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
      <label className="block text-[13px] font-medium text-[#444] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-[12px] py-[10px] text-[14px] bg-white"
        style={{ borderRadius: 0, border: "1.5px solid #D0D0D0", fontFamily: "Poppins, sans-serif" }}
      >
        <option value="">Select Age Range</option>
        {ageRanges.map((range) => (
          <option key={range} value={range}>{range}</option>
        ))}
      </select>
      {error && <p className="m-0 text-[12px] text-red-500 mt-[2px]" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>}
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
      <label className="block text-[13px] font-medium text-[#444] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-[12px] py-[10px] text-[14px] bg-white"
        style={{ borderRadius: 0, border: "1.5px solid #D0D0D0", fontFamily: "Poppins, sans-serif" }}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="m-0 text-[12px] text-red-500 mt-[2px]" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>}
    </div>
  );
}