"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";
import { useLenis } from "@/components/smooth-scroll/SmoothScrollProvider";

export interface InfoField {
  label: string;
  value: string;
  badge?: { text: string; bg: string; color: string };
}

interface InfoModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  fields: InfoField[];
  avatar?: { initials: string; bg: string };
  onClose: () => void;
}

export default function InfoModal({ open, title, subtitle, fields, avatar, onClose }: InfoModalProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { stop: stopLenis, start: startLenis } = useLenis();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    stopLenis();

    // Let the modal's own content scroll, but block the event from ever
    // reaching Lenis or the page scroll container.
    const onWheel = (e: WheelEvent) => {
      if (!scrollerRef.current?.contains(e.target as Node | null)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!scrollerRef.current?.contains(e.target as Node | null)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      startLenis();
    };
  }, [open, stopLenis, startLenis]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-[16px]"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-[16px] overflow-hidden"
        style={{ background: "#FFFFFF", boxShadow: "0 16px 40px rgba(0,0,0,0.18)", fontFamily: "Poppins, sans-serif", maxHeight: "86vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-[20px] py-[16px]" style={{ borderBottom: "1px solid #F1F4FA", background: "#F8F9FF" }}>
          <div className="flex items-center gap-[12px] min-w-0">
            {avatar && (
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0" style={{ background: avatar.bg }}>
                {avatar.initials}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="m-0 text-[15px] font-bold truncate" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{title}</h3>
              {subtitle && <p className="m-0 text-[11px] truncate" style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}>{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer p-[4px] shrink-0" style={{ color: "#98A2B3" }} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div
          data-lenis-prevent
          ref={scrollerRef}
          className="overflow-y-auto px-[20px] py-[8px]"
          style={{ minHeight: 0, overscrollBehavior: "contain" }}
        >
          {fields.map((f, i) => (
            <div key={i} className="flex items-start justify-between gap-[16px] py-[9px]" style={{ borderBottom: i < fields.length - 1 ? "1px solid #F5F5F5" : "none" }}>
              <span className="text-[12px] font-semibold uppercase tracking-[0.03em] shrink-0" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif", minWidth: 112 }}>
                {f.label}
              </span>
              <span className="text-[13px] text-right min-w-0" style={{ color: "#333", fontFamily: "Poppins, sans-serif", wordBreak: "break-word" }}>
                {f.value || "—"}
                {f.badge && (
                  <span
                    className="inline-block ml-[8px] text-[10px] font-semibold px-[7px] py-[2px] rounded-full align-middle"
                    style={{ background: f.badge.bg, color: f.badge.color, fontFamily: "Poppins, sans-serif" }}
                  >
                    {f.badge.text}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="px-[20px] py-[14px]" style={{ borderTop: "1px solid #F1F4FA" }}>
          <button
            onClick={onClose}
            className="w-full px-[14px] py-[10px] rounded-xl border-none cursor-pointer text-[13px] font-semibold text-white transition-colors"
            style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
