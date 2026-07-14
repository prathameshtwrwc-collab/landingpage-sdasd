"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAssessment } from "@/components/assessment/AssessmentContext";
import { useConsult } from "@/components/consult/ConsultContext";

const bgImages = [
  "/assets/hero/hero-bg.png",
  "/assets/hero/bg2.png",
];

const totalSlides = bgImages.length;
const slideImages = [...bgImages, bgImages[0]];
const totalSlideItems = slideImages.length;

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
      if (nextIdx >= totalSlideItems - 1) {
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
          setCurrentSlide(totalSlides - 1);
          isTransitioning.current = false;
        }, 700);
        return totalSlideItems - 1;
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
    slideImages.forEach((src) => {
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
      aria-label="Sleep is the Foundation hero"
      className="hero-section relative w-full overflow-hidden bg-white pt-[64px] md:pt-[68px] lg:pt-[72px] min-h-[680px]"
      style={{ fontFamily: "Poppins, var(--font-poppins), sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (min-width: 768px) and (max-width: 1023px) {
              .hero-section { min-height: 620px !important; }
              .hero-inner { min-height: 620px !important; padding: 88px 32px 30px !important; }
              .hero-content { width: 500px !important; max-width: 56% !important; min-width: 0 !important; padding-bottom: 24px !important; }
              .hero-heading-orange { font-size: clamp(46px, 5.3vw, 56px) !important; }
              .hero-heading-indigo { font-size: clamp(42px, 4.9vw, 52px) !important; }
              .hero-benefits { margin-top: 34px !important; }
              .hero-benefit-label { font-size: 16px !important; }
              .hero-actions { margin-top: 28px !important; }
              .hero-actions button { font-size: 14px !important; }
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
            @media (max-width: 767px) {
              .hero-section { min-height: 0 !important; background-image: none !important; background-color: #ffffff !important; }
              .hero-inner { min-height: 0 !important; width: 100% !important; padding: 82px 18px 20px !important; }
              .hero-content { width: 100% !important; max-width: none !important; min-width: 0 !important; padding-bottom: 24px !important; }
              .hero-heading-orange { font-size: clamp(40px, 10.3vw, 48px) !important; }
              .hero-heading-indigo { font-size: clamp(36px, 9.3vw, 44px) !important; margin-top: 10px !important; }
              .hero-line-chronotype { white-space: normal !important; }
              .hero-mobile-visual { display: block !important; width: 100% !important; aspect-ratio: 16/10 !important; margin-top: 20px !important; background-repeat: no-repeat !important; background-size: cover !important; background-position: 68% center !important; }
              .hero-benefits { width: 100% !important; max-width: none !important; margin-top: 24px !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 6px !important; }
              .hero-actions { width: 100% !important; max-width: none !important; margin-top: 24px !important; grid-template-columns: 1fr !important; gap: 9px !important; }
              .hero-actions button { height: 46px !important; font-size: 14px !important; }
              .hero-benefit-media {
                width: clamp(60px, 18vw, 74px);
                height: clamp(60px, 18vw, 74px);
                flex-basis: auto;
              }
              .hero-benefit-label {
                font-size: clamp(12px, 3.6vw, 15px) !important;
                line-height: 1.15 !important;
              }
              .hero-benefit:not(:last-child)::after {
                height: 76px;
              }
            }
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
              max-width: 570px;
              margin-top: 48px;
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              align-items: start;
              gap: 0;
            }
            .hero-benefit {
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              text-align: center;
              min-width: 0;
            }
            .hero-benefit-media {
              position: relative;
              width: 78px;
              height: 78px;
              flex: 0 0 78px;
              overflow: hidden;
              border-radius: 50%;
              background: linear-gradient(145deg, #eef7fb 0%, #f3f0fb 100%);
            }
            .hero-benefit-media img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: inherit;
            }
            .hero-benefit:not(:last-child)::after {
              content: "";
              position: absolute;
              top: 4px;
              right: 0;
              width: 1.5px;
              height: 92px;
              background: #e4b93d;
            }
            .hero-benefit-label {
              width: 100%;
              margin-top: 11px;
              font-size: 19px;
              line-height: 1.15;
              font-weight: 600;
              text-align: center;
              white-space: normal;
            }
            .hero-actions {
              width: 100%;
              max-width: 650px;
              margin-top: 38px;
              display: grid;
              grid-template-columns: 190px 190px 245px;
              gap: 7px;
            }
            .hero-actions button {
              width: 100%;
              height: 42px;
              border-radius: 0;
              font-size: 15px;
              font-weight: 600;
            }
            @media (max-width: 767px) {
              .hero-actions {
                grid-template-columns: 1fr;
              }
              .hero-actions > :last-child {
                grid-column: 1 / -1;
              }
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
            @media (max-width: 767px) {
              .hero-arrow {
                width: 36px;
                height: 36px;
              }
            }
          `,
        }}
      />

      <div className="hidden md:block absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
        <div
          className="hero-bg-track"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: transitionEnabled ? "transform 0.7s ease-in-out" : "none",
            willChange: "transform",
          }}
        >
          {slideImages.map((src, idx) => (
            <div
              key={idx}
              className="hero-bg-slide"
              style={{ backgroundImage: `url("${src}")`, backgroundColor: "#eef9fd" }}
            />
          ))}
        </div>
      </div>

      <div
        className="hidden md:block absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.91) 27%, rgba(255,255,255,0.48) 43%, rgba(255,255,255,0.08) 58%, rgba(255,255,255,0) 70%)`,
        }}
      />

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

      <div className="hero-inner relative z-[2] w-full max-w-[1440px] mx-auto min-w-0">
        <div className="hero-content">
          <h1 className="hero-heading m-0 p-0">
            <span className="hero-heading-orange">
              <span className="hero-line">Sleep is the</span>
              <span className="hero-line">Foundation.</span>
            </span>
            <span className="hero-heading-indigo">
              <span className="hero-line hero-line-chronotype">Sleep Chronotype</span>
              <span className="hero-line">is the Blueprint.</span>
            </span>
          </h1>

          <div className="hero-benefits">
            <div className="hero-benefit">
              <div className="hero-benefit-media">
                <img
                  src="/assets/hero/benefit-1.png"
                  alt="Person experiencing restorative sleep"
                  draggable={false}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <p className="hero-benefit-label" style={{ color: "#FF9700" }}>Better Sleep</p>
            </div>
            <div className="hero-benefit">
              <div className="hero-benefit-media">
                <img
                  src="/assets/hero/benefit-2.png"
                  alt="Person feeling energized"
                  draggable={false}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <p className="hero-benefit-label" style={{ color: "#37329D" }}>Better Energy</p>
            </div>
            <div className="hero-benefit">
              <div className="hero-benefit-media">
                <img
                  src="/assets/hero/benefit-3.png"
                  alt="Person enjoying an active healthy life"
                  draggable={false}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <p className="hero-benefit-label" style={{ color: "#FF9700" }}>Better Life</p>
            </div>
          </div>

          <div className="hero-actions">
            <button type="button" onClick={openAssessment} className="flex items-center justify-center bg-[#3A34A3] hover:bg-[#322e8e] text-white text-[15px] font-semibold leading-[1] tracking-[-0.01em] px-[14px] rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9700] focus-visible:ring-offset-2 transition-all duration-[180ms] hover:-translate-y-[1px] hover:brightness-[0.96] cursor-pointer" style={{ fontWeight: 600, borderRadius: 0 }}>
              Take Test Now
            </button>
            <button type="button" onClick={scrollToSleepCycles} className="flex items-center justify-center bg-[#e67300] hover:bg-[#cc6500] text-white text-[15px] font-semibold leading-[1] tracking-[-0.01em] px-[14px] rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9700] focus-visible:ring-offset-2 transition-all duration-[180ms] hover:-translate-y-[1px] cursor-pointer" style={{ fontWeight: 600, borderRadius: 0 }}>
              Learn About Sleep
            </button>
            <button type="button" onClick={openConsult} className="flex items-center justify-center bg-[#e67300] hover:bg-[#cc6500] text-white text-[15px] font-semibold leading-[1] tracking-[-0.01em] px-[14px] rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9700] focus-visible:ring-offset-2 transition-all duration-[180ms] hover:-translate-y-[1px] cursor-pointer" style={{ fontWeight: 600, borderRadius: 0 }}>
              Consult a Sleep Specialist
            </button>
          </div>
        </div>

        <div className="block md:hidden w-full overflow-hidden hero-mobile-visual" aria-hidden="true" style={{ marginTop: "20px", marginBottom: "8px", aspectRatio: "16/10" }}>
          <div
            className="flex h-full"
            style={{
              width: `${slideImages.length * 100}%`,
              transform: `translateX(-${(currentSlide / slideImages.length) * 100}%)`,
              transition: transitionEnabled ? "transform 0.7s ease-in-out" : "none",
              willChange: "transform",
            }}
          >
            {slideImages.map((src, idx) => (
              <div
                key={idx}
                style={{
                  width: `${100 / slideImages.length}%`,
                  height: "100%",
                  backgroundImage: `url("${src}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "68% center",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}