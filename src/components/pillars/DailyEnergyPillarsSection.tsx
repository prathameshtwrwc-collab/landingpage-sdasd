"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const pillarKeys = [
  { key: "pillar1", image: "/assets/section4/sleep.jpg", altKey: "pillar1Alt" },
  { key: "pillar2", image: "/assets/section4/movement.jpg", altKey: "pillar2Alt" },
  { key: "pillar3", image: "/assets/section4/nutrition.jpg", altKey: "pillar3Alt" },
  { key: "pillar4", image: "/assets/section4/light-exposure.jpg", altKey: "pillar4Alt" },
];

export default function DailyEnergyPillarsSection() {
  const t = useTranslations("pillars");
  return (
    <section
      id="energy-pillars"
      aria-label="The Four Pillars of Daily Energy Management"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
      >
      <div
        className="
          relative z-[1] mx-auto
          px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px]
          pt-[36px] md:pt-[40px] lg:pt-[42px]
          pb-[38px] md:pb-[38px] lg:pb-[40px]
          max-w-[1180px]
        "
      >
        <h2
          className="
            m-0 mx-auto
            text-[clamp(24px,6.5vw,30px)] leading-[1.2]
            md:text-[clamp(31px,3.8vw,37px)]
            lg:text-[clamp(36px,2.7vw,43px)]
            font-semibold
            text-center
            text-[#F59A00]
          "
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            maxWidth: "820px",
            marginBottom: "28px",
          }}
        >
          {t("heading")}
        </h2>        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="
            grid
            grid-cols-1
            min-[390px]:grid-cols-2
            lg:grid-cols-4
            gap-[24px] min-[390px]:gap-[24px_14px] lg:gap-[16px]
            items-start
          "
        >
          {pillarKeys.map((pillar) => (
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }}
              key={pillar.key}
              className="flex flex-col items-stretch min-w-0"
            >
              <h3
                className="
                  m-0
                  text-[clamp(18px,5vw,22px)] font-semibold
                  text-center
                  text-[#171717]
                "
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                {t(`${pillar.key}.title`)}
              </h3>

              <div className="w-full overflow-hidden min-w-0 pillar-image-wrap" style={{ aspectRatio: "4 / 5", height: "auto" }}>
                <img
                  src={pillar.image}
                  alt={t(pillar.altKey)}
                  className="w-full h-full"
                  draggable={false}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 0,
                    boxShadow: "none",
                    display: "block",
                    aspectRatio: "4 / 5",
                    height: "auto",
                    maxHeight: "420px",
                  }}
                />
              </div>

              <p
                className="
                  text-[clamp(14px,4vw,17px)] leading-[1.45]
                  text-center
                  text-[#171717]
                "
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  marginTop: "12px",
                  maxWidth: "240px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  minHeight: "40px",
                }}
              >
                {t(`${pillar.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <p
          className="
            text-center
            text-[clamp(15px,4vw,18px)] leading-[1.5]
            text-[#171717]
          "
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            marginTop: "22px",
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {t("closing")}
        </p>
        <div className="flex justify-center mt-[14px] w-full px-0">
          <motion.button
            type="button"
            onClick={() => document.getElementById("understanding-sleep-cycles")?.scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="
              flex items-center justify-center
              bg-[#3B35A3] hover:bg-[#332D92]
              text-white
              rounded-none
              shadow-none
              focus:outline-none
              transition-all duration-[160ms] ease-[ease]
              hover:-translate-y-[1px]
              cursor-pointer
              w-full max-w-[350px] md:w-[350px] lg:w-[350px]
              h-[48px]
              text-[16px] font-semibold leading-[1]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              borderRadius: 0,
              boxShadow: "none",
            }}
          >
            {t("cta")}
          </motion.button>
        </div>
      </div>
      </motion.div>
      <style>{`
        .pillar-image-wrap {
          overflow: hidden;
          border-radius: 0;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .pillar-image-wrap:hover {
          box-shadow: 0 8px 24px rgba(53, 49, 155, 0.15);
          transform: translateY(-3px);
        }
        .pillar-image-wrap img {
          transition: transform 0.4s ease;
        }
        .pillar-image-wrap:hover img {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
}