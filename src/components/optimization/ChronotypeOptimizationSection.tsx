"use client";

import React from "react";

const checklistItems = [
  "Sleep quality",
  "Energy levels",
  "Productivity",
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
      {/* Container — mobile display block per task */}
      <div
        className="
          relative z-[1] mx-auto
          px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px]
          pt-[36px] md:pt-[40px] lg:pt-[42px]
          pb-[38px] md:pb-[42px] lg:pb-[46px]
          max-w-[1120px]
        "
      >
        {/* Section Heading — 25 line1.22 max-w100% mobile */}
        <h2
          className="
            m-0 mx-auto
            text-[25px] leading-[1.22]
            md:text-[27px] md:leading-[1.22]
            lg:text-[30px] lg:leading-[1.2]
            font-semibold
            text-center
            text-[#F59A00]
          "
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            maxWidth: "100%",
            marginBottom: "30px",
          }}
        >
          Every chronotype has unique strengths, challenges,
          <br />
          and opportunities for optimization.
        </h2>

        {/* Two-column grid: mobile display block */}
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
          {/* Left Content - Checklist */}
          <div style={{ maxWidth: "460px" }} className="w-full min-w-0">
            {/* Checklist Title — 18px mobile */}
            <p
              className="
                text-[18px] leading-[1.3]
                md:text-[19px] md:leading-[1.3]
                lg:text-[21px] lg:leading-[1.3]
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

            {/* Checklist Items — rows min-h42 checkbox22 label15 */}
            <div className="flex flex-col">
              {checklistItems.map((item) => (
                <div
                  key={item}
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
                      text-[15px] leading-[1.3]
                      md:text-[15px] md:leading-[1.3]
                      lg:text-[16px] lg:leading-[1.3]
                      text-[#171717]
                    "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image — width100% aspect 4/5 height auto mt24 mobile, prevent tall placeholder */}
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

        {/* Bottom supporting copy — 14 line1.55 mt22 mobile */}
        <div
          className="text-center"
          style={{
            maxWidth: "900px",
            margin: "22px auto 0",
          }}
        >
          <p
            className="
              text-[14px] leading-[1.55]
              md:text-[15px] md:leading-[1.5]
              lg:text-[16px] lg:leading-[1.5]
              text-[#171717]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            Peak performance comes from doing the right things at the right time.
          </p>
          <p
            className="
              text-[14px] leading-[1.55]
              md:text-[15px] md:leading-[1.5]
              lg:text-[16px] lg:leading-[1.5]
              text-[#171717]
              mt-[2px]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            Take the test now to know your type and transform your health, wellness,
            professional and personal performances.
          </p>
        </div>
      </div>
    </section>
  );
}
