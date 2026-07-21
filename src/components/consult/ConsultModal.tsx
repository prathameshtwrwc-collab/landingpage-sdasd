"use client";

import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useConsult } from "./ConsultContext";

interface ConsultForm {
  fname: string;
  lname: string;
  age: string;
  gender: string;
  maritalStatus: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  email: string;
  phone: string;
  scheduleDate: string;
  scheduleTime: string;
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function timeStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const initialForm: ConsultForm = {
  fname: "",
  lname: "",
  age: "",
  gender: "",
  maritalStatus: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  email: "",
  phone: "",
  scheduleDate: todayStr(),
  scheduleTime: timeStr(),
};

function CheckCircle() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" stroke="#35319B" strokeWidth="3" />
      <path d="M20 32 l8 8 l16 -16" stroke="#35319B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ConsultModal() {
  const { isOpen, close } = useConsult();
  const [form, setForm] = useState<ConsultForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");
  const captchaRef = useRef<ReCAPTCHA>(null);

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

  const update = (field: keyof ConsultForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fname.trim()) e.fname = "Required";
    if (!form.lname.trim()) e.lname = "Required";
    if (!form.age) e.age = "Required";
    if (!form.gender) e.gender = "Required";
    if (!form.maritalStatus) e.maritalStatus = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.pincode.trim()) e.pincode = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.scheduleDate) e.scheduleDate = "Required";
    if (!form.scheduleTime) e.scheduleTime = "Required";
    setErrors(e);
    if (!captchaToken) setCaptchaError("Please complete the reCAPTCHA verification.");
    else setCaptchaError("");
    return Object.keys(e).length === 0 && !!captchaToken;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
    setCaptchaToken(null);
    setCaptchaError("");
    captchaRef.current?.reset();
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
          maxWidth: "580px",
          borderRadius: "16px",
          fontFamily: "Poppins, sans-serif",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        {/* Gradient accent bar */}
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
              Consultation Scheduled
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[#555] text-center max-w-[400px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "28px" }}>
              Your consultation request has been submitted successfully. We will contact you shortly.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="bg-[#3B35A3] hover:bg-[#2D2890] text-white text-[15px] font-semibold px-[44px] py-[12px] border-none cursor-pointer transition-colors"
              style={{ borderRadius: "8px", fontFamily: "Poppins, sans-serif" }}
            >
              Done
            </button>
          </div>
        ) : (
          /* ----- FORM ----- */
          <form onSubmit={handleSubmit} className="px-[20px] py-[32px] md:px-[36px]">
            {/* Header */}
            <div className="text-center mb-[28px]">
              <div
                className="inline-flex items-center justify-center w-[52px] h-[52px] rounded-full mb-[14px]"
                style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                </svg>
              </div>
              <h3 className="m-0 text-[21px] font-semibold text-[#35319B]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginBottom: "4px" }}>
                Consult a Sleep Specialist
              </h3>
              <p className="m-0 text-[13px] leading-[1.4] text-[#888]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                Fill in your details to schedule a consultation
              </p>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <FormField label="First Name *" value={form.fname} onChange={(v) => update("fname", v)} error={errors.fname} />
              <FormField label="Last Name *" value={form.lname} onChange={(v) => update("lname", v)} error={errors.lname} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <AgeSelect label="Age *" value={form.age} onChange={(v) => update("age", v)} error={errors.age} />
              <SelectField label="Gender *" value={form.gender} onChange={(v) => update("gender", v)} error={errors.gender} options={["Male", "Female", "Other"]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <SelectField label="Marital Status *" value={form.maritalStatus} onChange={(v) => update("maritalStatus", v)} error={errors.maritalStatus} options={["Single", "Married", "Divorced", "Widowed"]} />
              <FormField label="Country *" value={form.country} onChange={(v) => update("country", v)} error={errors.country} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <FormField label="State *" value={form.state} onChange={(v) => update("state", v)} error={errors.state} />
              <FormField label="City *" value={form.city} onChange={(v) => update("city", v)} error={errors.city} />
            </div>
            <div className="mb-[14px]">
              <FormField label="Pincode *" value={form.pincode} onChange={(v) => update("pincode", v)} error={errors.pincode} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <FormField label="Email *" value={form.email} onChange={(v) => update("email", v)} error={errors.email} type="email" />
              <FormField label="Phone *" value={form.phone} onChange={(v) => update("phone", v)} error={errors.phone} type="tel" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <DateField label="Schedule Date *" value={form.scheduleDate} onChange={(v) => update("scheduleDate", v)} error={errors.scheduleDate} />
              <TimeField label="Schedule Time *" value={form.scheduleTime} onChange={(v) => update("scheduleTime", v)} error={errors.scheduleTime} />
            </div>

            {/* reCAPTCHA */}
            <div className="mb-[18px] flex justify-center">
              <ReCAPTCHA
                ref={captchaRef}
                sitekey="6LcO6FQtAAAAALeLgzM120ljuL3Mc5uefKWWxfET"
                onChange={(token) => { setCaptchaToken(token); setCaptchaError(""); }}
                onExpired={() => { setCaptchaToken(null); setCaptchaError("reCAPTCHA expired. Please verify again."); }}
              />
            </div>
            {captchaError && <p className="m-0 text-[12px] text-red-500 mb-[16px] text-center" style={{ fontFamily: "Poppins, sans-serif" }}>{captchaError}</p>}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#3B35A3] hover:bg-[#2D2890] text-white text-[15px] font-semibold py-[14px] border-none cursor-pointer transition-colors"
              style={{ borderRadius: "10px", fontFamily: "Poppins, sans-serif", letterSpacing: "0.01em" }}
            >
              Submit
            </button>
          </form>
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

function FormField({
  label, value, onChange, error, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string; type?: string;
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
  label, value, onChange, error,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
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
  label, value, onChange, error, options,
}: {
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

function DateField({
  label, value, onChange, error,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#444] mb-[5px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <input
        type="date"
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

function TimeField({
  label, value, onChange, error,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#444] mb-[5px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <input
        type="time"
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
