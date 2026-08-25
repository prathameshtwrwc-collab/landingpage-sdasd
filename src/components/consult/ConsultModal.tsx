"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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

const MAX_BOOKING_DAYS = 90;

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function maxBookingStr() {
  const d = new Date();
  d.setDate(d.getDate() + MAX_BOOKING_DAYS);
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
  const { isOpen, close, prefill } = useConsult();
  const t = useTranslations("consult");
  const [form, setForm] = useState<ConsultForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Robust background scroll-lock for all browsers incl. iPad/iOS touch.
      // `overflow: hidden` alone does not stop touch scrolling on mobile;
      // `position: fixed` on body is required to truly lock the page. The
      // modal overlay is the single scroll container.
      const scrollY = window.scrollY;
      const prevOverflow = document.body.style.overflow;
      const prevPosition = document.body.style.position;
      const prevTop = document.body.style.top;
      const prevLeft = document.body.style.left;
      const prevRight = document.body.style.right;
      const prevWidth = document.body.style.width;
      const prevHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";

      if (prefill) setForm((prev) => ({ ...prev, ...prefill }));
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.position = prevPosition;
        document.body.style.top = prevTop;
        document.body.style.left = prevLeft;
        document.body.style.right = prevRight;
        document.body.style.width = prevWidth;
        document.documentElement.style.overflow = prevHtmlOverflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (field: keyof ConsultForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const req = t("required");
    if (!form.fname.trim()) e.fname = req;
    if (!form.lname.trim()) e.lname = req;
    if (!form.age) e.age = req;
    if (!form.gender) e.gender = req;
    if (!form.maritalStatus) e.maritalStatus = req;
    if (!form.country.trim()) e.country = req;
    if (!form.city.trim()) e.city = req;
    if (!form.state.trim()) e.state = req;
    if (!form.pincode.trim()) e.pincode = req;
    if (!form.email.trim()) e.email = req;
    if (!form.phone.trim()) e.phone = req;
    if (!form.scheduleDate) e.scheduleDate = req;
    if (!form.scheduleTime) e.scheduleTime = req;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/consultation-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setErrors({ submit: t("submitError") });
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
    close();
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[9999] flex justify-center overflow-y-auto consult-overlay"
      style={{ background: "rgba(15, 13, 45, 0.65)", padding: "40px 16px", WebkitOverflowScrolling: "touch", overflowX: "hidden", alignItems: "safe center" }}
      onClick={(e) => { if (e.target === e.currentTarget) resetAndClose(); }}
    >
      <div
        className="relative w-full bg-white shadow-2xl overflow-hidden consult-container"
        style={{
          maxWidth: "580px",
          borderRadius: "16px",
          fontFamily: "Poppins, sans-serif",
          margin: "0 auto",
        }}
      >
        {/* Gradient accent bar */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #35319B, #F59A00)", width: "100%" }} />

        {/* Close button */}
        <button
          type="button"
          onClick={resetAndClose}
          aria-label={t("closeAria")}
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
              {t("successTitle")}
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[#555] text-center max-w-[400px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "28px" }}>
              {t("successBody")}
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="bg-[#3B35A3] hover:bg-[#2D2890] text-white text-[15px] font-semibold px-[44px] py-[12px] border-none cursor-pointer transition-colors"
              style={{ borderRadius: "8px", fontFamily: "Poppins, sans-serif" }}
            >
              {t("done")}
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
                {t("title")}
              </h3>
              <p className="m-0 text-[13px] leading-[1.4] text-[#888]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                {t("subtitle")}
              </p>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <FormField label={t("fname")} value={form.fname} onChange={(v) => update("fname", v)} error={errors.fname} />
              <FormField label={t("lname")} value={form.lname} onChange={(v) => update("lname", v)} error={errors.lname} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <AgeSelect label={t("age")} value={form.age} onChange={(v) => update("age", v)} error={errors.age} />
              <SelectField label={t("gender")} value={form.gender} onChange={(v) => update("gender", v)} error={errors.gender} options={[
                { value: "Male", label: t("genderMale") },
                { value: "Female", label: t("genderFemale") },
                { value: "Other", label: t("genderOther") },
              ]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <SelectField label={t("maritalStatus")} value={form.maritalStatus} onChange={(v) => update("maritalStatus", v)} error={errors.maritalStatus} options={[
                { value: "Single", label: t("msSingle") },
                { value: "Married", label: t("msMarried") },
                { value: "Divorced", label: t("msDivorced") },
                { value: "Widowed", label: t("msWidowed") },
              ]} />
              <FormField label={t("country")} value={form.country} onChange={(v) => update("country", v)} error={errors.country} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <FormField label={t("state")} value={form.state} onChange={(v) => update("state", v)} error={errors.state} />
              <FormField label={t("city")} value={form.city} onChange={(v) => update("city", v)} error={errors.city} />
            </div>
            <div className="mb-[14px]">
              <FormField label={t("pincode")} value={form.pincode} onChange={(v) => update("pincode", v)} error={errors.pincode} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <FormField label={t("email")} value={form.email} onChange={(v) => update("email", v)} error={errors.email} type="email" />
              <FormField label={t("phone")} value={form.phone} onChange={(v) => update("phone", v)} error={errors.phone} type="tel" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mb-[14px]">
              <DateField label={t("scheduleDate")} value={form.scheduleDate} onChange={(v) => update("scheduleDate", v)} error={errors.scheduleDate} />
              <TimeField label={t("scheduleTime")} value={form.scheduleTime} onChange={(v) => update("scheduleTime", v)} error={errors.scheduleTime} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#3B35A3] hover:bg-[#2D2890] text-white text-[15px] font-semibold py-[14px] border-none cursor-pointer transition-colors"
              style={{ borderRadius: "10px", fontFamily: "Poppins, sans-serif", letterSpacing: "0.01em" }}
            >
              {t("submit")}
            </button>
          </form>
        )}

        <style
          dangerouslySetInnerHTML={{
            __html: `
              input, select { font-family: Poppins, sans-serif; }
              input:focus, select:focus { outline: 2px solid #3B35A3; outline-offset: -1px; border-color: transparent !important; border-radius: 6px; }
              .consult-overlay { overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
              .consult-container { box-sizing: border-box; }
              @media (max-width: 1024px) {
                .consult-overlay { padding: 0 !important; }
                .consult-container { border-radius: 0 !important; max-width: 100% !important; width: 100% !important; min-height: 100dvh !important; }
              }
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
  const t = useTranslations("consult");
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
  const t = useTranslations("consult");
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
        <option value="">{t("selectAgeRange")}</option>
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
  label: string; value: string; onChange: (v: string) => void; error?: string; options: string[] | { value: string; label: string }[];
}) {
  const t = useTranslations("consult");
  const hasValueLabel = typeof options[0] === "object";
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
        <option value="">{t("selectPlaceholder")}</option>
        {hasValueLabel
          ? (options as { value: string; label: string }[]).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))
          : (options as string[]).map((opt) => (
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
  const t = useTranslations("consult");
  const min = todayStr();
  const max = maxBookingStr();
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#444] mb-[5px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
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
  const t = useTranslations("consult");
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
