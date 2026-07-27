"use client";

import React from "react";
import { Heart, X } from "lucide-react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-[16px]"
      style={{ background: "rgba(15,13,45,0.65)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-[480px] rounded-[24px] overflow-hidden relative"
        style={{ background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
        <div style={{ height: "6px", background: "linear-gradient(90deg, #FF6B6B, #FFA94D, #FFD43B)" }} />

        <button type="button" onClick={onClose}
          className="absolute top-[18px] right-[18px] w-[32px] h-[32px] flex items-center justify-center rounded-full border-none cursor-pointer z-10"
          style={{ background: "rgba(0,0,0,0.06)", color: "#888" }}>
          <X size={16} />
        </button>

        <div className="p-[28px] text-center">
          <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-[16px]"
            style={{ background: "linear-gradient(135deg, #FFF0F0, #FFF5E6)" }}>
            <Heart size={36} stroke="#FF6B6B" fill="#FF6B6B" />
          </div>

          <h2 className="m-0 text-[22px] font-bold mb-[6px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
            Make a Donation
          </h2>
          <p className="m-0 text-[14px] leading-[1.6] mb-[20px]" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
            Your contribution helps provide free medical treatments and charity for patients across the world. Every donation brings better sleep health and wellness to those in need.
          </p>

          <div className="rounded-[16px] p-[20px] mb-[20px]" style={{ background: "linear-gradient(135deg, #FFF0F0, #FFF5E6)" }}>
            <div className="flex items-center gap-[10px] mb-[12px]">
              <Heart size={18} stroke="#FF6B6B" fill="#FF6B6B" />
              <span className="text-[14px] font-semibold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Your Impact</span>
            </div>
            <ul className="m-0 p-0 list-none flex flex-col gap-[8px]">
              {[
                "Provide free sleep consultations to underserved communities",
                "Support medical research for sleep disorder treatments",
                "Offer wellness programs to children and elderly patients",
                "Distribute educational resources about sleep health",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-[8px] text-[13px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                  <span className="mt-[3px] text-[#FF6B6B] shrink-0">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-[10px] mb-[16px]">
            <p className="m-0 text-[12px] font-semibold" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
              Select an amount
            </p>
            <div className="grid grid-cols-3 gap-[8px]">
              {["$10", "$25", "$50", "$100", "$250", "Other"].map((amt) => (
                <button key={amt} type="button"
                  className="px-[12px] py-[10px] rounded-xl border text-[14px] font-semibold cursor-pointer transition-all hover:translate-y-[-1px]"
                  style={{ borderColor: "#E0E0E0", color: "#555", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
                  {amt}
                </button>
              ))}
            </div>
          </div>

          <button type="button"
            className="w-full py-[14px] rounded-xl border-none cursor-pointer text-white text-[15px] font-semibold transition-all hover:translate-y-[-1px]"
            style={{ background: "linear-gradient(135deg, #FF6B6B, #FF8E53)", fontFamily: "Poppins, sans-serif" }}>
            <Heart size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Donate Now
          </button>

          <p className="m-0 mt-[12px] text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
            Secure payment processing will be added soon. Your donation is tax-deductible.
          </p>
        </div>
      </div>
    </div>
  );
}