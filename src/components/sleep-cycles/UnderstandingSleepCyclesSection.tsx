"use client";

import React from "react";

const categoryLabels = ["Primary Function", "Approximate Duration", "Key Activities", "Primary Benefit"];
const nremRows = ["Rest, Repair and Recovery", "75 to 80 percent of total sleep", "Tissue repair, immune strengthening, physical restoration", "Restores the body"];
const remRows = ["Learning, Memory and Emotional Processing", "20 to 25 percent of total sleep", "Dreaming, emotional processing, learning, creativity", "Refreshes the mind, Cleans the junk memory"];
const stripImages = [
  { src: "/assets/section7/top.png", alt: "Sleep health illustration" },
  { src: "/assets/section7/middle.png", alt: "Person sleeping during the night" },
  { src: "/assets/section7/bottom.png", alt: "Sleep-tracking watch displaying sleep data" },
];

export default function UnderstandingSleepCyclesSection() {
  return (
    <section
      id="understanding-sleep-cycles"
      aria-label="Understanding Sleep Cycles"
      className="relative w-full bg-white"
      style={{ fontFamily: "Poppins, var(--font-poppins), sans-serif", borderBottom: "1px solid rgba(228, 185, 61, 0.72)" }}
    >
      <div className="relative z-[1] mx-auto max-w-[1180px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[36px] md:pt-[40px] lg:pt-[44px] pb-[38px] md:pb-[40px] lg:pb-[46px] min-w-0">
        <h2 className="m-0 mx-auto text-[clamp(28px,7vw,34px)] leading-[1.2] font-semibold text-center text-[#F59A00]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "-0.025em", marginBottom: "8px" }}>
          Understanding Sleep Cycles
        </h2>
        <p className="m-0 mx-auto text-[18px] leading-[1.45] md:text-[18px] lg:text-[19px] font-medium text-center text-[#3B35A3]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, marginBottom: "10px" }}>
          Your body heals in sleep. Your brain organizes your future in sleep.
        </p>
        <p className="m-0 mx-auto text-[17px] leading-[1.58] md:text-[17px] lg:text-[17px] font-medium text-center text-[#171717]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, maxWidth: "920px", marginBottom: "24px" }}>
          Healthy sleep occurs in repeating cycles throughout the night. Each cycle lasts approximately <strong style={{ fontWeight: 600 }}>90 to 120 minutes</strong>, and most adults experience <strong style={{ fontWeight: 600 }}>4 to 6 cycles</strong> every night.
        </p>

        <div className="hidden md:grid grid-cols-[130px_165px_1fr_16px_1fr] lg:grid-cols-[170px_190px_1fr_16px_1fr] gap-0 items-start w-full min-w-0">
          <div className="w-full h-[390px] md:h-[350px] lg:h-[390px] grid grid-rows-[1fr_1fr_1fr] gap-[4px] min-w-0">
            {stripImages.map((img) => (
              <div key={img.alt} className="w-full h-full overflow-hidden bg-[#F7F7F7] min-w-0">
                <img src={img.src} alt={img.alt} className="w-full h-full block object-cover" draggable={false} style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0, boxShadow: "none" }} />
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full min-w-0">
            <div className="h-[42px] w-full shrink-0" aria-hidden="true" />
            <div className="grid grid-rows-[repeat(4,minmax(78px,auto))] min-w-0">
              {categoryLabels.map((label) => (
                <div key={label} className="flex items-center px-[12px] lg:px-[18px] text-[18px] lg:text-[20px] leading-[1.3] font-semibold text-[#171717] border-b border-[#DDB642] min-w-0" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-full min-w-0">
            <div className="h-[42px] flex items-center justify-center bg-[#F4C623] text-[#171717] text-[19px] font-semibold" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, borderRadius: 0 }}>
              NREM Sleep
            </div>
            <div className="grid grid-rows-[repeat(4,minmax(78px,auto))] min-w-0">
              {nremRows.map((c) => (
                <div key={c} className="flex items-center px-[10px] lg:px-[18px] text-[17px] lg:text-[18px] leading-[1.45] font-medium text-[#171717] border-b border-[#DDB642] min-w-0" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div className="w-[16px] h-full" aria-hidden="true" />
          <div className="flex flex-col w-full min-w-0">
            <div className="h-[42px] flex items-center justify-center bg-[#F4C623] text-[#171717] text-[19px] font-semibold" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, borderRadius: 0 }}>
              REM Sleep
            </div>
            <div className="grid grid-rows-[repeat(4,minmax(78px,auto))] min-w-0">
              {remRows.map((c) => (
                <div key={c} className="flex items-center px-[10px] lg:px-[18px] text-[17px] lg:text-[18px] leading-[1.45] font-medium text-[#171717] border-b border-[#DDB642] min-w-0" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="block md:hidden w-full min-w-0">
          <div className="grid grid-cols-3 gap-[4px] w-full mb-[20px] min-w-0">
            {stripImages.map((img) => (
              <div key={img.alt + "-mobile"} className="w-full h-auto overflow-hidden bg-[#F7F7F7] min-w-0" style={{ aspectRatio: "1 / 1" }}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover block" draggable={false} style={{ objectFit: "cover", borderRadius: 0, aspectRatio: "1 / 1", height: "auto" }} />
              </div>
            ))}
          </div>

          <div className="w-full min-w-0" style={{ marginTop: "20px" }}>
            <div className="h-[44px] flex items-center justify-center bg-[#F4C623] text-[#171717] text-[19px] font-semibold" style={{ height: "44px", fontSize: "19px" }}>
              NREM Sleep
            </div>
            {categoryLabels.map((label, idx) => (
              <div key={`nrem-m-${label}`} className="grid border-b border-[#DDB642] min-w-0" style={{ gridTemplateColumns: "minmax(112px, 36%) minmax(0, 1fr)" }}>
                <div className="flex items-center text-[#171717] min-w-0" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", padding: "12px 8px" }}>
                  {label}
                </div>
                <div className="flex items-center text-[#171717] min-w-0" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "17px", lineHeight: "1.45", padding: "12px 8px" }}>
                  {nremRows[idx]}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full min-w-0" style={{ marginTop: "20px" }}>
            <div className="h-[44px] flex items-center justify-center bg-[#F4C623] text-[#171717] text-[19px] font-semibold" style={{ height: "44px", fontSize: "19px" }}>
              REM Sleep
            </div>
            {categoryLabels.map((label, idx) => (
              <div key={`rem-m-${label}`} className="grid border-b border-[#DDB642] min-w-0" style={{ gridTemplateColumns: "minmax(112px, 36%) minmax(0, 1fr)" }}>
                <div className="flex items-center text-[#171717] min-w-0" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", padding: "12px 8px" }}>
                  {label}
                </div>
                <div className="flex items-center text-[#171717] min-w-0" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "17px", lineHeight: "1.45", padding: "12px 8px" }}>
                  {remRows[idx]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-[28px] px-[18px] md:px-[28px] lg:px-[36px] py-[24px] md:py-[24px] lg:py-[28px] flex flex-col items-center justify-center text-center min-h-[145px] min-w-0" style={{ background: "#383477", borderRadius: 0, padding: "24px 18px" }}>
          <p className="m-0 text-[18px] leading-[1.5] md:text-[18px] lg:text-[20px] font-semibold text-white text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", lineHeight: "1.5" }}>
            NREM Sleep supports physical restoration.
          </p>
          <p className="m-0 mt-[2px] text-[18px] leading-[1.5] md:text-[18px] lg:text-[20px] font-semibold text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#F4C623", fontSize: "18px", lineHeight: "1.5" }}>
            REM Sleep supports mental and emotional restoration.
          </p>
          <p className="m-0 mt-[2px] text-[18px] leading-[1.5] md:text-[18px] lg:text-[20px] font-semibold text-white text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", lineHeight: "1.5" }}>
            Both are essential for optimal health and performance.
          </p>
        </div>
      </div>
    </section>
  );
}