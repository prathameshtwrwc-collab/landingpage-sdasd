"use client";

import React from "react";

export default function ChronotypeIntroductionSection() {
  return (
    <section
      id="chronotypes"
      aria-label="Discover Your Natural Sleep Rhythm - Understanding Chronotypes"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.7)",
      }}
    >
      {/* Top warm-gold divider line */}
      <div
        className="absolute left-0 right-0 top-0 h-[1px]"
        aria-hidden="true"
        style={{ background: "rgba(228, 185, 61, 0.72)" }}
      />

      {/* Container — mobile flex column per task */}
      <div
        className="
          relative z-[1] mx-auto
          px-[20px] max-[389px]:px-[16px] md:px-[36px] lg:px-[48px]
          pt-[36px] md:pt-[52px] lg:pt-[62px]
          pb-[38px] md:pb-[40px] lg:pb-[42px]
          max-w-[1180px]
          flex flex-col md:grid
        "
      >
        {/* Grid for desktop, flex column for mobile */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[minmax(0,1.15fr)_410px]
            gap-[0px] md:gap-[32px] lg:gap-[68px]
            items-start
            w-full
            min-w-0
          "
        >
          {/* Left Content Column — order heading, paragraph, It influences, list */}
          <div className="w-full min-w-0 flex flex-col" style={{ maxWidth: "560px" }}>
            {/* Heading */}
            <h2
              className="
                m-0
                text-[25px] leading-[1.2]
                md:text-[27px] md:leading-[1.2]
                lg:text-[30px] lg:leading-[1.2]
                font-semibold
                text-[#F59A00]
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                color: "#F59A00",
                maxWidth: "620px",
                marginBottom: "14px",
              }}
            >
              Discover Your Natural Sleep Rhythm:
              <br />
              Understanding Chronotypes
            </h2>

            {/* Introductory paragraph */}
            <p
              className="
                text-[14px] leading-[1.6]
                md:text-[16px] md:leading-[1.55]
                lg:text-[18px] lg:leading-[1.55]
                text-[#29275E]
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                maxWidth: "560px",
                marginBottom: "20px",
              }}
            >
              Your chronotype is your natural preference for sleeping, waking,
              and performing activities throughout the day.
            </p>

            {/* "It influences:" label */}
            <p
              className="
                text-[15px] leading-[1.3]
                md:text-[16px] md:leading-[1.3]
                lg:text-[19px] lg:leading-[1.3]
                font-semibold
                text-[#171717]
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                marginBottom: "7px",
              }}
            >
              It influences:
            </p>

            {/* Bullet list */}
            <ul
              className="
                list-disc list-outside pl-[18px] md:pl-[19px]
                m-0
              "
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <li className="text-[14px] leading-[1.6] md:text-[15px] md:leading-[1.55] lg:text-[16px] lg:leading-[1.55] text-[#171717] font-normal" style={{ fontWeight: 400, marginBottom: "5px" }}>
                When you feel most alert
              </li>
              <li className="text-[14px] leading-[1.6] md:text-[15px] lg:text-[16px] text-[#171717] font-normal" style={{ fontWeight: 400, marginBottom: "5px" }}>
                When you are most productive professionally
              </li>
              <li className="text-[14px] leading-[1.6] md:text-[15px] lg:text-[16px] text-[#171717] font-normal" style={{ fontWeight: 400, marginBottom: "5px" }}>
                When you prefer to exercise
              </li>
              <li className="text-[14px] leading-[1.6] md:text-[15px] lg:text-[16px] text-[#171717] font-normal" style={{ fontWeight: 400, marginBottom: "5px" }}>
                When you naturally feel sleepy
              </li>
              <li className="text-[14px] leading-[1.6] md:text-[15px] lg:text-[16px] text-[#171717] font-normal" style={{ fontWeight: 400, marginBottom: "5px" }}>
                How your energy changes during the day
              </li>
            </ul>
          </div>

          {/* Right Image Column — width 100% aspect 4/3 height auto mt24 mobile */}
          <div
            className="
              w-full md:w-[410px]
              h-auto
              max-w-full
              md:ml-auto
              mt-[24px] md:mt-[12px]
              min-w-0
            "
            style={{
              aspectRatio: "4 / 3",
            }}
          >
            <img
              src="/assets/section2/section-2.jpg"
              alt="Woman meditating while visualizing her natural biological rhythm"
              className="w-full h-full object-cover"
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: 0,
                boxShadow: "none",
                aspectRatio: "4 / 3",
              }}
            />
          </div>
          <style dangerouslySetInnerHTML={{ __html: `@media(min-width:768px){ #chronotypes .chronotype-img-mobile{ aspect-ratio:auto !important; height:345px !important; } }` }} />
        </div>

        {/* Lower conclusion text — centered, 15px line1.5 mt20 mobile */}
        <p
          className="
            text-center md:text-center
            text-[15px] leading-[1.5]
            md:text-[15px] md:leading-[1.5]
            lg:text-[16px] lg:leading-[1.5]
            text-[#171717]
          "
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
          }}
        >
          Understanding your rhythm helps you work with your biology and
          perform at your best.
        </p>

        {/* CTA button — width min(100%,230px) height44 */}
        <div className="flex justify-center mt-[16px] md:mt-[14px] w-full">
          <button
            type="button"
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
              h-[44px]
              text-[13px] font-semibold leading-[1]
              w-full max-w-[230px] md:w-[205px] md:max-w-[205px] lg:w-[205px]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              borderRadius: 0,
              boxShadow: "none",
              width: "min(100%, 230px)",
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
            Take Test Now
          </button>
        </div>
      </div>
    </section>
  );
}
