"use client";

import { AlertTriangle, X } from "lucide-react";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  busyLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  busy = false,
  busyLabel = "Deleting...",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useLockBodyScroll(open);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-[16px]"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)" }}
      onClick={() => { if (!busy) onCancel(); }}
    >
      <div
        className="w-full max-w-[380px] rounded-[16px] p-[22px]"
        style={{ background: "#FFFFFF", boxShadow: "0 16px 40px rgba(0,0,0,0.18)", fontFamily: "Poppins, sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-[12px]">
          <div
            className="w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0"
            style={{ background: danger ? "rgba(211,47,47,0.1)" : "rgba(53,49,155,0.08)" }}
          >
            <AlertTriangle size={20} stroke={danger ? "#D32F2F" : "#35319B"} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="m-0 text-[15px] font-bold leading-[1.3]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              {title}
            </h3>
            <p className="m-0 mt-[4px] text-[13px] leading-[1.5]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
              {message}
            </p>
          </div>
          <button onClick={onCancel} disabled={busy} className="bg-transparent border-none cursor-pointer p-[4px] shrink-0" style={{ color: "#98A2B3" }} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-[10px] mt-[22px]">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 px-[14px] py-[10px] rounded-xl border-none cursor-pointer text-[13px] font-semibold transition-colors disabled:opacity-60"
            style={{ color: "#555", background: "#F1F1F5", fontFamily: "Poppins, sans-serif" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 px-[14px] py-[10px] rounded-xl border-none cursor-pointer text-[13px] font-semibold text-white transition-colors disabled:opacity-70"
            style={{ background: danger ? "linear-gradient(135deg, #D32F2F, #FF6B6B)" : "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}
          >
            {busy ? (
              <span className="flex items-center justify-center gap-[7px]">
                <span className="inline-block w-[13px] h-[13px] rounded-full border-2 border-white border-t-transparent animate-spin" />
                {busyLabel}
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
