"use client";
import SectionTTSButton from "@/components/tts/SectionTTSButton";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTTS } from "@/components/tts/TTSProvider";

const disorderKeys = [
  "insomnia",
  "osa",
  "rls",
  "circadian",
  "narcolepsy",
  "hypersomnia",
  "parasomnias",
  "bruxism",
];

export default function CommonSleepDisordersSection() {
  const t = useTranslations("disorders");
  const { isSpeaking } = useTTS();
  const images: Record<string, string> = {
    insomnia: "/assets/section8/Insomnia.jpg",
    osa: "/assets/section8/Sleep-Apnea.jpg",
    rls: "/assets/section8/Restless-Legs-Syndrome.jpg",
    circadian: "/assets/section8/Circadian-Rhythm-Disorders.jpg",
    narcolepsy: "/assets/section8/Narcolepsy.jpg",
    hypersomnia: "/assets/section8/Hypersomnia.jpg",
    parasomnias: "/assets/section8/Parasomnias.jpg",
    bruxism: "/assets/section8/Bruxism.jpg",
  };
  const total = disorderKeys.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAutoSlid = useRef(false);
  const isSpeakingRef = useRef(isSpeaking);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);

  const next = () => setCurrentIndex((prev) => (prev + 2 >= total ? 0 : prev + 2));
  const prev = () => setCurrentIndex((prev) => (prev - 2 < 0 ? total - 2 : prev - 2));

  const mobileNext = () => setMobileIndex((prev) => (prev + 1 >= total ? 0 : prev + 1));
  const mobilePrev = () => setMobileIndex((prev) => (prev - 1 < 0 ? total - 1 : prev - 1));

  // Auto-slide once when user first scrolls to this section, but not during TTS
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || hasAutoSlid.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoSlid.current) {
            hasAutoSlid.current = true;
            observer.disconnect();
            // Let user see initial cards, then auto-advance after delay
            setTimeout(() => {
              // Skip auto-advance if TTS is currently reading this section
              if (isSpeakingRef.current) return;
              // Advance desktop carousel by one pair
              setCurrentIndex((prev) => (prev + 2 >= total ? 0 : prev + 2));
              // Advance mobile carousel by one
              setMobileIndex((prev) => (prev + 1 >= total ? 0 : prev + 1));
            }, 2000);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="common-sleep-disorders"
      aria-label="Common Sleep Disorders"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
<SectionTTSButton className="absolute top-[18px] right-[18px] z-[5]" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 25 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        }}
      >
        <div className="relative z-[1] mx-auto max-w-[1180px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[36px] md:pt-[40px] lg:pt-[44px] pb-[38px] md:pb-[40px] lg:pb-[44px] min-w-0">
        <h2
          className="m-0 mx-auto text-[clamp(24px,6.5vw,30px)] leading-[1.18] tracking-[-0.02em] md:text-[31px] lg:text-[36px] font-semibold text-center text-[#F59A00]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "8px" }}
        >
 {t("heading")}
        </h2>
        <p
          className="m-0 mx-auto text-[16px] leading-[1.6] md:text-[16px] lg:text-[17px] font-medium text-center text-[#3B35A3]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, maxWidth: "900px", marginBottom: "24px" }}
        >
          {t("sub")}
        </p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
          >
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
                  /* Force LTR track so translateX slide math is stable in RTL pages. */
                  .disorders-slide-track {
                    display: flex;
                    direction: ltr;
                    transition: transform 0.4s ease-in-out;
                    will-change: transform;
                  }
                  .disorders-mobile-track {
                    display: flex;
                    direction: ltr;
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
                  .disorders-slide-card-image {
                    transition: box-shadow 0.3s ease, transform 0.3s ease;
                    overflow: hidden;
                  }
                  .disorders-slide-card-image:hover {
                    box-shadow: 0 8px 24px rgba(53, 49, 155, 0.15);
                    transform: translateY(-3px);
                  }
                  .disorders-slide-card-image img {
                    transition: transform 0.4s ease;
                  }
                  .disorders-slide-card-image:hover img {
                    transform: scale(1.06);
                  }
                  .disorders-mobile-card .disorders-mobile-card-image {
                    transition: box-shadow 0.3s ease, transform 0.3s ease;
                    overflow: hidden;
                  }
                  .disorders-mobile-card .disorders-mobile-card-image:hover {
                    box-shadow: 0 8px 24px rgba(53, 49, 155, 0.15);
                    transform: translateY(-3px);
                  }
                  .disorders-mobile-card .disorders-mobile-card-image img {
                    transition: transform 0.4s ease;
                  }
                  .disorders-mobile-card .disorders-mobile-card-image:hover img {
                    transform: scale(1.06);
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
                          src={images[disorderKeys[pairStart]]}
                          alt={t(`${disorderKeys[pairStart]}.title`)}
                          className="w-full h-full block object-cover"
                          draggable={false}
                          style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0, boxShadow: "none", display: "block" }}
                        />
                      </div>
                      <h3 className="text-[20px] lg:text-[22px] leading-[1.3] font-semibold text-[#3B35A3] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "12px" }}>
                        {t(`${disorderKeys[pairStart]}.title`)}
                      </h3>
                      <p className="text-[16px] lg:text-[17px] leading-[1.45] font-medium text-[#171717] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, marginTop: "5px", maxWidth: "440px" }}>
                        {t(`${disorderKeys[pairStart]}.subtitle`)}
                      </p>
                    </div>
                    <div className="disorders-slide-divider" aria-hidden="true" />
                    <div className="disorders-slide-card">
                      <div className="disorders-slide-card-image">
                        <img
                          src={images[disorderKeys[pairStart + 1]]}
                          alt={t(`${disorderKeys[pairStart + 1]}.title`)}
                          className="w-full h-full block object-cover"
                          draggable={false}
                          style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0, boxShadow: "none", display: "block" }}
                        />
                      </div>
                      <h3 className="text-[20px] lg:text-[22px] leading-[1.3] font-semibold text-[#3B35A3] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "12px" }}>
                        {t(`${disorderKeys[pairStart + 1]}.title`)}
                      </h3>
                      <p className="text-[16px] lg:text-[17px] leading-[1.45] font-medium text-[#171717] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, marginTop: "5px", maxWidth: "440px" }}>
                        {t(`${disorderKeys[pairStart + 1]}.subtitle`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          <button
            type="button"
            aria-label={t("prevAria")}
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
            aria-label={t("nextAria")}
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
                className="flex disorders-mobile-track"
                style={{
                  transform: `translateX(-${mobileIndex * 100}%)`,
                  transition: "transform 0.4s ease-in-out",
                  willChange: "transform",
                }}
              >
                {disorderKeys.map((key) => (
                  <div key={key} className="disorders-mobile-card">
                    <div className="disorders-mobile-card-image">
                      <img
                        src={images[key]}
                        alt={t(`${key}.title`)}
                        className="w-full h-full block object-cover"
                        draggable={false}
                        style={{ objectFit: "cover", objectPosition: "center", borderRadius: 0 }}
                      />
                    </div>
                    <h3 className="text-[20px] leading-[1.3] font-semibold text-[#3B35A3] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, marginTop: "12px" }}>
                      {t(`${key}.title`)}
                    </h3>
                    <p className="text-[16px] leading-[1.45] font-medium text-[#171717] text-left" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, marginTop: "5px" }}>
                      {t(`${key}.subtitle`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center gap-[12px] mt-[4px]">
              <motion.button
                type="button"
                aria-label={t("prevAria")}
                onClick={mobilePrev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex w-[42px] h-[42px] rounded-full bg-[#6F6F6F] text-white border-none items-center justify-center focus:outline-none cursor-pointer"
                style={{ borderRadius: "9999px", background: "#6F6F6F", boxShadow: "0 2px 6px rgba(0,0,0,0.12)", width: "42px", height: "42px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>
              <motion.button
                type="button"
                aria-label={t("nextAria")}
                onClick={mobileNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex w-[42px] h-[42px] rounded-full bg-[#6F6F6F] text-white border-none items-center justify-center focus:outline-none cursor-pointer"
                style={{ borderRadius: "9999px", background: "#6F6F6F", boxShadow: "0 2px 6px rgba(0,0,0,0.12)", width: "42px", height: "42px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            </div>
          </div>
          </div>
          </motion.div>

        <div className="flex items-center justify-center text-center bg-[rgba(255,255,255,0.92)] border-[1.5px] border-[#E4B93D] rounded-none mx-auto mt-[18px] px-[14px] md:px-[20px] lg:px-[24px] py-[12px] md:py-[10px] lg:py-[10px] min-h-[48px] w-full md:w-[calc(100%-80px)] lg:w-[calc(100%-120px)] min-w-0" style={{ borderRadius: 0, width: "100%", fontSize: "14px", lineHeight: "1.45", padding: "12px 14px" }}>
          <p className="m-0 text-[16px] leading-[1.45] md:text-[16px] lg:text-[17px] font-semibold text-[#171717] text-center" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                        {t("bottom")}
          </p>
        </div>
      </div>
      </motion.div>
    </section>
  );
}