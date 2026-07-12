"use client";

import React from "react";

const IconStyle = {
  stroke: "#3B35A3",
  strokeWidth: 1.7,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconBodyClock() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <g {...IconStyle}>
        {/* person */}
        <circle cx="22" cy="18" r="6" />
        <path d="M16 30 Q22 27 28 30 L26 44 H18 L16 30 Z" />
        {/* clock */}
        <circle cx="40" cy="28" r="12" />
        <path d="M40 20 V28 L45 31" />
      </g>
    </svg>
  );
}

function IconSleepCycles() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <g {...IconStyle}>
        {/* person sleeping */}
        <circle cx="18" cy="20" r="5" />
        <path d="M12 28 Q18 26 24 28 L22 36 Q18 38 14 36 L12 28" />
        {/* cycles clock */}
        <circle cx="40" cy="28" r="12" />
        <path d="M40 20 V28" />
        <path d="M40 28 L46 32" />
        {/* 90-120 indication Zzz */}
        <path d="M8 44 H12 L8 48 H12" opacity="0.8" />
      </g>
    </svg>
  );
}

function IconSleepHealth() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <g {...IconStyle}>
        {/* head side with brain */}
        <circle cx="26" cy="22" r="10" />
        <path d="M22 20 Q26 18 30 20 Q32 22 30 25 Q26 28 22 25 Q20 22 22 20" />
        {/* body sleeping */}
        <path d="M16 34 Q26 30 36 34 L34 44 H18 L16 34" />
        {/* heart / health */}
        <path d="M42 36 L40 38 L44 42 L48 38 L46 36 Q44 34 42 36 Z" />
      </g>
    </svg>
  );
}

function IconBetterHabits() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <g {...IconStyle}>
        {/* bed */}
        <path d="M10 32 H46" />
        <path d="M12 32 V28 Q12 24 16 24 H28" />
        {/* moon and sun */}
        <circle cx="40" cy="16" r="6" />
        <path d="M40 16 A6 6 0 0 1 44 20 A4 4 0 0 1 40 16" fill="#3B35A3" stroke="none" opacity="0.15" />
        <g>
          <circle cx="40" cy="16" r="2" fill="#3B35A3" stroke="none" />
          <path d="M40 8 V10 M40 22 V24 M32 16 H34 M46 16 H48 M34.6 10.6 L36 12 M44 20 L45.4 21.4 M34.6 21.4 L36 20 M44 12 L45.4 10.6" />
        </g>
        {/* small improvement arrow */}
        <path d="M22 36 L22 28 L28 28" />
        <path d="M28 28 L24 24 M28 28 L32 24" />
      </g>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <g stroke="#171717" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="4" r="2" />
        <circle cx="6" cy="10" r="2" />
        <circle cx="14" cy="16" r="2" />
        <path d="M8 11 L12 15" />
        <path d="M8 9 L12 5" />
      </g>
    </svg>
  );
}

const facts = [
  {
    icon: IconBodyClock,
    text: "Your body clock influences when you naturally feel alert, productive, and sleepy.",
    shareLabel: "Share fact about the body clock",
  },
  {
    icon: IconSleepCycles,
    text: "A typical night's sleep consists of 4 to 6 sleep cycles lasting approximately 90 to 120 minutes each.",
    shareLabel: "Share fact about sleep cycles",
  },
  {
    icon: IconSleepHealth,
    text: "Sleep plays a critical role in memory, learning, emotional regulation, immunity, recovery, and long-term health.",
    shareLabel: "Share fact about sleep and health",
  },
  {
    icon: IconBetterHabits,
    text: "Small improvements in sleep habits can create meaningful improvements in energy, mood, and performance.",
    shareLabel: "Share fact about improving sleep habits",
  },
];

