"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useAssessment } from "@/components/assessment/AssessmentContext";
import { useConsult } from "@/components/consult/ConsultContext";

const desktopBgImages = [
  "/assets/hero/hero-bg.png",
  "/assets/hero/bg2.png",
];

const mobileBgImages = [
  "/assets/hero/hero-bg-mobile1.png",
  "/assets/hero/hero-bg-mobile2.png",
];

const totalDesktopSlides = desktopBgImages.length;
const desktopSlideImages = [...desktopBgImages, desktopBgImages[0]];
const totalDesktopSlideItems = desktopSlideImages.length;

const totalMobileSlides = mobileBgImages.length;
const mobileSlideImages = [...mobileBgImages, mobileBgImages[0]];
const totalMobileSlideItems = mobileSlideImages.length;

const benefitSets = [
  ["/assets/hero/benefit-1.png", "/assets/hero/benefit-2.png", "/assets/hero/benefit-3.png"],
  ["/assets/hero/benefit-4.png", "/assets/hero/benefit-5.png", "/assets/hero/benefit-6.png"],
];

export default function HeroSection() {
  const { open: openAssessment } = useAssessment();
  const { open: openConsult } = useConsult();

  const scrollToSleepCycles = () => {
    const el = document.getElementById("understanding-sleep-cycles");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const isTransitioning = useRef(false);

  const next = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setTransitionEnabled(true);
    setCurrentSlide((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= totalDesktopSlideItems - 1) {
        setTimeout(() => {
          setTransitionEnabled(false);
          setCurrentSlide(0);
          isTransitioning.current = false;
        }, 700);
        return nextIdx;
      }
      setTimeout(() => { isTransitioning.current = false; }, 700);
      return nextIdx;
    });
  }, []);

  const prev = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setTransitionEnabled(true);
    setCurrentSlide((prev) => {
      const prevIdx = prev - 1;
      if (prevIdx < 0) {
        setTimeout(() => {
          setTransitionEnabled(false);
          setCurrentSlide(totalDesktopSlides - 1);
          isTransitioning.current = false;
        }, 700);
        return totalDesktopSlideItems - 1;
      }
      setTimeout(() => { isTransitioning.current = false; }, 700);
      return prevIdx;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    const allImages = [...desktopBgImages, ...mobileBgImages];
    allImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
    return () => {
      document.querySelectorAll('link[rel="preload"][as="image"]').forEach((el) => {
        try { document.head.removeChild(el); } catch {}
      });
    };
  }, []);

  return (
    <section
      id="hero-section"
      aria-label="Sleep is the Foundation hero"
      className="hero-section relative w-full overflow-hidden bg-white min-h-[680px]"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ===== DESKTOP / TABLET — UNTOUCHED ===== */
            @media (min-width: 768px) and (max-width: 1023px) {
              .hero-section { min-height: 620px !important; }
              .hero-inner { min-height: 620px !important; padding: 88px 32px 30px !important; }
              .hero-content { width: 500px !important; max-width: 56% !important; min-width: 0 !important; padding-bottom: 24px !important; }
              .hero-heading-orange { font-size: clamp(46px, 5.3vw, 56px) !important; }
              .hero-heading-indigo { font-size: clamp(42px, 4.9vw, 52px) !important; }
              .hero-benefits { margin-top: 34px !important; }
              .hero-benefit-label { font-size: 18px !important; }
              .hero-actions { margin-top: 28px !important; }
              .hero-actions button { font-size: 15px !important; }
            }
            @media (min-width: 1024px) {
              .hero-section { min-height: 680px !important; }
              .hero-inner { min-height: 680px !important; padding: 96px 64px 34px !important; }
              .hero-content { width: 610px !important; max-width: 44% !important; min-width: 560px !important; padding-bottom: 24px !important; }
              .hero-heading-orange { font-size: clamp(60px, 4.6vw, 72px) !important; }
              .hero-heading-indigo { font-size: clamp(55px, 4.15vw, 66px) !important; margin-top: 12px !important; }
            }
            @media (min-width: 1440px) {
              .hero-section { min-height: 680px !important; }
            }

            /* ===== MOBILE ONLY — ABSOLUTE ZONE LAYOUT ===== */
            @media (max-width: 767px) {
              .hero-section {
                min-height: 930px !important;
                height: 930px !important;
                background-image: none !important;
                background-color: #ffffff;
                padding-top: 0 !important;
              }

              .hero-section::before {
                content: "";
                position: absolute;
                inset: 0;
                z-index: 1 !important;
                pointer-events: none;
                background:
                  linear-gradient(
                    180deg,
                    rgba(255,255,255,0.18) 0%,
                    rgba(255,255,255,0.04) 32%,
                    rgba(255,255,255,0.00) 52%,
                    rgba(255,255,255,0.34) 78%,
                    rgba(255,255,255,0.94) 100%
                  ),
                  linear-gradient(
                    90deg,
                    rgba(255,255,255,0.96) 0%,
                    rgba(255,255,255,0.78) 38%,
                    rgba(255,255,255,0.20) 62%,
                    rgba(255,255,255,0) 100%
                  );
              }

              .hero-mobile-bg {
                display: block !important;
              }

              .hero-mobile-bg .hero-bg-slide {
                background-position: 80% top !important;
              }

              .hero-inner {
                width: 100% !important;
                height: 100% !important;
                min-height: 0 !important;
                padding: 0 22px !important;
                display: block !important;
                position: relative !important;
                z-index: 2 !important;
                max-width: none !important;
                margin: 0 !important;
              }

              .hero-content {
                width: 100% !important;
                height: 100% !important;
                min-height: 0 !important;
                display: block !important;
                padding: 0 !important;
                position: relative !important;
                max-width: none !important;
              }

              .hero-heading {
                position: absolute !important;
                top: 220px !important;
                left: 0 !important;
                width: 320px !important;
                max-width: calc(100vw - 44px) !important;
                margin: 0 !important;
                padding: 0 !important;
                text-align: left !important;
                z-index: 2 !important;
              }

              .hero-heading-orange {
                font-size: clamp(36px, 9.5vw, 44px) !important;
                line-height: 1.04 !important;
                font-weight: 800 !important;
                letter-spacing: -0.035em !important;
              }

              .hero-heading-indigo {
                margin-top: 8px !important;
                font-size: clamp(31px, 8vw, 37px) !important;
                line-height: 1.09 !important;
                font-weight: 700 !important;
                letter-spacing: -0.03em !important;
              }

              .hero-line-chronotype {
                position: relative !important;
                display: inline-block !important;
                white-space: nowrap !important;
                z-index: 1 !important;
              }

              .hero-line-chronotype::after {
                content: "" !important;
                position: absolute !important;
                right: 0 !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                width: 3.2em !important;
                height: 1.4em !important;
                background: rgba(255, 255, 255, 0.6) !important;
                border-radius: 999px !important;
                filter: blur(10px) !important;
                pointer-events: none !important;
                z-index: -1 !important;
              }

              .hero-benefits {
                position: absolute !important;
                left: 0 !important;
                right: 0 !important;
                top: 560px !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                display: grid !important;
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                gap: 0 !important;
                z-index: 2 !important;
              }

              .hero-benefit {
                position: relative !important;
                min-width: 0 !important;
                isolation: isolate !important;
                z-index: 10 !important;
              }

              .hero-benefit-media {
                width: clamp(80px, 21.5vw, 94px) !important;
                height: clamp(80px, 21.5vw, 94px) !important;
                flex-basis: auto !important;
                border-radius: 50% !important;
                overflow: hidden !important;
                background: #ffffff !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                isolation: isolate !important;
              }
              .hero-benefit-media img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                object-position: center !important;
                display: block !important;
                background: #ffffff !important;
              }

              .hero-benefit-label {
                margin-top: 11px !important;
                font-size: clamp(14px, 4vw, 17px) !important;
                line-height: 1.12 !important;
                font-weight: 700 !important;
              }

              .hero-benefit:not(:last-child)::after {
                content: "" !important;
                position: absolute !important;
                top: 0 !important;
                right: 0 !important;
                width: 1.5px !important;
                height: 112px !important;
                background: #E4B93D !important;
              }

              .hero-actions {
                position: absolute !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 26px !important;
                width: 100% !important;
                margin: 0 !important;
                display: grid !important;
                grid-template-columns: 1fr !important;
                gap: 11px !important;
                z-index: 4 !important;
              }

              .hero-actions button {
                width: 100% !important;
                min-height: 56px !important;
                height: auto !important;
                padding: 15px 16px !important;
                border-radius: 8px !important;
                font-size: 16px !important;
                line-height: 1.2 !important;
                font-weight: 700 !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                text-align: center !important;
              }

              .hero-mobile-visual {
                display: none !important;
              }

              .hero-arrow {
                display: none !important;
              }
            }
            @media (max-width: 359px) {
              .hero-section { min-height: 890px !important; height: 890px !important; }
              .hero-heading { top: 210px !important; width: 290px !important; }
              .hero-benefits { top: 530px !important; }
              .hero-benefit-media { width: 74px !important; height: 74px !important; border-radius: 50% !important; overflow: hidden !important; background: #ffffff !important; display: flex !important; align-items: center !important; justify-content: center !important; }
              .hero-benefit-media img { width: 100% !important; height: 100% !important; object-fit: cover !important; object-position: center !important; background: #ffffff !important; }
              .hero-benefit:not(:last-child)::after { height: 102px !important; }
              .hero-actions { bottom: 20px !important; gap: 9px !important; }
              .hero-actions button { min-height: 52px !important; padding: 13px 14px !important; font-size: 15px !important; }
            }
            @media (min-width: 360px) and (max-width: 389px) {
              .hero-heading { top: 215px !important; width: 290px !important; }
            }
            @media (min-width: 390px) and (max-width: 429px) {
              .hero-heading { top: 218px !important; width: 310px !important; }
              .hero-benefits { top: 550px !important; }
              .hero-benefit:not(:last-child)::after { height: 110px !important; }
              .hero-actions { bottom: 24px !important; }
            }
            @media (min-width: 430px) and (max-width: 767px) {
              .hero-section { min-height: 960px !important; height: 960px !important; }
              .hero-heading { width: 340px !important; }
              .hero-benefits { top: 575px !important; }
              .hero-actions { bottom: 28px !important; }
            }

            /* ===== BASE (all breakpoints) ===== */
            .hero-heading-orange {
              color: #ff6500;
              font-size: clamp(60px, 4.6vw, 72px);
              line-height: 1.01;
              font-weight: 700;
              letter-spacing: -0.045em;
              display: block;
              margin: 0;
            }
            .hero-heading-indigo {
              display: block;
              margin-top: 12px;
              color: #35319b;
              font-size: clamp(55px, 4.15vw, 66px);
              line-height: 1.03;
              font-weight: 600;
              letter-spacing: -0.043em;
            }
            .hero-line { display: block; }
            @media (min-width: 1024px) {
              .hero-line-chronotype { white-space: nowrap; }
            }
            .hero-benefits {
              width: 100%;
              max-width: 720px;
              margin-top: 48px;
              display: grid;
              grid-template-columns: 210px 210px 270px;
              align-items: start;
              gap: 7px;
            }
            .hero-benefit {
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              text-align: center;
              min-width: 0;
              isolation: isolate;
              z-index: 10;
            }
            .hero-benefit-media {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 128px;
              height: 128px;
              flex: 0 0 128px;
              overflow: hidden;
              border-radius: 50%;
              background: #ffffff;
              isolation: isolate;
            }
            .hero-benefit-media img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
              background: #ffffff;
              transition: transform 0.25s ease;
            }
            .hero-benefit-media:hover img {
              transform: scale(1.08) !important;
            }
            .hero-benefit:not(:last-child)::after {
              content: "";
              position: absolute;
              top: 6px;
              right: -4px;
              width: 1.5px;
              height: 144px;
              background: #e4b93d;
            }
            .hero-benefit-label {
              width: 100%;
              margin-top: 11px;
              font-size: 22px;
              line-height: 1.15;
              font-weight: 600;
              text-align: center;
              white-space: normal;
            }
            .hero-actions {
              width: 100%;
              max-width: 720px;
              margin-top: 38px;
              display: grid;
              grid-template-columns: 210px 210px 270px;
              gap: 7px;
            }
            .hero-actions button {
              width: 100%;
              height: 48px;
              border-radius: 0;
              font-size: 17px;
              font-weight: 600;
            }
            .hero-bg-track {
              display: flex;
              height: 100%;
              transition: transform 0.7s ease-in-out;
              will-change: transform;
            }
            .hero-bg-slide {
              width: 100%;
              height: 100%;
              flex: 0 0 100%;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center top;
              animation: heroBgFadeIn 0.6s ease-out;
            }
            @keyframes heroBgFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .hero-arrow {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              z-index: 3;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: rgba(0,0,0,0.18);
              backdrop-filter: blur(4px);
              border: none;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background 0.2s, transform 0.2s;
            }
            .hero-arrow:hover {
              background: rgba(0,0,0,0.3);
              transform: translateY(-50%) scale(1.08);
            }
            .hero-arrow:active {
              transform: translateY(-50%) scale(0.95);
            }
            @keyframes benefitFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `,
        }}
      />

      {/* DESKTOP background slider (hidden on mobile) */}
      <div className="hidden md:block absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
        <div
          className="hero-bg-track"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: transitionEnabled ? "transform 0.7s ease-in-out" : "none",
            willChange: "transform",
          }}
        >
          {desktopSlideImages.map((src, idx) => (
            <div
              key={idx}
              className="hero-bg-slide"
              style={{ backgroundImage: `url("${src}")`, backgroundColor: "#eef9fd" }}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP readability overlay (hidden on mobile) */}
      <div
        className="hidden md:block absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.91) 27%, rgba(255,255,255,0.48) 43%, rgba(255,255,255,0.08) 58%, rgba(255,255,255,0) 70%)`,
        }}
      />

      {/* MOBILE background slider (hidden on desktop) */}
      <div
        className="hero-mobile-bg absolute inset-0 z-0 pointer-events-none select-none md:hidden"
        aria-hidden="true"
      >
        <div
          className="hero-bg-track"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: transitionEnabled ? "transform 0.7s ease-in-out" : "none",
            willChange: "transform",
          }}
        >
          {mobileSlideImages.map((src, idx) => (
            <div
              key={idx}
              className="hero-bg-slide"
              style={{ backgroundImage: `url("${src}")`, backgroundColor: "#eef9fd" }}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP arrows (hidden on mobile) */}
      <button type="button" aria-label="Previous slide" onClick={prev} className="hero-arrow left-arrow hidden md:flex" style={{ left: "12px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button type="button" aria-label="Next slide" onClick={next} className="hero-arrow right-arrow hidden md:flex" style={{ right: "12px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Content — desktop and mobile */}
      <div className="hero-inner relative z-[2] w-full max-w-[1440px] mx-auto min-w-0">
        <div className="hero-content">
          <h1 className="hero-heading m-0 p-0">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              className="hero-heading-orange"
            >
              <span className="hero-line">Sleep is the</span>
              <span className="hero-line">Foundation.</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
              className="hero-heading-indigo"
            >
              <span className="hero-line hero-line-chronotype">Sleep Chronotype</span>
              <span className="hero-line">is the Blueprint.</span>
            </motion.span>
          </h1>

          <motion.div
            key={currentSlide % totalDesktopSlides}
            className="hero-benefits"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
          >
            {benefitSets[currentSlide % totalDesktopSlides].map((src, imgIdx) => (
              <motion.div
                key={imgIdx}
                className="hero-benefit"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 + imgIdx * 0.08 }}
              >
                <div className="hero-benefit-media">
                  <img
                    src={src}
                    alt=""
                    draggable={false}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    className={`hero-benefit-img hero-benefit-img-${imgIdx}`}
                    style={{
                      transform: imgIdx === 2 ? "scale(1.25)" : imgIdx === 1 ? "scale(1.1)" : "scale(1.08)",
                    }}
                  />
                </div>
                <p className="hero-benefit-label" style={{ color: imgIdx === 1 ? "#37329D" : "#FF9700" }}>
                  {imgIdx === 0 ? "Better Sleep" : imgIdx === 1 ? "Better Energy" : "Better Life"}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="hero-actions">
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
              type="button" onClick={openAssessment} className="flex items-center justify-center bg-[#3A34A3] hover:bg-[#322e8e] text-white text-[17px] font-semibold leading-[1] tracking-[-0.01em] px-[18px] rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9700] focus-visible:ring-offset-2 transition-all duration-[180ms] hover:-translate-y-[1px] hover:brightness-[0.96] cursor-pointer" style={{ fontWeight: 600, borderRadius: 0 }}>
              Take Test Now
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.65 }}
              type="button" onClick={scrollToSleepCycles} className="flex items-center justify-center bg-[#e67300] hover:bg-[#cc6500] text-white text-[17px] font-semibold leading-[1] tracking-[-0.01em] px-[18px] rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9700] focus-visible:ring-offset-2 transition-all duration-[180ms] hover:-translate-y-[1px] cursor-pointer" style={{ fontWeight: 600, borderRadius: 0 }}>
              Learn About Sleep
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.75 }}
              type="button" onClick={openConsult} className="flex items-center justify-center bg-[#e67300] hover:bg-[#cc6500] text-white text-[17px] font-semibold leading-[1] tracking-[-0.01em] px-[18px] rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9700] focus-visible:ring-offset-2 transition-all duration-[180ms] hover:-translate-y-[1px] cursor-pointer" style={{ fontWeight: 600, borderRadius: 0 }}>
              Consult a Sleep Specialist
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
