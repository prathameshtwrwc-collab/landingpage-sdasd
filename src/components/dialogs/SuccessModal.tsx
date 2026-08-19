"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";
import { useLenis } from "@/components/smooth-scroll/SmoothScrollProvider";

interface SuccessModalProps {
  open: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export default function SuccessModal({ open, title, message, buttonText = "Done", onClose }: SuccessModalProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { stop: stopLenis, start: startLenis } = useLenis();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    stopLenis();

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
        className="w-full max-w-[400px] rounded-[16px] overflow-hidden"
        style={{ background: "#FFFFFF", boxShadow: "0 16px 40px rgba(0,0,0,0.18)", fontFamily: "Poppins, sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-[20px] py-[16px]" style={{ borderBottom: "1px solid #F1F4FA", background: "#F8F9FF" }}>
          <h3 className="m-0 text-[15px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{title}</h3>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer p-[4px]" style={{ color: "#98A2B3" }} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="px-[20px] py-[24px] text-center">
          <p className="m-0 text-[14px] leading-[1.6]" style={{ fontFamily: "Poppins, sans-serif", color: "#444" }}>{message}</p>
        </div>
        <div className="px-[20px] py-[14px]" style={{ borderTop: "1px solid #F1F4FA" }}>
          <button
            onClick={onClose}
            className="w-full px-[14px] py-[10px] rounded-xl border-none cursor-pointer text-[13px] font-semibold text-white transition-colors"
            style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
