"use client";

import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";

interface BusyOverlayProps {
  show: boolean;
  label: string;
}

export default function BusyOverlay({ show, label }: BusyOverlayProps) {
  useLockBodyScroll(show);
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(2px)", fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex flex-col items-center gap-[14px] rounded-[16px] px-[28px] py-[24px]" style={{ background: "#FFFFFF", boxShadow: "0 16px 40px rgba(0,0,0,0.2)" }}>
        <div className="w-[34px] h-[34px] rounded-full border-[3px] border-[#35319B] border-t-transparent animate-spin" />
        <p className="m-0 text-[13px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{label}</p>
      </div>
    </div>
  );
}
