"use client";

import { useEffect, useState } from "react";
import { X, Stethoscope } from "lucide-react";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";

export interface ConsultLead {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone?: string;
  consulted_by?: string | null;
  consult_notes?: string | null;
}

interface ConsultPatientModalProps {
  lead: ConsultLead | null;
  consultedByDefault?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function ConsultPatientModal({ lead, consultedByDefault = "", onClose, onSaved }: ConsultPatientModalProps) {
  const [consultedBy, setConsultedBy] = useState("");
  const [consultNotes, setConsultNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useLockBodyScroll(!!lead);

  useEffect(() => {
    if (lead) {
      setConsultedBy(lead.consulted_by || consultedByDefault);
      setConsultNotes(lead.consult_notes || "");
      setError("");
    }
  }, [lead, consultedByDefault]);

  if (!lead) return null;

  const save = async () => {
    if (!consultedBy.trim()) {
      setError("Consulted by is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/consultation-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, consultedBy: consultedBy.trim(), consultNotes: consultNotes.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      onSaved();
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-[16px]"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)", fontFamily: "Poppins, sans-serif" }}
      onClick={() => { if (!saving) onClose(); }}
    >
      <div
        data-lenis-prevent
        className="w-full max-w-[440px] rounded-[16px] overflow-hidden"
        style={{ background: "#FFFFFF", boxShadow: "0 16px 40px rgba(0,0,0,0.18)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-[20px] py-[16px]" style={{ borderBottom: "1px solid #F1F4FA", background: "#F8F9FF" }}>
          <div className="flex items-center gap-[12px] min-w-0">
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}>
              <Stethoscope size={18} color="#FFFFFF" />
            </div>
            <div className="min-w-0">
              <h3 className="m-0 text-[15px] font-bold leading-[1.2] truncate" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                Consult This Patient
              </h3>
              <p className="m-0 text-[11px] truncate" style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}>
                {lead.fname} {lead.lname} · {lead.email}
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={saving} className="bg-transparent border-none cursor-pointer p-[4px] shrink-0" style={{ color: "#98A2B3" }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="px-[20px] py-[16px] flex flex-col gap-[14px]" style={{ minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}>
          <div>
            <label className="block text-[12px] font-semibold mb-[5px]" style={{ color: "#444", fontFamily: "Poppins, sans-serif" }}>
              Consulted by *
            </label>
            <input
              type="text"
              value={consultedBy}
              onChange={(e) => { setConsultedBy(e.target.value); setError(""); }}
              placeholder="Specialist name"
              className="w-full px-[13px] py-[10px] text-[13px] rounded-lg outline-none"
              style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-[5px]" style={{ color: "#444", fontFamily: "Poppins, sans-serif" }}>
              Consult Notes
            </label>
            <textarea
              value={consultNotes}
              onChange={(e) => setConsultNotes(e.target.value)}
              placeholder="Notes from the consultation..."
              rows={5}
              className="w-full px-[13px] py-[10px] text-[13px] rounded-lg outline-none resize-none"
              style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}
            />
          </div>
          {error && <p className="m-0 text-[12px]" style={{ color: "#D32F2F", fontFamily: "Poppins, sans-serif" }}>{error}</p>}
        </div>

        <div className="px-[20px] py-[14px]" style={{ borderTop: "1px solid #F1F4FA" }}>
          <div className="flex gap-[10px]">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-[14px] py-[10px] rounded-xl border-none cursor-pointer text-[13px] font-semibold transition-colors disabled:opacity-60"
              style={{ color: "#555", background: "#F1F1F5", fontFamily: "Poppins, sans-serif" }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 px-[14px] py-[10px] rounded-xl border-none cursor-pointer text-[13px] font-semibold text-white transition-colors disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-[7px]">
                  <span className="inline-block w-[13px] h-[13px] rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Consultation"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
