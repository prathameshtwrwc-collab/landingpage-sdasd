"use client";

import React from "react";

const benefitItems = [
  "Better Physical Health",
  "Better Mental Health",
  "Better Emotional Stability",
  "Better Relationships",
  "Better Recovery",
  "Better Productivity",
  "Better Quality of Life",
];

export default function BetterSleepBetterDaysSection() {
  return (
    <section
      id="better-sleep-better-days"
      aria-label="Better Sleep Creates Better Days"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      {/* Container — mobile defaults */}
      <div
        className="
          relative z-[1] mx-auto
          px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px]
          pt-[36px] md:pt-[40px] lg:pt-[44px]
          pb-[38px] md:pb-[44px] lg:pb-[52px]
          max-w-[1120px]
        "
      >
        {/* Heading — clamp mobile */}
        <h2
          className="
            m-0 mx-auto
            text-[clamp(23px,7vw,28px)] leading-[1.18] tracking-[-0.02em]
            md:text-[27px] md:leading-[1.2]
            lg:text-[30px] lg:leading-[1.2]
            font-semibold
            text-center
            text-[#F59A00]
          "
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: "12px",
          }}
        >
          Better Sleep Creates Better Days
        </h2>

        {/* Subtitle */}
        <p
          className="
            m-0 mx-auto
            text-[14px] leading-[1.6]
            md:text-[16px] md:leading-[1.4]
            lg:text-[17px] lg:leading-[1.4]
            font-semibold
            text-center
            text-[#171717]
          "
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            marginBottom: "30px",
          }}
        >
          Quality sleep influences every area of life.
        </p>

        {/* Main grid — mobile order heading, subtitle, benefit list, image */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[380px_minmax(0,1fr)]
            lg:grid-cols-[430px_minmax(0,1fr)]
            gap-[0px] md:gap-[32px] lg:gap-[54px]
            items-start
            min-w-0
          "
        >
          {/* Left: Benefit list */}
          <div className="w-full max-w-[430px] md:max-w-[380px] lg:max-w-[430px] min-w-0 order-1">
            {benefitItems.map((item) => (
              <div
                key={item}
                className="
                  grid
                  grid-cols-[42px_minmax(0,1fr)] gap-[7px]
                  md:gap-[7px] lg:gap-[8px]
                  items-center
                  mb-[8px] md:mb-[7px] lg:mb-[8px]
                  min-w-0
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    block
                    w-[42px] h-[40px]
                    border-[1.5px]
                    border-[#8A8A8A]
                    bg-transparent
                    rounded-none
                    shrink-0
                  "
                  style={{ borderRadius: 0 }}
                />
                <div
                  className="
                    flex items-center
                    min-h-[40px] h-auto
                    px-[12px] md:px-[12px] lg:px-[16px]
                    py-[9px]
                    border-[1.5px] border-[#4C4C4C]
                    bg-white
                    rounded-none
                    min-w-0
                  "
                  style={{ borderRadius: 0, minHeight: "40px", height: "auto", padding: "9px 12px" }}
                >
                  <span
                    className="
                      text-[14px] leading-[1.2]
                      md:text-[14px] lg:text-[16px]
                      text-[#171717]
                      font-normal
                      break-words
                    "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {item}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Image — width100% aspect 4/3 height auto mt24 mobile */}
          <div
            className="
              w-full
              mt-[24px] md:mt-0
              max-w-full
              lg:max-w-[470px]
              md:ml-auto
              lg:ml-auto
              min-w-0
              order-2
            "
          >
            <div
              className="
                w-full
                h-auto
              "
              style={{ aspectRatio: "4 / 3", height: "auto" }}
            >
              <img
                src="/assets/section5/section-5.jpg"
                alt="Woman sleeping peacefully in a comfortable bright room"
                className="w-full h-full object-cover block"
                draggable={false}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: 0,
                  boxShadow: "none",
                  display: "block",
                  aspectRatio: "4 / 3",
                  height: "auto",
                  maxHeight: "420px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
