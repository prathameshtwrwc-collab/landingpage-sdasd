"use client";

import React, { useState } from "react";

const disorders = [
  {
    title: "Insomnia",
    image: "/assets/section8/Insomnia.jpg",
    subtitle: "Difficulty falling asleep, staying asleep, or waking too early despite having the opportunity to sleep.",
  },
  {
    title: "Obstructive Sleep Apnea (OSA)",
    image: "/assets/section8/Sleep-Apnea.jpg",
    subtitle: "Repeated interruptions in breathing caused by temporary airway collapse during sleep.",
  },
  {
    title: "Restless Legs Syndrome (RLS)",
    image: "/assets/section8/Restless-Legs-Syndrome.jpg",
    subtitle: "An uncomfortable urge to move the legs, often worsening during the evening and night.",
  },
  {
    title: "Circadian Rhythm Disorders",
    image: "/assets/section8/Circadian-Rhythm-Disorders.jpg",
    subtitle: "Disruptions in the body's natural clock, including shift-work disorder, jet lag, delayed sleep phase, and advanced sleep phase.",
  },
  {
    title: "Narcolepsy",
    image: "/assets/section8/Narcolepsy.jpg",
    subtitle: "A neurological condition characterized by excessive daytime sleepiness and sudden sleep episodes.",
  },
  {
    title: "Hypersomnia",
    image: "/assets/section8/Hypersomnia.jpg",
    subtitle: "Persistent excessive sleepiness despite adequate sleep duration.",
  },
  {
    title: "Parasomnias",
    image: "/assets/section8/Parasomnias.jpg",
    subtitle: "Sleepwalking, sleep talking, nightmares, night terrors, and REM behaviour disorders.",
  },
  {
    title: "Bruxism",
    image: "/assets/section8/Bruxism.jpg",
    subtitle: "Grinding or clenching of teeth during sleep.",
  },
];

export default function CommonSleepDisordersSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 2 >= disorders.length ? 0 : prev + 2));
  const prev = () => setCurrentIndex((prev) => (prev - 2 < 0 ? disorders.length - 2 : prev - 2));

  const mobileNext = () => setMobileIndex((prev) => (prev + 1 >= disorders.length ? 0 : prev + 1));
  const mobilePrev = () => setMobileIndex((prev) => (prev - 1 < 0 ? disorders.length - 1 : prev - 1));

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
          className="m-0 mx-auto text-[clamp(28px,7vw,34px)] leading-[1.18] tracking-[-0.02em] md:text-[31px] lg:text-[36px] font-semibold text-center text-[#F59A00]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "8px" }}
        >
