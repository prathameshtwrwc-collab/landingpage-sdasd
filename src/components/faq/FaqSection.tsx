"use client";

import React, { useState } from "react";

const faqs = [
  {
    q: "What is a chronotype?",
    a: "A chronotype is your natural biological preference for sleeping, waking, and performing activities throughout the day.",
  },
  {
    q: "What are the main chronotypes?",
    a: "The main chronotypes are commonly described as Lark, Eagle, and Owl, representing morning, intermediate, and evening-oriented sleep patterns.",
  },
  {
    q: "How many hours of sleep do adults need?",
    a: "Most adults generally need between 7 and 9 hours of sleep each night, although individual requirements may vary.",
  },
  {
    q: "What is REM sleep?",
    a: "REM sleep is a stage of sleep associated with dreaming, memory processing, learning, creativity, and emotional regulation.",
  },
  {
    q: "What is the difference between REM and NREM sleep?",
    a: "NREM sleep primarily supports physical recovery and restoration, while REM sleep supports learning, memory, creativity, and emotional processing.",
  },
  {
    q: "When should I seek help for a sleep problem?",
    a: "Seek professional guidance when sleep problems are persistent, affect daytime functioning, involve loud snoring or breathing pauses, or significantly affect health and quality of life.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C5C5C5"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-[180ms] ease-[ease]"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq-section"
      aria-labelledby="faq-heading"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <div className="relative z-[1] mx-auto max-w-[980px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[36px] md:pt-[42px] lg:pt-[48px] pb-[40px] md:pb-[44px] lg:pb-[52px] min-w-0">
        {/* Heading */}
        <h2
          id="faq-heading"
          className="m-0 mx-auto text-[24px] leading-[1.22] md:text-[27px] lg:text-[30px] font-semibold text-center text-[#F59A00]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: "28px",
          }}
        >
          FAQ SECTION
        </h2>

        {/* FAQ container - no outer card */}
        <div
          className="w-full mx-auto bg-transparent border-none shadow-none rounded-none"
          style={{ maxWidth: "900px" }}
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const triggerId = `faq-trigger-${idx}`;
            const panelId = `faq-panel-${idx}`;
            return (
              <div
                key={faq.q}
                className="faq-item w-full bg-transparent"
                style={{ borderBottom: "1px solid rgba(120,120,120,0.55)" }}
              >
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                  className="group w-full min-h-[56px] md:min-h-[56px] lg:min-h-[58px] grid items-center text-left bg-transparent border-none cursor-pointer focus:outline-none px-0 md:px-[4px] lg:px-[4px] py-[14px] gap-[12px] md:gap-[16px] lg:gap-[16px] min-w-0"
                  style={{
                    gridTemplateColumns: "8px minmax(0, 1fr) 20px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {/* Indigo bullet dot */}
                  <span
                    className="block rounded-full bg-[#3B35A3] shrink-0"
                    aria-hidden="true"
                    style={{ width: "7px", height: "7px", borderRadius: "9999px", background: "#3B35A3" }}
                  >
                    <span className="hidden md:block" style={{ width: "8px", height: "8px" }} />
                  </span>

                  {/* Question */}
                  <span
                    className="text-[14px] leading-[1.45] md:text-[16px] md:leading-[1.4] lg:text-[17px] lg:leading-[1.4] font-semibold text-[#171717] group-hover:text-[#3B35A3] transition-colors duration-[160ms]"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                  >
                    {faq.q}
                  </span>

                  {/* Chevron */}
                  <span className="flex justify-end items-center">
                    <span className="md:hidden">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C5C5C5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="shrink-0 transition-transform duration-[180ms] ease-[ease]"
                        style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                    <span className="hidden md:block">
                      <Chevron open={isOpen} />
                    </span>
                  </span>
                </button>

                {/* Answer */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={`overflow-hidden transition-all duration-[180ms] ease-[ease] ${isOpen ? "opacity-100" : "opacity-0 h-0"}`}
                  style={{
                    maxHeight: isOpen ? "400px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                  hidden={!isOpen}
                >
                  <div
                    className="text-[13px] leading-[1.6] md:text-[14px] md:leading-[1.65] lg:text-[14px] lg:leading-[1.65] font-normal text-[#444444] pb-[16px] md:pb-[18px] lg:pb-[18px] min-w-0"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      paddingLeft: "20px",
                      paddingRight: "26px",
                      maxWidth: "820px",
                      padding: "0 26px 16px 20px",
                    }}
                  >
                    <span className="hidden md:block" style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                      <span
                        className="block"
                        style={{
                          paddingLeft: "36px",
                          paddingRight: "44px",
                          maxWidth: "820px",
                        }}
                      >
                        {faq.a}
                      </span>
                    </span>
                    <span className="block md:hidden">{faq.a}</span>
                  </div>
                </div>

                {/* Desktop padding overrides via inline style + media helper */}
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                      @media(min-width:768px){
                        #${triggerId} { grid-template-columns: 12px minmax(0,1fr) 28px !important; }
                        #${panelId} > div { padding-left: 36px !important; padding-right: 44px !important; }
                      }
                      #${triggerId}:focus-visible {
                        outline: 3px solid rgba(59,53,163,0.24);
                        outline-offset: 3px;
                      }
                    `,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
