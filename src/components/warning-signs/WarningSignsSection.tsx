"use client";

import React from "react";
import { useConsult } from "@/components/consult/ConsultContext";

const warningSigns = [
  { label: "Loud Habitual Snoring", image: "/assets/section9/Loud-Habitual.png" },
  { label: "Pauses in Breathing During Sleep", image: "/assets/section9/Pauses-in-Breathing.png" },
  { label: "Waking up Gasping for Air", image: "/assets/section9/Waking-up.png" },
  { label: "Excessive Daytime Sleepiness", image: "/assets/section9/Excessive-Daytime.png" },
  { label: "Falling Asleep while Driving", image: "/assets/section9/Falling-Asleep.png" },
  { label: "Persistent Insomnia", image: "/assets/section9/Persistent.png" },
  { label: "Unusual Movements, Sleep Walking, Sleep Talking & Night Mares", image: "/assets/section9/Unusual-Movements,.png" },
  { label: "Significant impact on work, studies, or relationships", image: "/assets/section9/Significant-impact.png" },
];

export default function WarningSignsSection() {
  const { open: openConsult } = useConsult();
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
          className="m-0 mx-auto text-[clamp(28px,7vw,34px)] leading-[1.2] font-semibold text-center text-[#F59A00]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "-0.025em", marginBottom: "10px" }}
        >
          Warning Signs That Need Attention
        </h2>

        <p
          className="m-0 mx-auto text-[18px] leading-[1.45] md:text-[18px] lg:text-[19px] font-medium text-center text-[#171717]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, marginBottom: "24px" }}
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
              return (
                <div key={item.label} className="flex flex-col items-center text-center">
                  <div
                    className="flex items-center justify-center w-[52px] h-[52px] md:w-[58px] md:h-[58px] lg:w-[68px] lg:h-[68px] shrink-0"
                    aria-hidden="true"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-contain"
                      draggable={false}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <p
                    className="text-[16px] leading-[1.4] font-medium text-center text-[#171717] break-words"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      maxWidth: "210px",
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
            className="text-center text-[17px] leading-[1.5] md:text-[17px] lg:text-[18px] font-medium text-[#171717]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, marginTop: "30px", fontSize: "17px", lineHeight: "1.5" }}
          >
            Better awareness leads to earlier support and better outcomes.
          </p>

          <div className="flex justify-center mt-[16px] w-full">
            <button
              type="button"
              onClick={openConsult}
              className="flex items-center justify-center bg-[#3B35A3] hover:bg-[#332D92] text-white rounded-none shadow-none focus:outline-none transition-all duration-[160ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer w-full max-w-[260px] md:w-[260px] lg:w-[270px] h-[48px] md:h-[48px] lg:h-[48px] text-[16px] font-semibold leading-[1]"
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