Common Sleep Disorders - 8 Types
        </h2>
        <p
          className="m-0 mx-auto text-[16px] leading-[1.6] md:text-[16px] lg:text-[17px] font-medium text-center text-[#3B35A3]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, maxWidth: "900px", marginBottom: "24px" }}
        >
          Sleep disorders can affect sleep quality, daytime functioning, productivity, emotional well-being, and long-term health.
        </p>

          <div
            className="relative w-full overflow-hidden min-w-0"
            style={{
              minHeight: "430px",
              background: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url("/assets/section8/card-grid-bg.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  .disorders-slide-container {
                    overflow: hidden;
                    width: 100%;
                  }
                  .disorders-slide-track {
                    display: flex;
                    transition: transform 0.4s ease-in-out;
                    will-change: transform;
                  }
                  .disorders-slide-pair {
                    width: 100%;
                    flex: 0 0 100%;
                    display: grid;
                    grid-template-columns: 1fr 2px 1fr;
                    gap: 0;
                    align-items: start;
                    padding: 36px 52px 28px;
                    min-width: 0;
                  }
                  .disorders-slide-card {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    min-width: 0;
                    padding-right: 20px;
                  }
                  .disorders-slide-card:last-child {
                    padding-right: 0;
                    padding-left: 20px;
                  }
                  .disorders-slide-card-image {
                    width: 100%;
                    height: 240px;
                    overflow: hidden;
                    background: #F4F4F4;
                    min-width: 0;
                  }
                  .disorders-slide-divider {
                    width: 2px;
                    height: auto;
                    min-height: 320px;
                    background: #F59A00;
                    align-self: stretch;
                  }
                  .disorders-mobile-card {
                    width: 100%;
                    flex: 0 0 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 20px;
                    min-width: 0;
                  }
                  .disorders-mobile-card-image {
                    width: 100%;
                    overflow: hidden;
                    background: #F4F4F4;
                    min-width: 0;
                    aspect-ratio: 4 / 3;
                  }
                  @media(min-width:1024px){
                    .disorders-slide-card-image { height: 280px; }
                    .disorders-slide-pair { padding: 48px 70px 32px; }
                    .disorders-slide-divider { min-height: 350px; }
                  }
                `,
              }}
            />

            <div className="hidden md:block disorders-slide-container">
              <div
                className="disorders-slide-track"
                style={{ transform: `translateX(-${(currentIndex / 2) * 100}%)` }}
              >
                {[0, 2, 4, 6].map((pairStart) => (
                  <div key={pairStart} className="disorders-slide-pair">
                    <div className="disorders-slide-card">
                      <div className="disorders-slide-card-image">
                        <img
                          src={disorders[pairStart].image}
                          alt={`${disorders[pairStart].title} illustration`}
                          className="w-full h-full block object-cover"
                          draggable={false}
                          style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0, boxShadow: "none", display: "block" }}
                        />
                      </div>
                      <h3 className="text-[20px] lg:text-[22px] leading-[1.3] font-semibold text-[#3B35A3] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "12px" }}>
                        {disorders[pairStart].title}
                      </h3>
                      <p className="text-[16px] lg:text-[17px] leading-[1.45] font-medium text-[#171717] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, marginTop: "5px", maxWidth: "440px" }}>
                        {disorders[pairStart].subtitle}
                      </p>
                    </div>
                    <div className="disorders-slide-divider" aria-hidden="true" />
                    <div className="disorders-slide-card">
                      <div className="disorders-slide-card-image">
                        <img
                          src={disorders[pairStart + 1].image}
                          alt={`${disorders[pairStart + 1].title} illustration`}
                          className="w-full h-full block object-cover"
                          draggable={false}
                          style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0, boxShadow: "none", display: "block" }}
                        />
                      </div>
                      <h3 className="text-[20px] lg:text-[22px] leading-[1.3] font-semibold text-[#3B35A3] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "12px" }}>
                        {disorders[pairStart + 1].title}
                      </h3>
                      <p className="text-[16px] lg:text-[17px] leading-[1.45] font-medium text-[#171717] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, marginTop: "5px", maxWidth: "440px" }}>
                        {disorders[pairStart + 1].subtitle}
                      </p>
                    </div>
                  </div>
                ))}
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

          <div className="block md:hidden w-full min-w-0">
            <div className="w-full overflow-hidden min-w-0">
              <div
                className="flex"
                style={{
                  transform: `translateX(-${mobileIndex * 100}%)`,
                  transition: "transform 0.4s ease-in-out",
                  willChange: "transform",
                }}
              >
                {disorders.map((disorder) => (
                  <div key={disorder.title} className="disorders-mobile-card">
                    <div className="disorders-mobile-card-image">
                      <img
                        src={disorder.image}
                        alt={`${disorder.title} illustration`}
                        className="w-full h-full block object-cover"
                        draggable={false}
                        style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0 }}
                      />
                    </div>
                    <h3 className="text-[20px] leading-[1.3] font-semibold text-[#3B35A3] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "12px" }}>
                      {disorder.title}
                    </h3>
                    <p className="text-[16px] leading-[1.45] font-medium text-[#171717] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, marginTop: "5px" }}>
                      {disorder.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center gap-[12px] mt-[4px]">
              <button
                type="button"
                aria-label="Previous sleep disorder"
                onClick={mobilePrev}
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
                onClick={mobileNext}
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
          <p className="m-0 text-[16px] leading-[1.45] md:text-[16px] lg:text-[17px] font-semibold text-[#171717] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
            Not all sleep problems look the same. Recognizing the signs is the first step toward improvement.
          </p>
        </div>
      </div>
    </section>
  );
}