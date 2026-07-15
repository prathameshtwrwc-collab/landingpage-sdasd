"use client";

import React, { useState } from "react";
import { useConsult } from "./ConsultContext";

interface ConsultForm {
  fname: string;
  lname: string;
  age: string;
  gender: string;
  maritalStatus: string;
  country: string;
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
  city: "",
  pincode: "",
  email: "",
  phone: "",
  scheduleDate: todayStr(),
  scheduleTime: timeStr(),
};

export default function ConsultModal() {
  const { isOpen, close } = useConsult();
  const [form, setForm] = useState<ConsultForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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
    if (!form.pincode.trim()) e.pincode = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.scheduleDate) e.scheduleDate = "Required";
    if (!form.scheduleTime) e.scheduleTime = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
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
        style={{ maxWidth: "520px", borderRadius: 0, fontFamily: "Poppins, sans-serif" }}
      >
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
          <div className="flex flex-col items-center justify-center px-[28px] py-[60px] text-center">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="mb-[20px]">
              <circle cx="36" cy="36" r="32" fill="#22C55E" opacity="0.12" />
              <circle cx="36" cy="36" r="24" fill="#22C55E" opacity="0.2" />
              <path
                d="M28 36 L34 42 L44 30"
                stroke="#22C55E"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="m-0 text-[22px] font-semibold text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginBottom: "8px" }}>
              Consultation Scheduled
            </h3>
            <p className="m-0 text-[14px] leading-[1.6] text-[#666]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "28px" }}>
              Your consultation request has been submitted successfully. We will contact you shortly.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="bg-[#3B35A3] text-white text-[15px] font-semibold px-[40px] py-[12px] border-none cursor-pointer hover:bg-[#332D92] transition-colors"
              style={{ borderRadius: 0, fontFamily: "Poppins, sans-serif" }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-[24px] py-[36px] md:px-[32px]">
            <h3 className="m-0 text-[20px] font-semibold text-[#35319B] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginBottom: "6px" }}>
              Consult a Sleep Specialist
            </h3>
            <p className="m-0 text-[13px] leading-[1.4] text-[#666] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "24px" }}>
              Fill in your details to schedule a consultation
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <FormField label="First Name *" value={form.fname} onChange={(v) => update("fname", v)} error={errors.fname} />
              <FormField label="Last Name *" value={form.lname} onChange={(v) => update("lname", v)} error={errors.lname} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <AgeSelect label="Age *" value={form.age} onChange={(v) => update("age", v)} error={errors.age} />
              <SelectField label="Gender *" value={form.gender} onChange={(v) => update("gender", v)} error={errors.gender} options={["Male", "Female", "Other"]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <SelectField label="Marital Status *" value={form.maritalStatus} onChange={(v) => update("maritalStatus", v)} error={errors.maritalStatus} options={["Single", "Married", "Divorced", "Widowed"]} />
              <FormField label="Country *" value={form.country} onChange={(v) => update("country", v)} error={errors.country} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <FormField label="City *" value={form.city} onChange={(v) => update("city", v)} error={errors.city} />
              <FormField label="Pincode *" value={form.pincode} onChange={(v) => update("pincode", v)} error={errors.pincode} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <FormField label="Email *" value={form.email} onChange={(v) => update("email", v)} error={errors.email} type="email" />
              <FormField label="Phone *" value={form.phone} onChange={(v) => update("phone", v)} error={errors.phone} type="tel" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[20px]">
              <DateField label="Schedule Date *" value={form.scheduleDate} onChange={(v) => update("scheduleDate", v)} error={errors.scheduleDate} />
              <TimeField label="Schedule Time *" value={form.scheduleTime} onChange={(v) => update("scheduleTime", v)} error={errors.scheduleTime} />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3B35A3] text-white text-[15px] font-semibold py-[14px] border-none cursor-pointer hover:bg-[#332D92] transition-colors"
              style={{ borderRadius: 0, fontFamily: "Poppins, sans-serif" }}
            >
              Submit
            </button>
          </form>
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

/* --- Reusable field components --- */

function FormField({
  label, value, onChange, error, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string; type?: string;
}) {
  return (
    <div className="mb-[12px]">
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
  label, value, onChange, error,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
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
  label, value, onChange, error, options,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string; options: string[];
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

function DateField({
  label, value, onChange, error,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#444] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-[12px] py-[10px] text-[14px] bg-white"
        style={{ borderRadius: 0, border: "1.5px solid #D0D0D0", fontFamily: "Poppins, sans-serif" }}
      />
      {error && <p className="m-0 text-[12px] text-red-500 mt-[2px]" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>}
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
      <label className="block text-[13px] font-medium text-[#444] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-[12px] py-[10px] text-[14px] bg-white"
        style={{ borderRadius: 0, border: "1.5px solid #D0D0D0", fontFamily: "Poppins, sans-serif" }}
      />
      {error && <p className="m-0 text-[12px] text-red-500 mt-[2px]" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>}
    </div>
  );
}