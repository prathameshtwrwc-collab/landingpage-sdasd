"use client";

import React, { useState } from "react";

const disorders = [
  {
    title: "Insomnia",
    image: "/assets/section8/Insomnia.jpg",
    subtitle: "Placeholder subtitle for insomnia",
  },
  {
    title: "Sleep Apnea",
    image: "/assets/section8/Sleep-Apnea.jpg",
    subtitle: "Placeholder subtitle for sleep apnea",
  },
  {
    title: "Restless Legs Syndrome",
    image: "/assets/section8/Restless-Legs-Syndrome.jpg",
    subtitle: "Placeholder subtitle for RLS",
  },
  {
    title: "Circadian Rhythm Disorders",
    image: "/assets/section8/Circadian-Rhythm-Disorders.jpg",
    subtitle: "Placeholder subtitle for circadian disorders",
  },
  {
    title: "Narcolepsy",
    image: "/assets/section8/Narcolepsy.jpg",
    subtitle: "Placeholder subtitle for narcolepsy",
  },
  {
    title: "Hypersomnia",
    image: "/assets/section8/Hypersomnia.jpg",
    subtitle: "Placeholder subtitle for hypersomnia",
  },
  {
    title: "Parasomnias",
    image: "/assets/section8/Parasomnias.jpg",
    subtitle: "Placeholder subtitle for parasomnias",
  },
  {
    title: "Bruxism",
    image: "/assets/section8/Bruxism.jpg",
    subtitle: "Placeholder subtitle for bruxism",
  },
];

