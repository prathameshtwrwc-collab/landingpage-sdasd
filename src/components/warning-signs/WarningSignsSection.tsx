"use client";

import React from "react";

const IconStyle = {
  stroke: "#171717",
  strokeWidth: 1.6,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconLoudSnoring() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
      <g {...IconStyle}>
        <ellipse cx="26" cy="52" rx="18" ry="5" />
        <circle cx="24" cy="32" r="11" />
        <path d="M19 32 Q21 34 23 32" />
        <path d="M20 38 Q22 40 24 38" />
        <path d="M40 12 H48 L40 18 H48" />
        <path d="M46 22 H52 L46 28 H52" opacity="0.75" />
        <path d="M38 32 H44 L38 38 H44" opacity="0.55" />
      </g>
    </svg>
  );
}

function IconPausesBreathing() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
      <g {...IconStyle}>
        <circle cx="22" cy="28" r="10" />
        <path d="M18 28 Q20 30 22 28" />
        <path d="M14 44 Q22 48 32 44 Q40 42 48 46" />
        <path d="M36 36 H42" />
        <path d="M44 36 L46 30 L48 42 L50 36" />
        <path d="M52 36 H60" />
        <path d="M42.5 33 V39" />
        <path d="M51.5 33 V39" />
      </g>
    </svg>
  );
}

function IconGaspingAir() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
      <g {...IconStyle}>
        <circle cx="32" cy="18" r="8" />
        <ellipse cx="32" cy="22" rx="2.5" ry="2" />
        <path d="M24 26 Q28 26 32 28 Q36 26 40 26" />
        <path d="M24 26 L18 36" />
        <path d="M40 26 L46 36" />
        <path d="M28 36 L28 50 M36 36 L36 50" />
        <path d="M20 50 H44" />
        <path d="M48 22 L54 18" />
        <path d="M49 26 L56 26" />
        <path d="M48 30 L54 34" />
      </g>
    </svg>
  );
}

function IconDaytimeSleepiness() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
      <g {...IconStyle}>
        <circle cx="32" cy="36" r="16" />
        <path d="M18 24 Q14 18 20 16 Q22 18 24 22" />
        <path d="M46 22 Q48 18 50 16 Q56 18 52 24" />
        <path d="M32 24 V28" />
        <path d="M32 44 V48" />
        <path d="M20 36 H24" />
        <path d="M40 36 H44" />
        <path d="M32 36 L32 28" />
        <path d="M32 36 L38 40" />
        <path d="M26 36 Q28 38 30 36" />
        <path d="M34 36 Q36 38 38 36" />
        <path d="M50 10 H55 L50 15 H55" />
      </g>
    </svg>
  );
}

function IconDrivingAsleep() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
      <g {...IconStyle}>
        <circle cx="32" cy="42" r="14" />
        <circle cx="32" cy="42" r="3" />
        <path d="M32 28 V38" />
        <path d="M21 47 L28 44" />
        <path d="M43 47 L36 44" />
        <circle cx="24" cy="22" r="8" />
        <path d="M20 22 Q22 24 24 22" />
        <path d="M22 18 L18 14" />
        <path d="M18 14 L20 14 L18 18" opacity="0.7" />
        <path d="M10 32 Q32 24 54 32" />
        <path d="M10 32 V52 M54 32 V52" />
        <path d="M10 52 H54" />
      </g>
    </svg>
  );
}

function IconInsomnia() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
      <g {...IconStyle}>
        <path d="M10 48 H54" />
        <path d="M12 48 V42 Q12 38 18 38 H40 Q46 38 46 42 V48" />
        <circle cx="32" cy="24" r="7" />
        <circle cx="32" cy="24" r="1.2" fill="#171717" stroke="none" />
        <circle cx="32" cy="24" r="2.4" fill="none" />
        <path d="M24 32 Q32 30 40 32 L38 44 Q32 46 26 44 Z" />
        <path d="M26 44 L28 36 L34 36 L36 44" />
        <path d="M52 16 A8 8 0 1 0 52 24 A6 6 0 1 1 52 16" />
      </g>
    </svg>
  );
}

function IconSleepMovement() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
      <g {...IconStyle}>
        <path d="M8 46 H20" />
        <path d="M10 46 V40 Q10 38 12 38 H18" />
        <circle cx="32" cy="16" r="6" />
        <path d="M28 22 L28 36" />
        <path d="M28 26 L22 28" />
        <path d="M28 26 L36 24" />
        <path d="M28 36 L22 48" />
        <path d="M28 36 L36 48" />
        <path d="M30 16 Q32 17 34 16" />
        <path d="M44 24 Q48 26 44 28" opacity="0.6" />
        <path d="M46 30 Q50 32 46 34" opacity="0.6" />
      </g>
    </svg>
  );
}

