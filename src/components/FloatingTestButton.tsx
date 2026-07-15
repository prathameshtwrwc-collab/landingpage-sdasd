"use client";

import React, { useEffect, useState } from "react";
import { useAssessment } from "@/components/assessment/AssessmentContext";

export default function FloatingTestButton() {
  const { open: openAssessment } = useAssessment();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      onClick={openAssessment}
      className="fixed bottom-6 right-6 z-[9998] flex items-center justify-center bg-[#3A34A3] hover:bg-[#322e8e] text-white text-[15px] font-semibold leading-[1] tracking-[-0.01em] px-[22px] py-[14px] rounded-lg shadow-lg shadow-[#3A34A3]/30 hover:shadow-xl hover:-translate-y-[1px] transition-all duration-[180ms] cursor-pointer border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9700] focus-visible:ring-offset-2"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderRadius: "10px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
      aria-label="Take Sleep Test"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-[8px]" aria-hidden="true">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <path d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" />
        <path d="M9 13l2 2 4-4" />
      </svg>
      Take Test
    </button>
  );
}
