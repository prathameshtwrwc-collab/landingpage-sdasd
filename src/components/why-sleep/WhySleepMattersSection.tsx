"use client";

import React from "react";

const facts = [
  { value: "7 to 9 Hours", description: "Recommended sleep duration for most adults" },
  { value: "90 to 120 Minutes", description: "Average duration of one sleep cycle" },
  { value: "4 to 6 Cycles", description: "Typical number of sleep cycles per night" },
  { value: "1 in 3 Adults", description: "Experience sleep-related difficulties during their lifetime" },
];

const pillars = [
  {
    title: "Mind",
    image: "/assets/section6/Mind.jpg",
    alt: "Person representing mental clarity, creativity, and emotional well-being",
    description: "Learning, memory, focus, creativity, emotional balance.",
  },
  {
    title: "Body",
    image: "/assets/section6/body.jpg",
    alt: "Healthy person representing physical recovery and long-term health",
    description: "Immunity, recovery, hormones, metabolism, long-term health.",
  },
  {
    title: "Life",
    image: "/assets/section6/Life.jpg",
    alt: "Person representing energy, productivity, and balanced living",
    description: "Energy, productivity, performance, relationships, and well-being.",
  },
];

export default function WhySleepMattersSection() {
  return (
    <section
      id="why-sleep-matters"
      aria-label="Why Sleep Matters"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <div className="relative z-[1] mx-auto max-w-[1180px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[36px] md:pt-[40px] lg:pt-[44px] pb-[38px] md:pb-[40px] lg:pb-[48px]">
        <h2
          className="m-0 mx-auto text-[clamp(24px,6.4vw,29px)] leading-[1.2] font-semibold text-center text-[#F59A00]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "-0.025em", marginBottom: "10px" }}
        >
          Why Sleep Matters
        </h2>

        <p
          className="m-0 mx-auto text-[16px] leading-[1.2] font-semibold text-center text-[#3B35A3]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "0.02em", marginBottom: "18px" }}
        >
          FACT STRIP
        </p>

        <div
          className="relative w-full overflow-hidden"
          style={{
            background: `linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url("/assets/section6/section6.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full items-stretch min-w-0">
            {facts.map((fact) => (
              <div
                key={fact.value}
                className="fact-cell flex flex-col justify-center items-center text-center px-[16px] py-[18px] md:px-[22px] md:py-[20px] min-h-[96px] md:min-h-[110px] lg:min-h-[150px] relative min-w-0"
              >
                <p
                  className="m-0 text-[25px] leading-[1.15] md:text-[21px] lg:text-[24px] font-bold text-[#171717] text-center"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, marginBottom: "6px" }}
                >
                  {fact.value}
                </p>
                <p
                  className="m-0 text-[14px] leading-[1.35] max-w-[190px] text-center"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, maxWidth: "190px" }}
                >
                  {fact.description}
                </p>
              </div>
            ))}
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
                .fact-cell { border-bottom: 1px solid rgba(59,53,163,0.18); }
                .fact-cell:last-child { border-bottom: none; }
                @media(min-width:768px){
                  .fact-cell { border-bottom: 1px solid rgba(59,53,163,0.18); }
                  .fact-cell:nth-child(odd) { border-right: 2px solid #3B35A3; }
                  .fact-cell:nth-child(even) { border-right: none; }
                  .fact-cell:nth-child(3), .fact-cell:nth-child(4) { border-bottom: none; }
                }
                @media(min-width:1024px){
                  .fact-cell { border-bottom: none !important; }
                  .fact-cell:nth-child(odd), .fact-cell:nth-child(even) { border-right: 2px solid #3B35A3; }
                  .fact-cell:last-child { border-right: none !important; }
                }
              `,
            }}
          />
        </div>

        <p
          className="m-0 mx-auto text-[17px] leading-[1.45] font-semibold text-center text-[#F59A00]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "24px" }}
        >
          Good sleep changes your energy, your performance, and your quality of life.
        </p>
        <p
          className="m-0 mx-auto text-[16px] leading-[1.5] font-normal text-center text-[#171717]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginTop: "6px", marginBottom: "24px" }}
        >
          Quality sleep powers every area of life.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-[28px] md:gap-[20px] lg:gap-[34px] items-start min-w-0">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-stretch min-w-0">
              <h3
                className="m-0 text-[20px] leading-[1.2] md:text-[20px] lg:text-[22px] font-semibold text-center text-[#171717]"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginBottom: "10px" }}
              >
                {pillar.title}
              </h3>
              <div className="w-full h-auto overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
                <img
                  src={pillar.image}
                  alt={pillar.alt}
                  className="w-full h-full block"
                  draggable={false}
                  style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0, boxShadow: "none", display: "block", aspectRatio: "16 / 9", height: "auto" }}
                />
              </div>
              <p
                className="m-0 mx-auto text-[14px] leading-[1.5] md:text-[14px] lg:text-[14px] font-normal text-center text-[#171717]"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, maxWidth: "260px", marginTop: "10px" }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-[24px] w-full">
          <button
            type="button"
            className="flex items-center justify-center bg-[#3B35A3] hover:bg-[#332D92] text-white rounded-none shadow-none focus:outline-none transition-all duration-[160ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer w-full max-w-[220px] md:w-[190px] lg:w-[205px] h-[44px] md:h-[42px] lg:h-[38px] text-[14px] font-semibold leading-[1]"
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
            Explore Sleep Cycles
          </button>
        </div>
      </div>
    </section>
  );
}