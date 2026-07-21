"use client";

import React from "react";
import { motion } from "framer-motion";

const checklistItems = [
  "Sleep quality",
  "Energy levels",
  "Productivity - Work, Social and Family",
  "Focus",
  "Exercise performance",
  "Recovery",
  "Nutrition timing",
  "Work-life balance",
];

export default function ChronotypeOptimizationSection() {
  return (
    <section
      id="chronotype-optimization"
      aria-label="Every chronotype has unique strengths, challenges, and opportunities for optimization"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderTop: "1px solid rgba(228, 185, 61, 0.72)",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 25 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
          },
        }}
      >
        <div
          className="
            relative z-[1] mx-auto
            px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px]
            pt-[36px] md:pt-[40px] lg:pt-[42px]
            pb-[38px] md:pb-[42px] lg:pb-[46px]
            max-w-[1120px]
          "
        >
        <h2
          className="
            m-0 mx-auto
            text-[clamp(28px,7vw,34px)] leading-[1.2]
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
            maxWidth: "100%",
            marginBottom: "30px",
          }}
        >
          Every chronotype has unique strengths, challenges, and opportunities for optimization.
        </h2>

        <div
          className="
            block md:grid
            md:grid-cols-[minmax(0,1fr)_390px]
            gap-[0px] md:gap-[40px] lg:gap-[76px]
            items-start
            w-full
            min-w-0
          "
        >
          <div style={{ maxWidth: "460px" }} className="w-full min-w-0">
            <p
              className="
                text-[clamp(17px,4.5vw,20px)] leading-[1.3]
                md:text-[20px] md:leading-[1.3]
                lg:text-[23px] lg:leading-[1.3]
                font-semibold
                text-[#171717]
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                marginBottom: "14px",
              }}
            >
              Understanding your chronotype
              <br />
              can help optimize:
            </p>

            <motion.div
              className="flex flex-col"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {checklistItems.map((item) => (
                <motion.div
                  key={item}
                  variants={{
                    hidden: { opacity: 0, x: -15 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.35, ease: "easeOut" },
                    },
                  }}
                  className="
                    flex items-center gap-[10px]
                    min-h-[42px]
                  "
                  style={{
                    borderBottom: "1px solid rgba(215, 178, 69, 0.8)",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: "22px",
                      height: "22px",
                      border: "1.5px solid #171717",
                      borderRadius: 0,
                      background: "transparent",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="
                      text-[clamp(15px,4vw,18px)] leading-[1.55]
                      md:text-[17px] md:leading-[1.55]
                      lg:text-[18px] lg:leading-[1.55]
                      text-[#171717]
                    "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div
            className="
              w-full md:w-[390px]
              h-auto
              max-w-full
              md:ml-auto
              mt-[24px] md:mt-0
              min-w-0
            "
            style={{
              aspectRatio: "4 / 5",
            }}
          >
            <img
              src="/assets/section3/section-3.jpg"
              alt="Woman practicing a balance pose outdoors"
              className="w-full h-full"
              draggable={false}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: 0,
                boxShadow: "none",
                aspectRatio: "4 / 5",
                height: "auto",
                maxHeight: "520px",
              }}
            />
          </div>
        </div>

        <div
          className="text-center"
          style={{
            maxWidth: "900px",
            margin: "22px auto 0",
          }}
        >
          <p
            className="
              text-[clamp(15px,4vw,17px)] leading-[1.58]
              md:text-[17px] md:leading-[1.58]
              lg:text-[18px] lg:leading-[1.58]
              text-[#171717]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            Peak performance comes from doing the right things at the right time.
          </p>
          <p
            className="
              text-[clamp(15px,4vw,17px)] leading-[1.58]
              md:text-[17px] md:leading-[1.58]
              lg:text-[18px] lg:leading-[1.58]
              text-[#171717]
              mt-[2px]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            Take the test now to know your type and transform your health, wellness,
            professional and personal performances.
          </p>
        </div>
      </div>
      </motion.div>
    </section>
  );
}