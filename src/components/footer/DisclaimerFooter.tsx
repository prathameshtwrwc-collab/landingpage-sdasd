"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionTTSButton from "@/components/tts/SectionTTSButton";

export default function DisclaimerFooter() {
  const t = useTranslations("footer");
  return (
    <footer
      aria-labelledby="disclaimer-heading"
      className="relative w-full bg-black"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        backgroundColor: "#000000",
      }}
    >
      <SectionTTSButton scheme="dark" className="absolute top-[10px] right-[10px] md:top-[14px] md:right-[14px] z-[5]" />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="relative z-[1] mx-auto max-w-[1120px] px-[20px] max-[389px]:px-[16px] max-[389px]:pr-[44px] md:px-[32px] lg:px-[48px] pt-[28px] md:pt-[32px] lg:pt-[34px] pb-[30px] md:pb-[34px] lg:pb-[38px] min-w-0">
        <h2
          id="disclaimer-heading"
          className="m-0 text-left text-white font-semibold text-[16px] leading-[1.3] md:text-[15px] lg:text-[16px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            color: "#FFFFFF",
            marginBottom: "12px",
          }}
        >
          {t("disclaimer")}
        </h2>
        <p
          className="m-0 text-left text-white font-normal text-[clamp(12px,3.6vw,14px)] leading-[1.65] md:text-[13px] lg:text-[14px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            color: "#FFFFFF",
            maxWidth: "1080px",
          }}
        >
          {t.rich("disclaimerBody", {
            sdasd: (chunks) => (
              <span
                style={{
                  color: "#F59A00",
                  fontWeight: 600,
                }}
              >
                {chunks}
              </span>
            ),
          })}
        </p>
      </motion.div>
    </footer>
  );
}