function IconImpactWork() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
      <g {...IconStyle}>
        <path d="M12 44 H56" />
        <path d="M16 44 V52 M50 44 V52" />
        <circle cx="32" cy="22" r="7" />
        <path d="M28 30 L28 38" />
        <path d="M36 30 L36 38" />
        <path d="M24 36 L28 38" />
        <path d="M40 36 L36 38" />
        <path d="M24 38 Q32 42 40 38" />
        <path d="M46 20 L50 16" />
        <path d="M48 22 H54" />
        <path d="M46 26 L50 30" />
      </g>
    </svg>
  );
}

const warningSigns = [
  { label: "Loud Habitual Snoring", Icon: IconLoudSnoring },
  { label: "Pauses in Breathing During Sleep", Icon: IconPausesBreathing },
  { label: "Waking up Gasping for Air", Icon: IconGaspingAir },
  { label: "Excessive Daytime Sleepiness", Icon: IconDaytimeSleepiness },
  { label: "Falling Asleep while Driving", Icon: IconDrivingAsleep },
  { label: "Persistent Insomnia", Icon: IconInsomnia },
  {
    label: "Unusual Movements, Sleep Walking, Sleep Talking & Night Mares",
    Icon: IconSleepMovement,
  },
  {
    label: "Significant impact on work, studies, or relationships",
    Icon: IconImpactWork,
  },
];

export default function WarningSignsSection() {
  return (
    <section
      id="warning-signs"
      aria-label="Warning Signs That Need Attention"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <div className="relative z-[1] mx-auto max-w-[1120px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[36px] md:pt-[40px] lg:pt-[46px] pb-[38px] md:pb-[44px] lg:pb-[48px] min-w-0">
        <h2
          className="m-0 mx-auto text-[clamp(24px,6.4vw,29px)] leading-[1.2] font-semibold text-center text-[#F59A00]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "-0.025em", marginBottom: "10px" }}
        >
          Warning Signs That Need Attention
        </h2>

        <p
          className="m-0 mx-auto text-[16px] leading-[1.45] md:text-[16px] lg:text-[17px] font-normal text-center text-[#171717]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginBottom: "24px" }}
        >
          Seek professional evaluation if you experience:
        </p>

        <div
          className="w-full bg-white px-[14px] py-[24px] md:px-[22px] md:py-[28px] lg:px-[34px] lg:py-[30px] lg:pb-[28px] min-w-0"
          style={{
            border: "1.5px solid #E4B93D",
            borderRadius: 0,
            boxShadow: "none",
            minHeight: "430px",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-[28px_14px] md:gap-[28px_14px] lg:gap-[30px_22px] items-start min-w-0">
            {warningSigns.map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.label} className="flex flex-col items-center text-center">
                  <div
                    className="flex items-center justify-center w-[52px] h-[52px] md:w-[58px] md:h-[58px] lg:w-[68px] lg:h-[68px] shrink-0"
                    aria-hidden="true"
                  >
                    <Icon />
                  </div>
                  <p
                    className="text-[14px] leading-[1.4] font-normal text-center text-[#171717] break-words"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      maxWidth: "190px",
                      marginTop: "10px",
                      marginLeft: "auto",
                      marginRight: "auto",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          <p
            className="text-center text-[15px] leading-[1.5] md:text-[15px] lg:text-[16px] font-normal text-[#171717]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginTop: "30px", fontSize: "15px", lineHeight: "1.5" }}
          >
            Better awareness leads to earlier support and better outcomes.
          </p>

          <div className="flex justify-center mt-[16px] w-full">
            <button
              type="button"
              className="flex items-center justify-center bg-[#3B35A3] hover:bg-[#332D92] text-white rounded-none shadow-none focus:outline-none transition-all duration-[160ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer w-full max-w-[240px] md:w-[230px] lg:w-[235px] h-[44px] md:h-[40px] lg:h-[40px] text-[14px] font-semibold leading-[1]"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, borderRadius: 0, boxShadow: "none" }}
              onFocus={(e) => {
                e.currentTarget.style.outline = "3px solid rgba(59, 53, 163, 0.28)";
                e.currentTarget.style.outlineOffset = "3px";
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "";
                e.currentTarget.style.outlineOffset = "";
              }}
            >
              Consult a Sleep Specialist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}