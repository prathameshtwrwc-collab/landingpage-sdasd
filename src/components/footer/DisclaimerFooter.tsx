"use client";

import React from "react";

export default function DisclaimerFooter() {
  return (
    <footer
      aria-labelledby="disclaimer-heading"
      className="relative w-full bg-black"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        backgroundColor: "#000000",
      }}
    >
      <div className="relative z-[1] mx-auto max-w-[1120px] px-[20px] max-[389px]:px-[16px] md:px-[32px] lg:px-[48px] pt-[28px] md:pt-[32px] lg:pt-[34px] pb-[30px] md:pb-[34px] lg:pb-[38px] min-w-0">
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
          DISCLAIMER
        </h2>

        <p
          className="m-0 text-left text-white font-normal text-[14px] leading-[1.65] md:text-[13px] lg:text-[14px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            color: "#FFFFFF",
            maxWidth: "1080px",
          }}
        >
          The information provided on this website is intended for educational
          and informational purposes only and should not be considered medical
          advice, diagnosis, or treatment. Individuals experiencing persistent
          sleep concerns or symptoms suggestive of a Sleep Disturbance & Sleep
          Disorder{" "}
          <span
            style={{
              color: "#F59A00",
              fontWeight: 600,
            }}
          >
            (SDASD)
          </span>{" "}
          should seek appropriate professional evaluation.
        </p>
      </div>
    </footer>
  );
}