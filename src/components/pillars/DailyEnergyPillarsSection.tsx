"use client";

import React from "react";

const pillars = [
  {
    title: "Sleep",
    image: "/assets/section4/sleep.jpg",
    alt: "Woman sleeping peacefully in bed",
    description: "The foundation of recovery and performance.",
  },
  {
    title: "Movement",
    image: "/assets/section4/movement.jpg",
    alt: "Woman exercising as part of a healthy daily routine",
    description: "Supports physical and mental well-being.",
  },
  {
    title: "Nutrition",
    image: "/assets/section4/nutrition.jpg",
    alt: "Woman with fresh food representing healthy nutrition",
    description: "Provides fuel for energy and recovery.",
  },
  {
    title: "Light Exposure",
    image: "/assets/section4/light-exposure.jpg",
    alt: "Man using a clock to represent body-clock regulation",
    description: "Helps regulate your body clock and alertness.",
  },
];

export default function DailyEnergyPillarsSection() {
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
            maxWidth: "820px",
            marginBottom: "28px",
          }}
        >
          The Four Pillars of Daily Energy Management
        </h2>

        <div
          className="
            grid
            grid-cols-1
            min-[390px]:grid-cols-2
            lg:grid-cols-4
            gap-[24px] min-[390px]:gap-[24px_14px] lg:gap-[16px]
            items-start
          "
        >
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-stretch min-w-0">
              <h3
                className="
                  m-0
                  text-[22px] font-semibold
                  text-center
                  text-[#171717]
                "
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                {pillar.title}
              </h3>

              <div className="w-full overflow-hidden min-w-0" style={{ aspectRatio: "4 / 5", height: "auto" }}>
                <img
                  src={pillar.image}
                  alt={pillar.alt}
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
                  text-[17px] leading-[1.45]
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
                  minHeight: "58px",
                }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <p
          className="
            text-center
            text-[18px] leading-[1.5]
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
          Small daily habits create lasting improvements in well-being and
          performance.
        </p>

        <div className="flex justify-center mt-[14px] w-full px-0">
          <button
            type="button"
            onClick={() => document.getElementById("understanding-sleep-cycles")?.scrollIntoView({ behavior: "smooth" })}
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
            Explore Sleep Improvement Strategies
          </button>
        </div>
      </div>
    </section>
  );
}