export default function CommonSleepDisordersSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex((prev) => (prev === 0 ? disorders.length - 1 : prev - 1));
  const next = () => setCurrentIndex((prev) => (prev === disorders.length - 1 ? 0 : prev + 1));

  const current = disorders[currentIndex];

  return (
    <section
      id="common-sleep-disorders"
      aria-label="Common Sleep Disorders"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <div className="relative z-[1] mx-auto max-w-[1180px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[36px] md:pt-[40px] lg:pt-[44px] pb-[38px] md:pb-[40px] lg:pb-[44px] min-w-0">
        <h2
          className="m-0 mx-auto text-[clamp(23px,7vw,28px)] leading-[1.18] tracking-[-0.02em] md:text-[27px] lg:text-[30px] font-semibold text-center text-[#F59A00]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "8px" }}
        >
          Common Sleep Disorders
        </h2>
        <p
          className="m-0 mx-auto text-[14px] leading-[1.6] md:text-[14px] lg:text-[15px] font-medium text-center text-[#3B35A3]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, maxWidth: "900px", marginBottom: "24px" }}
        >
          Sleep disorders can influence sleep quality, daytime functioning, productivity, emotional well-being, and long-term health.
        </p>

        <div
          className="relative w-full overflow-hidden min-w-0"
          style={{
            minHeight: "430px",
            background: `linear-gradient(rgba(255,255,255,0.84), rgba(255,255,255,0.84)), url("/assets/section8/card-grid-bg.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="hidden md:grid md:grid-cols-[1fr_2px_1fr] gap-[20px] lg:gap-[28px] items-start p-[36px_52px_28px] lg:p-[48px_70px_32px] w-full min-w-0">
            <div className="w-full flex flex-col items-start min-w-0">
              <div className="w-full h-[240px] lg:h-[280px] overflow-hidden bg-[#F4F4F4] min-w-0">
                <img
                  src={current.image}
                  alt={`${current.title} illustration`}
                  className="w-full h-full block object-cover"
                  draggable={false}
                  style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0, boxShadow: "none", display: "block" }}
                />
              </div>
              <h3 className="text-[18px] lg:text-[20px] leading-[1.3] font-semibold text-[#3B35A3] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "12px" }}>
                {current.title}
              </h3>
              <p className="text-[14px] lg:text-[15px] leading-[1.45] font-normal text-[#171717] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginTop: "5px", maxWidth: "440px" }}>
                {current.subtitle}
              </p>
            </div>
            <div className="w-[2px] h-[320px] bg-[#F59A00] self-center" aria-hidden="true" />
            <div className="w-full flex flex-col items-start min-w-0">
              <div className="w-full h-[240px] lg:h-[280px] overflow-hidden bg-[#F4F4F4] min-w-0">
                <img
                  src={disorders[(currentIndex + 1) % disorders.length].image}
                  alt={`${disorders[(currentIndex + 1) % disorders.length].title} illustration`}
                  className="w-full h-full block object-cover"
                  draggable={false}
                  style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0, boxShadow: "none", display: "block" }}
                />
              </div>
              <h3 className="text-[18px] lg:text-[20px] leading-[1.3] font-semibold text-[#3B35A3] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "12px" }}>
                {disorders[(currentIndex + 1) % disorders.length].title}
              </h3>
              <p className="text-[14px] lg:text-[15px] leading-[1.45] font-normal text-[#171717] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginTop: "5px", maxWidth: "440px" }}>
                {disorders[(currentIndex + 1) % disorders.length].subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous sleep disorder"
            onClick={prev}
            className="hidden md:flex absolute left-[12px] lg:left-[14px] top-[48px] translate-y-[120px] lg:translate-y-[140px] w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#6F6F6F] text-white border-none items-center justify-center focus:outline-none cursor-pointer"
            style={{ borderRadius: "9999px", background: "#6F6F6F", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next sleep disorder"
            onClick={next}
            className="hidden md:flex absolute right-[12px] lg:right-[14px] top-[48px] translate-y-[120px] lg:translate-y-[140px] w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#6F6F6F] text-white border-none items-center justify-center focus:outline-none cursor-pointer"
            style={{ borderRadius: "9999px", background: "#6F6F6F", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="block md:hidden w-full p-[20px] min-w-0">
            <div className="w-full flex flex-col items-start min-w-0">
              <div className="w-full overflow-hidden bg-[#F4F4F4] min-w-0" style={{ aspectRatio: "4 / 3", height: "auto" }}>
                <img
                  src={current.image}
                  alt={`${current.title} illustration`}
                  className="w-full h-full block object-cover"
                  draggable={false}
                  style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0, aspectRatio: "4 / 3", height: "auto" }}
                />
              </div>
              <h3 className="text-[18px] leading-[1.3] font-semibold text-[#3B35A3] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "12px" }}>
                {current.title}
              </h3>
              <p className="text-[14px] leading-[1.45] font-normal text-[#171717] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, marginTop: "5px" }}>
                {current.subtitle}
              </p>
            </div>

            <div className="w-full h-[2px] bg-[#F59A00] my-[24px]" aria-hidden="true" />

            <div className="flex justify-center items-center gap-[12px] mt-[20px]">
              <button
                type="button"
                aria-label="Previous sleep disorder"
                onClick={prev}
                className="flex w-[42px] h-[42px] rounded-full bg-[#6F6F6F] text-white border-none items-center justify-center focus:outline-none cursor-pointer"
                style={{ borderRadius: "9999px", background: "#6F6F6F", boxShadow: "0 2px 6px rgba(0,0,0,0.12)", width: "42px", height: "42px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next sleep disorder"
                onClick={next}
                className="flex w-[42px] h-[42px] rounded-full bg-[#6F6F6F] text-white border-none items-center justify-center focus:outline-none cursor-pointer"
                style={{ borderRadius: "9999px", background: "#6F6F6F", boxShadow: "0 2px 6px rgba(0,0,0,0.12)", width: "42px", height: "42px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center text-center bg-[rgba(255,255,255,0.92)] border-[1.5px] border-[#E4B93D] rounded-none mx-auto mt-[18px] px-[14px] md:px-[20px] lg:px-[24px] py-[12px] md:py-[10px] lg:py-[10px] min-h-[48px] w-full md:w-[calc(100%-80px)] lg:w-[calc(100%-120px)] min-w-0" style={{ borderRadius: 0, width: "100%", fontSize: "14px", lineHeight: "1.45", padding: "12px 14px" }}>
          <p className="m-0 text-[14px] leading-[1.45] md:text-[14px] lg:text-[15px] font-semibold text-[#171717] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
            Understanding the signs is the first step toward better sleep and better outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}