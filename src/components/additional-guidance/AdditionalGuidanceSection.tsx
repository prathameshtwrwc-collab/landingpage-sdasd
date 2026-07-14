"use client";

import React from "react";
import { useConsult } from "@/components/consult/ConsultContext";

export default function AdditionalGuidanceSection() {
  const { open: openConsult } = useConsult();
  return (
    <section
      id="additional-guidance"
      aria-label="Need Additional Guidance"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <div className="relative z-[1] mx-auto max-w-[1120px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[36px] md:pt-[42px] lg:pt-[46px] pb-[38px] md:pb-[44px] lg:pb-[48px] min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_390px] lg:grid-cols-[minmax(0,1fr)_470px] gap-[0px] md:gap-[36px] lg:gap-[58px] items-center min-w-0">
          <div className="w-full max-w-[500px] text-left min-w-0">
            <h2
              className="m-0 text-[clamp(28px,7vw,34px)] leading-[1.2] md:text-[clamp(31px,3.8vw,37px)] lg:text-[clamp(36px,2.7vw,43px)] font-semibold text-[#F59A00] text-left"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                marginBottom: "16px",
              }}
            >
              Need Additional Guidance?
            </h2>

            <p
              className="m-0 text-[20px] leading-[1.45] md:text-[18px] md:leading-[1.5] lg:text-[20px] lg:leading-[1.5] font-medium text-[#171717] text-left"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                maxWidth: "470px",
                marginBottom: "20px",
              }}
            >
              The right support at the right time can make all the difference
            </p>

            <p
              className="m-0 text-[18px] leading-[1.58] md:text-[17px] lg:text-[18px] lg:leading-[1.58] font-medium text-[#171717] text-left"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                maxWidth: "500px",
              }}
            >
              Sleep concerns can influence health, performance, relationships,
              and quality of life. Professional support can help identify
              underlying causes and provide appropriate guidance.
            </p>
          </div>

          <div className="w-full mt-[24px] md:mt-0 max-w-full min-w-0">
            <div className="w-full aspect-[4/3] md:aspect-auto md:h-[340px] lg:h-[390px] overflow-hidden">
              <img
                src="/assets/section11/section11.jpg"
                alt="Woman waking refreshed and stretching in a bright bedroom"
                className="w-full h-full block object-cover"
                draggable={false}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: 0,
                  boxShadow: "none",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-[24px] md:mt-[24px] lg:mt-[28px]">
          <button
            type="button"
            onClick={openConsult}
            className="flex items-center justify-center bg-[#3B35A3] hover:bg-[#332D92] text-white rounded-none shadow-none border-none focus:outline-none transition-all duration-[160ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer w-full max-w-[340px] md:w-[310px] lg:w-[340px] h-[48px] md:h-[48px] lg:h-[50px] text-[17px] font-semibold leading-[1]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              borderRadius: 0,
              boxShadow: "none",
              marginLeft: "auto",
              marginRight: "auto",
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
            Talk to a Sleep Specialist
          </button>
        </div>
      </div>
    </section>
  );
}