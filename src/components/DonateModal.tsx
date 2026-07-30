"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart, X, Stethoscope, Pill, UsersRound, CheckCircle2,
  HeartHandshake, LockKeyhole, CircleAlert, CircleCheckBig,
} from "lucide-react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

function currencySymbol() {
  return "₹";
}

function formatAmount(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function DonateVisualPanel() {
  return (
    <div className="donate-visual" style={{
      position: "relative",
      minHeight: "500px",
      background: "#27235F",
      borderRadius: "22px 0 0 22px",
      overflow: "hidden",
    }}>
      <img
        src="/assets/donate modal/donatepic.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </div>
  );
}

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const isResultView = submitted;

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Focus heading on open
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => headingRef.current?.focus());
    }
  }, [isOpen]);

  // Escape key close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const selectAmount = useCallback((amt: number) => {
    setSelectedAmount(amt);
    setShowCustomInput(false);
    setCustomAmount("");
    setError("");
  }, []);

  const selectCustom = useCallback(() => {
    setSelectedAmount(null);
    setShowCustomInput(true);
    setError("");
  }, []);

  const handleDonate = useCallback(() => {
    const amount = showCustomInput ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount <= 0) {
      setError("Please select or enter a contribution amount.");
      return;
    }
    setSubmitting(true);
    setError("");
    // Simulate donation flow — payment not yet connected
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  }, [selectedAmount, customAmount, showCustomInput]);

  const resetAndClose = useCallback(() => {
    setSelectedAmount(null);
    setCustomAmount("");
    setShowCustomInput(false);
    setSubmitting(false);
    setSubmitted(false);
    setError("");
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  const renderSuccess = () => (
    <div className="donate-content" style={{ position: "relative", padding: "32px 34px 22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "16px" }}>
      <button type="button" onClick={resetAndClose} aria-label="Close donation dialog"
        className="donate-success-close flex items-center justify-center bg-transparent border-none cursor-pointer z-10 rounded-lg transition-colors duration-200 hover:bg-[#E6E6EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f]"
        style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px" }}>
        <X size={24} strokeWidth={1.75} stroke="#666779" />
      </button>
      <div className="donate-visual donate-success-visual" style={{ display: "none", width: "100%", height: "200px", position: "relative", background: "#27235F", overflow: "hidden", borderRadius: "12px" }}>
        <img src="/assets/donate modal/donatepic.png" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      </div>
      <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#F5FBF7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircleCheckBig size={40} strokeWidth={1.75} stroke="#18794E" />
      </div>
      <h2 className="m-0" style={{ color: "#19192B", fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px", lineHeight: 1.2 }}>
        Thank you for your generosity
      </h2>
      <p className="m-0" style={{ color: "#666779", fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6, maxWidth: "420px" }}>
        Your contribution of {selectedAmount || customAmount ? formatAmount(selectedAmount || parseFloat(customAmount)) : ""} helps bring essential healthcare and compassionate medical support to families who need it most.
      </p>
      <button type="button" onClick={resetAndClose}
        className="inline-flex items-center justify-center border-none cursor-pointer rounded-lg transition-all duration-200 px-[28px]"
        style={{ minHeight: "48px", background: "#30268F", color: "#FFFFFF", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "15px" }}>
        Done
      </button>
    </div>
  );

  const renderForm = () => (
    <div ref={contentRef} className="donate-content" style={{
      position: "relative", display: "flex", flexDirection: "column", gap: "16px",
      padding: "32px 34px 22px", overflowY: "auto", overflowX: "hidden", scrollbarGutter: "stable",
    }}>
      {/* Close button */}
      <button type="button" onClick={resetAndClose} aria-label="Close donation dialog"
        className="absolute top-[18px] right-[18px] flex items-center justify-center bg-transparent border-none cursor-pointer z-10 rounded-lg transition-colors duration-200 hover:bg-[#E6E6EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f]"
        style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px" }}>
        <X size={24} strokeWidth={1.75} stroke="#666779" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-[14px]" style={{ paddingRight: "44px" }}>
        <div className="flex items-center justify-center shrink-0 rounded-full" style={{ width: "56px", height: "56px", minWidth: "56px", background: "#FFF7F1", border: "1px solid #F6D3BD" }}>
          <Heart size={28} strokeWidth={1.75} stroke="#FF5F5D" fill="#FF5F5D" />
        </div>
        <div>
          <p className="m-0 text-[12px] font-semibold tracking-[0.02em]" style={{ color: "#30268F", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
            GIVE THE GIFT OF HEALTHCARE
          </p>
          <h2 ref={headingRef} id="donation-heading" tabIndex={-1} className="m-0 font-bold tracking-[-0.025em] leading-[1.1]" style={{
            color: "#30268F", fontFamily: "Poppins, sans-serif", fontWeight: 700,
            fontSize: "clamp(1.75rem, 2.6vw, 2.4rem)", outline: "none",
          }}>
            Help a family receive the care they deserve.
          </h2>
        </div>
      </div>

      <p id="donation-description" className="m-0" style={{ color: "#666779", fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.5, maxWidth: "58ch" }}>
        No family should have to choose between medical treatment and daily essentials. Your contribution helps low-income families access doctor consultations, essential medicines and compassionate care.
      </p>

      {/* Impact categories */}
      <div className="impact-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        alignItems: "start", gap: "12px", padding: "14px 12px",
        background: "#F8F6FF", border: "1px solid #EBE8FB", borderRadius: "12px",
      }}>
        {[
          { icon: Stethoscope, label: "Doctor consultations" },
          { icon: Pill, label: "Essential medicines" },
          { icon: UsersRound, label: "Family health support" },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div className="flex items-center justify-center mx-auto mb-[6px]" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(48,38,143,0.08)" }}>
              <item.icon size={28} strokeWidth={1.75} stroke="#30268F" />
            </div>
            <p className="m-0 text-[12px] font-medium leading-[1.3]" style={{ color: "#19192B", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Amount selection */}
      <div>
        <p className="m-0 text-[14px] font-semibold mb-[10px]" style={{ color: "#19192B", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          Choose your contribution
        </p>
        <div className="amount-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
          {PRESET_AMOUNTS.map((amt) => {
            const isSelected = selectedAmount === amt;
            return (
              <button key={amt} type="button" role="radio" aria-checked={isSelected} aria-pressed={isSelected}
                onClick={() => selectAmount(amt)}
                className="flex items-center justify-center border rounded-lg cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f] relative"
                style={{
                  minHeight: "54px", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "15px",
                  background: isSelected ? "#30268F" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#19192B",
                  borderColor: isSelected ? "#30268F" : "#E2E2EA",
                }}>
                {isSelected && (
                  <span style={{ position: "absolute", top: "4px", right: "6px" }}>
                    <CheckCircle2 size={14} strokeWidth={2.5} stroke="#FFFFFF" />
                  </span>
                )}
                {formatAmount(amt)}
              </button>
            );
          })}
          <button type="button" role="radio" aria-checked={showCustomInput} aria-pressed={showCustomInput}
            onClick={selectCustom}
            className="flex items-center justify-center border rounded-lg cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f]"
            style={{
              minHeight: "54px", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "15px",
              background: showCustomInput ? "#30268F" : "#FFFFFF",
              color: showCustomInput ? "#FFFFFF" : "#19192B",
              borderColor: showCustomInput ? "#30268F" : "#E2E2EA",
            }}>
            Other
          </button>
        </div>

        {showCustomInput && (
          <div className="mt-[10px]">
            <label htmlFor="custom-amount" className="block text-[13px] font-medium mb-[5px]" style={{ color: "#666779", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
              Enter contribution amount
            </label>
            <div className="flex items-center" style={{ border: "1px solid #E2E2EA", borderRadius: "8px", overflow: "hidden" }}>
              <span className="flex items-center justify-center px-[14px] text-[15px] font-semibold" style={{ background: "#F8F6FF", color: "#30268F", fontFamily: "Poppins, sans-serif", minHeight: "48px", borderRight: "1px solid #E2E2EA" }}>
                {currencySymbol()}
              </span>
              <input id="custom-amount" type="number" min={1} step={1}
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setError(""); }}
                placeholder="Enter amount"
                className="w-full px-[14px] text-[15px] font-semibold border-none outline-none"
                style={{ minHeight: "48px", fontFamily: "Poppins, sans-serif", color: "#19192B" }}
                aria-label="Enter contribution amount"
              />
            </div>
          </div>
        )}
      </div>

      {/* Reassurance */}
      <div className="flex items-start gap-[10px] rounded-xl" style={{ padding: "10px 12px", background: "#F6F4FF", border: "1px solid #D9D4FA" }}>
        <HeartHandshake size={20} strokeWidth={1.75} stroke="#30268F" className="shrink-0 mt-[1px]" />
        <p className="m-0 text-[12px] leading-[1.5]" style={{ color: "#666779", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
          Every contribution helps bring essential healthcare closer to a family in need.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-[8px]" style={{ padding: "8px 12px", borderRadius: "8px", background: "#FEF3F2" }}>
          <CircleAlert size={18} strokeWidth={1.75} stroke="#B42318" className="shrink-0" />
          <p className="m-0 text-[12px]" style={{ color: "#B42318", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>{error}</p>
        </div>
      )}

      {/* Donate button */}
      <button type="button" onClick={handleDonate} disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-[10px] border-none cursor-pointer rounded-lg transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30268f]"
        style={{
          minHeight: "54px", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px",
          color: "#FFFFFF",
          background: "linear-gradient(90deg, #FF5F5D, #FF884D)",
        }}>
        {submitting ? (
          <>
            <span className="inline-block w-[18px] h-[18px] rounded-full border-2 border-white border-t-transparent" style={{ animation: "donate-spin 0.6s linear infinite" }} />
            Preparing payment&hellip;
          </>
        ) : (
          <>
            <Heart size={18} strokeWidth={1.75} />
            Donate for Family Healthcare
          </>
        )}
      </button>

      {/* Payment note */}
      <div className="flex items-center justify-center gap-[6px]">
        <LockKeyhole size={14} strokeWidth={1.75} stroke="#9999AA" />
        <p className="m-0 text-[11px]" style={{ color: "#9999AA", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
          You&rsquo;ll review your contribution before payment.
        </p>
      </div>

      <style>{`
        @keyframes donate-spin { to { transform: rotate(360deg); } }
        .donate-modal { width: min(1180px, calc(100vw - 48px)); max-height: calc(100dvh - 40px); }
        @media (max-width: 767px) {
          .donate-overlay { padding: 0 !important; }
          .donate-modal { width: 100% !important; min-height: 100dvh !important; max-height: 100dvh !important; border-radius: 0 !important; display: block !important; overflow-y: auto !important; }
          .donate-visual { display: none !important; }
          .donate-content { padding: 20px 18px !important; }
          .donate-content .impact-grid { gap: 8px; padding: 12px 8px !important; }
          .donate-content .amount-grid { grid-template-columns: repeat(2, 1fr) !important; }
          /* Success view on mobile: show visual panel at top */
          .donate-success-visual { display: block !important; width: 100% !important; height: 200px !important; border-radius: 0 !important; margin: -20px -18px 0 !important; }
          .donate-success-close { position: absolute !important; top: 12px !important; right: 12px !important; background: rgba(0,0,0,0.25) !important; border-radius: 50% !important; }
          .donate-success-close svg { stroke: #fff !important; }
        }
        @media (max-width: 399px) {
          .donate-content { padding: 16px 14px !important; gap: 12px !important; }
          .donate-content .impact-grid { padding: 10px 6px !important; gap: 6px !important; }
          .donate-content .impact-grid .w-\[48px\] { width: 36px !important; height: 36px !important; }
          .donate-content .impact-grid svg { width: 22px !important; height: 22px !important; }
          .donate-content .amount-grid button { min-height: 46px !important; font-size: 13px !important; }
          .donate-content .donate-btn { font-size: 14px !important; min-height: 48px !important; }
          .donate-content .flex.items-start.gap-\[14px\] > div:first-child { width: 44px !important; height: 44px !important; min-width: 44px !important; }
          .donate-content .flex.items-start.gap-\[14px\] svg { width: 22px !important; height: 22px !important; }
          .donate-content h2 { font-size: 1.4rem !important; }
          .donate-content p.text-\[14px\] { font-size: 13px !important; }
          .donate-success-visual { height: 160px !important; margin: -16px -14px 0 !important; }
        }
        @media (min-width: 768px) and (max-width: 899px) {
          .donate-modal { display: block !important; width: calc(100vw - 24px) !important; overflow-y: auto !important; }
          .donate-visual { display: grid !important; grid-template-rows: 160px 64px 90px !important; border-radius: 22px 22px 0 0 !important; }
          .donate-content { padding: 24px !important; }
        }
        @media (min-width: 768px) {
          .donate-success-close { position: absolute !important; top: 18px !important; right: 18px !important; }
        }
        @media (min-width: 900px) and (max-width: 1199px) {
          .donate-modal { display: grid !important; grid-template-columns: minmax(330px, 40%) minmax(0, 60%) !important; width: calc(100vw - 32px) !important; }
          .donate-content { padding: 24px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
          .donate-content button:hover { transform: none !important; }
        }
        @media (hover: none) {
          .donate-content button:hover { transform: none !important; }
        }
      `}</style>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-heading"
      aria-describedby="donation-description"
      className="fixed inset-0 z-[9999] donate-overlay"
      style={{
        display: "grid", placeItems: "center",
        padding: "20px 24px",
        overflow: "hidden",
        background: "rgba(20, 22, 60, 0.74)",
        backdropFilter: "blur(5px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) resetAndClose(); }}
    >
      <div className="donate-modal" style={{
        display: "grid",
        gridTemplateColumns: "minmax(390px, 42%) minmax(0, 58%)",
        overflow: "hidden",
        background: "#FFFFFF",
        borderRadius: "22px",
        boxShadow: "0 24px 80px rgba(18, 20, 57, 0.3)",
      }}>
        {/* Left visual panel */}
        <DonateVisualPanel />

        {/* Right content panel */}
        {isResultView ? renderSuccess() : renderForm()}
      </div>
    </div>
  );
}