export default function SleepFactsSharingSection() {
  return (
    <section
      id="sleep-facts-sharing"
      aria-label="Sleep Facts Worth Sharing"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <div className="relative z-[1] mx-auto max-w-[1060px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[36px] md:pt-[42px] lg:pt-[46px] pb-[38px] md:pb-[44px] lg:pb-[48px] min-w-0">
        {/* Heading */}
        <h2
          className="m-0 mx-auto text-[24px] leading-[1.22] md:text-[27px] lg:text-[30px] font-semibold text-center text-[#F59A00]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "28px" }}
        >
          Sleep Facts Worth Sharing
        </h2>

        {/* Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[18px] md:gap-[24px] lg:gap-[28px_36px] items-stretch">
          {facts.map((fact, idx) => {
            const Icon = fact.icon;
            return (
              <article
                key={idx}
                className="flex flex-col items-center justify-start text-center px-[20px] py-[22px] md:px-[22px] md:py-[22px] lg:px-[30px] lg:py-[24px] lg:pb-[22px] min-h-[250px] md:min-h-[275px] lg:min-h-[290px] h-full"
                style={{
                  background: "#F0EFF9",
                  border: "none",
                  borderRadius: "18px",
                  boxShadow: "none",
                }}
              >
                {/* Icon Circle */}
                <div
                  className="flex items-center justify-center w-[74px] h-[74px] md:w-[78px] md:h-[78px] lg:w-[86px] lg:h-[86px] rounded-full bg-white shrink-0 mx-auto"
                  aria-hidden="true"
                  style={{
                    borderRadius: "9999px",
                    background: "#FFFFFF",
                    marginBottom: "18px",
                  }}
                >
                  <div className="flex items-center justify-center w-[46px] h-[46px] md:w-[50px] md:h-[50px] lg:w-[56px] lg:h-[56px]">
                    <Icon />
                  </div>
                </div>

                {/* Fact Text */}
                <p
                  className="flex-1 flex items-center justify-center text-[14px] leading-[1.5] md:text-[14px] lg:text-[16px] lg:leading-[1.5] font-normal text-center text-[#171717] m-0 mx-auto"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    maxWidth: "390px",
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {fact.text}
                </p>

                {/* Share Fact Button */}
                <button
                  type="button"
                  aria-label={fact.shareLabel}
                  className="inline-flex items-center justify-center gap-[8px] bg-white text-[#171717] border-[1.5px] border-[#E7A62A] rounded-full shadow-none focus:outline-none transition-colors duration-[160ms] cursor-pointer mt-[18px] w-[170px] h-[42px] md:w-[170px] md:h-[40px] lg:w-[190px] lg:h-[42px] text-[14px] font-medium leading-[1]"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    borderRadius: "9999px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "3px solid rgba(59, 53, 163, 0.25)";
                    e.currentTarget.style.outlineOffset = "3px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "";
                    e.currentTarget.style.outlineOffset = "";
                  }}
                >
                  <ShareIcon />
                  <span>Share Fact</span>
                </button>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA — mobile width100% max none min-h50 height auto padding12 14 font15 line1.35 */}
        <div className="flex justify-center mt-[32px] w-full min-w-0">
          <button
            type="button"
            className="flex items-center justify-center bg-[#3B35A3] text-white border-none rounded-none shadow-none focus:outline-none transition-all duration-[160ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer w-full max-w-none md:w-[470px] md:max-w-[470px] lg:w-[500px] lg:max-w-[500px] min-h-[50px] h-auto md:h-[48px] lg:h-[48px] px-[14px] py-[12px] md:p-0 lg:p-0 text-[15px] md:text-[16px] lg:text-[17px] font-semibold leading-[1.35] md:leading-[1]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              borderRadius: 0,
              boxShadow: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = "3px solid rgba(59, 53, 163, 0.28)";
              e.currentTarget.style.outlineOffset = "3px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "";
              e.currentTarget.style.outlineOffset = "";
            }}
          >
            <span>
              Share These Facts with Your Loved Ones{" "}
              <span style={{ color: "#F4C623" }}>Now</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
