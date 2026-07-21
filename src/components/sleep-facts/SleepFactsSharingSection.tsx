"use client";

import React from "react"; import { motion } from "framer-motion";

async function shareFact(text: string) {
  const title = "Sleep Fact";
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
    } catch {}
  } else {
    await navigator.clipboard.writeText(text);
    alert("Fact copied to clipboard!");
  }
}

const facts = [
  {
    image: "/assets/section10/Your-body-clock-influences.png",
    text: "Your body clock influences when you naturally feel alert, productive, and sleepy.",
    shareLabel: "Share fact about the body clock",
  },
  {
    image: "/assets/section10/A-typical-night's-sleep.png",
    text: "A typical night's sleep consists of 4 to 6 sleep cycles lasting approximately 90 to 120 minutes each.",
    shareLabel: "Share fact about sleep cycles",
  },
  {
    image: "/assets/section10/Sleep-plays-a-critical.png",
    text: "Sleep plays a critical role in memory, learning, emotional regulation, immunity, recovery, and long-term health.",
    shareLabel: "Share fact about sleep and health",
  },
  {
    image: "/assets/section10/Small-improvements.png",
    text: "Small improvements in sleep habits can create meaningful improvements in energy, mood, and performance.",
    shareLabel: "Share fact about improving sleep habits",
  },
];

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <g stroke="#171717" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="4" r="2" />
        <circle cx="6" cy="10" r="2" />
        <circle cx="14" cy="16" r="2" />
        <path d="M8 11 L12 15" />
        <path d="M8 9 L12 5" />
      </g>
    </svg>
  );
}

export default function SleepFactsSharingSection() {
  return (
    <section
      id="sleep-facts-sharing"
      aria-label="Sleep Facts Worth Sharing"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}>
        <div className="relative z-[1] mx-auto max-w-[1060px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[36px] md:pt-[42px] lg:pt-[46px] pb-[38px] md:pb-[44px] lg:pb-[48px] min-w-0">
        {/* Heading */}
<h2
          className="m-0 mx-auto text-[clamp(24px,6.5vw,30px)] leading>[1.2] font-semibold text-center text-[#F59A00]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: "-0.025em", marginBottom: "28px" }}
        >
          Sleep Facts Worth Sharing
        </h2>

        {/* Facts Grid */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[18px] md:gap-[24px] lg:gap-[28px_36px] items-stretch"
        >
          {facts.map((fact, idx) => {
            return (
              <motion.article
                key={idx}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }}
                className="sleep-fact-card flex flex-col items-center justify-start text-center px-[20px] py-[22px] md:px-[22px] md:py-[22px] lg:px-[30px] lg:py-[24px] lg:pb-[22px] min-h-[250px] md:min-h-[275px] lg:min-h-[290px] h-full"
                style={{
                  background: "#F0EFF9",
                  border: "none",
                  borderRadius: "18px",
                  boxShadow: "none",
                }}
              >
                {/* Icon Circle */}
                <div
                  className="flex items-center justify-center w-[74px] h-[74px] md:w-[78px] md:h-[78px] lg:w-[86px] lg:h-[86px] rounded-full bg-white shrink-0 mx-auto"
                  aria-hidden="true"
                  style={{
                    borderRadius: "9999px",
                    background: "#FFFFFF",
                    marginBottom: "18px",
                  }}
                >
                  <div className="flex items-center justify-center w-[74px] h-[74px] md:w-[78px] md:h-[78px] lg:w-[86px] lg:h-[86px] p-[10px]">
                    <img
                      src={fact.image}
                      alt=""
                      className="w-full h-full object-contain"
                      draggable={false}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>

                {/* Fact Text */}
<p
                  className="m-0 text-[clamp(14px,4vw,16px)] leading>[1.35] max-w-[210px] text-center"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, maxWidth: "210px" }}
                >
                  {fact.text}
                </p>

                {/* Share Fact Button */}
<motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "#FFF5E6" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  aria-label={fact.shareLabel}
                  onClick={() => shareFact(fact.text)}
                  className="inline-flex items-center justify-center gap-[8px] bg-white text-[#171717] border-[1.5px] border-[#E7A62A] rounded-full shadow-none focus:outline-none transition-colors duration-[160ms] cursor-pointer mt-[18px] w-[190px] h-[46px] md:w:[190px] md:h>[46px] lg:w:[210px] lg:h>[48px] text-[16px] font-medium leading>[1]"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    borderRadius: "9999px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "3px solid rgba(59, 53, 163, 0.25)";
                    e.currentTarget.style.outlineOffset = "3px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "";
                    e.currentTarget.style.outlineOffset = "";
                  }}
                >
                  <ShareIcon />
                  <span>Share Fact</span>
                </motion.button>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Bottom CTA — mobile width100% max none min-h50 height auto padding12 14 font15 line1.35 */}
        <div className="flex justify-center mt-[32px] w-full min-w-0">
<motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => {
              const allText = facts.map((f) => f.text).join("\n\n");
              shareFact(allText);
            }}
            className="flex items-center justify-center bg-[#3B35A3] text-white border-none rounded-none shadow-none focus:outline-none transition-all duration-[160ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer w-full max-w-none md:w:[470px] md:max-w:[470px] lg:w:[500px] lg:max-w:[500px] min-h:[50px] h-auto md:h>[52px] lg:h>[54px] px-[18px] py-[12px] md:p-0 lg:p-0 text-[18px] md:text>[18px] lg:text>[19px] font-semibold leading>[1.35] md:leading>[1]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              borderRadius: 0,
              boxShadow: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = "3px solid rgba(59, 53, 163, 0.28)";
              e.currentTarget.style.outlineOffset = "3px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "";
              e.currentTarget.style.outlineOffset = "";
            }}
          >
            <span>
              Share These Facts with Your Loved Ones{" "}
              <span style={{ color: "#F4C623" }}>Now</span>
            </span>
          </motion.button>
        </div>
      </div>
      </motion.div>
      <style>{`
.sleep-fact-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.sleep-fact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(53, 49, 155, 0.12);
}
`}</style>
    </section>
  );
}
