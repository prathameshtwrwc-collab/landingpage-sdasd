"use client";

import React from "react";

export default function HeroStatementStrip() {
  return (
    <section
      aria-label="Sleep education statement"
      className="relative w-full overflow-hidden flex items-center justify-center h-auto md:min-h-[230px]"
      style={{ backgroundColor: "#353080", minHeight: undefined }}
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url("/images/hero/statement-background.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          filter: "blur(0.5px) saturate(0.85)",
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background: `linear-gradient(180deg, rgba(53,48,128,0.96) 0%, rgba(42,37,112,0.98) 100%)`,
        }}
      />

      {/* Content - compact, max 980px - mobile height auto padding 34 20 */}
      <div
        className="
          relative z-[2] w-full max-w-[980px] mx-auto
          px-[20px] md:px-[24px]
          py-[34px] md:py-[38px]
          text-center
          max-[389px]:px-[16px]
        "
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
        }}
      >
        <p
          className="m-0 text-white tracking-[-0.01em] text-[16px] leading-[1.55] md:text-[18px] md:leading-[1.5]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
        >
          Sleep powers your{" "}
          <span style={{ fontWeight: 600, color: "#FFD21A" }}>
            Health, Mind, Performance, Recovery, and Longevity.
          </span>
        </p>

        <p
          className="mt-[6px] text-white tracking-[-0.01em] text-[16px] leading-[1.55] md:text-[18px] md:leading-[1.5] max-w-[900px]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
        >
          Every night, your brain and body perform essential processes that
          <br className="hidden md:block" />
          influence how you{" "}
          <span style={{ fontWeight: 600, color: "#FFD21A" }}>
            Think, Feel, Learn, Work, Communicate,
          </span>
          <br className="hidden lg:block" />
          <span style={{ fontWeight: 600 }}>and perform throughout the day.</span>
        </p>

        <p
          className="mt-[16px] md:mt-[14px] text-white uppercase tracking-[-0.01em] text-[21px] leading-[1.25] md:text-[22px] md:leading-[1.2] max-w-[900px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          YOUR DAYS ARE ONLY AS POWERFUL AS YOUR NIGHTS.
        </p>
      </div>
    </section>
  );
}
