"use client";

import React from "react";
import { useAssessment } from "@/components/assessment/AssessmentContext";

const chronotypeInfluences = [
  "When you feel most alert",
  "When you are most productive professionally",
  "When you prefer to exercise",
  "When you naturally feel sleepy",
  "How your energy changes during the day",
];

export default function ChronotypeIntroductionSection() {
  const { open: openAssessment } = useAssessment();
  return (
    <section
      id="chronotypes"
      aria-label="Discover Your Natural Sleep Rhythm - Understanding Chronotypes"
      className="relative w-full bg-white"
      style={{
        fontFamily: "Poppins, var(--font-poppins), sans-serif",
        borderBottom: "1px solid rgba(228, 185, 61, 0.72)",
      }}
    >
      <div
        className="chronotype-intro-section relative z-[1] mx-auto chronotype-intro-container"
        style={{
          padding: "52px 48px 44px",
        }}
      >
        <div className="chronotype-intro-grid grid grid-cols-1 md:grid-cols-[minmax(0,630px)_330px] md:justify-between gap-[56px] md:gap-[60px] items-start w-full min-w-0">
          <div className="chronotype-intro-copy w-full min-w-0">
            <h2 className="chronotype-intro-heading m-0 text-[#F59A00] text-left">
              <span className="chronotype-heading-primary">Discover Your Natural Sleep Rhythm:</span>

              <span className="chronotype-heading-secondary">
                Understanding Sleep Chronotypes
              </span>
            </h2>

            <p
              className="chronotype-intro-description m-0 mt-[18px] max-w-[560px] font-medium text-[#2F2A68]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "1.5",
              }}
            >
              Your chronotype is your natural preference for sleeping, waking,
              and performing activities throughout the day.
            </p>

            <p
              className="chronotype-intro-label m-0 mt-[22px] font-semibold text-[#171717]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "19px",
                lineHeight: "1.35",
                marginBottom: "8px",
              }}
            >
              It influences:
            </p>

            <ul className="chronotype-intro-list m-0 pl-[20px] list-disc list-outside">
              {chronotypeInfluences.map((item) => (
                <li
                  key={item}
                  className="m-0 mb-[7px] font-medium text-[#171717]"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "18px",
                    lineHeight: "1.4",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="chronotype-intro-image-wrap w-full max-w-[340px] mx-auto md:mx-0 md:align-self-start mt-[24px] md:mt-0 overflow-hidden">
            <img
              src="/assets/section2/section-2.jpg"
              alt="Woman meditating while visualizing her natural biological rhythm"
              className="chronotype-intro-image w-full h-auto aspect-[4/3] object-cover"
              style={{
                fontFamily: "Poppins, sans-serif",
                display: "block",
                width: "100%",
                height: "auto",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: 0,
                boxShadow: "none",
                maxHeight: "280px",
              }}
              draggable={false}
            />
          </div>
        </div>

        <div className="chronotype-intro-footer w-full mt-[24px] flex flex-col items-center text-center">
          <p
            className="chronotype-intro-conclusion m-0 font-medium text-[#171717]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "17px",
              lineHeight: "1.5",
            }}
          >
            Understanding your rhythm helps you work with your biology and
            perform at your best.
          </p>

          <button type="button" onClick={openAssessment} className="chronotype-intro-cta w-full max-w-[260px] h-[48px] mt-[14px] mx-auto md:mt-0 inline-flex items-center justify-center bg-[#3B35A3] hover:bg-[#332D92] text-white rounded-none shadow-none focus:outline-none transition-all duration-[160ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer text-[16px] font-semibold leading-[1]">
            Take Test Now
          </button>
        </div>
      </div>

      <style>{`
        .chronotype-intro-section {
          padding: 52px 48px 44px;
        }

        .chronotype-intro-container {
          width: min(100%, 1120px);
          margin: 0 auto;
        }

        .chronotype-intro-grid {
          display: grid;
          grid-template-columns: minmax(0, 630px) 330px;
          justify-content: space-between;
          gap: 60px;
          align-items: start;
        }

        .chronotype-intro-heading {
          margin: 0;
          color: #F59A00;
          text-align: left;
          font-size: 35px;
          line-height: 1.2;
          font-weight: 600;
          letter-spacing: -0.025em;
        }

        .chronotype-heading-primary,
        .chronotype-heading-secondary {
          display: block;
        }

        @media (min-width: 1024px) {
          .chronotype-heading-primary {
            white-space: normal;
          }
        }

        .chronotype-intro-description {
          margin-top: 18px;
          max-width: 560px;
          font-size: 18px;
          line-height: 1.5;
          font-weight: 500;
          color: #2F2A68;
        }

        .chronotype-intro-label {
          margin-top: 22px;
          margin-bottom: 8px;
          font-size: 19px;
          line-height: 1.35;
          font-weight: 600;
          color: #171717;
        }

        .chronotype-intro-list {
          margin: 0;
          padding-left: 20px;
          list-style: disc;
          list-style-position: outside;
        }

        .chronotype-intro-list li {
          margin-bottom: 7px;
          font-size: 18px;
          line-height: 1.4;
          font-weight: 500;
          color: #171717;
        }

        .chronotype-intro-image-wrap {
          width: 410px;
          max-width: 100%;
          align-self: start;
          margin-top: 4px;
          overflow: hidden;
        }

        .chronotype-intro-image {
          display: block;
          width: 100%;
          height: 320px;
          object-fit: cover;
          object-position: center;
          border-radius: 0;
          box-shadow: none;
        }

        .chronotype-intro-footer {
          width: 100%;
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .chronotype-intro-conclusion {
          margin: 0;
          font-size: 17px;
          line-height: 1.5;
          font-weight: 500;
          color: #171717;
        }

        .chronotype-intro-cta {
          width: 260px;
          height: 48px;
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 389px) {
          .chronotype-intro-section {
            padding: 36px 16px 38px;
          }
        }

        @media (max-width: 767px) {
          .chronotype-intro-section {
            padding: 36px 20px 38px;
          }

          .chronotype-intro-grid {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .chronotype-intro-heading {
            font-size: clamp(28px, 7.5vw, 34px);
            line-height: 1.2;
            text-align: left;
          }

          .chronotype-heading-primary {
            display: inline;
            white-space: normal;
          }

          .chronotype-heading-primary::after {
            content: " ";
          }

          .chronotype-intro-description {
            margin-top: 16px;
            font-size: 16px;
            line-height: 1.55;
          }

          .chronotype-intro-label {
            margin-top: 20px;
            font-size: 17px;
          }

          .chronotype-intro-list li {
            font-size: 16px;
            line-height: 1.5;
          }

          .chronotype-intro-image-wrap {
            width: 100%;
            max-width: 340px;
            margin-top: 24px;
            margin-left: auto;
            margin-right: auto;
          }

          .chronotype-intro-image {
            width: 100%;
            height: auto;
            aspect-ratio: 4 / 3;
            object-fit: cover;
            max-height: 280px;
          }

          .chronotype-intro-footer {
            margin-top: 20px;
          }

          .chronotype-intro-conclusion {
            font-size: 16px;
            line-height: 1.5;
          }

          .chronotype-intro-cta {
            width: min(100%, 260px);
            max-width: 260px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .chronotype-intro-section {
            padding: 52px 36px 44px;
          }

          .chronotype-intro-grid {
            grid-template-columns: minmax(0, 1fr) 340px;
            gap: 36px;
          }

          .chronotype-intro-heading {
            font-size: 30px;
          }

          .chronotype-heading-primary {
            white-space: normal;
          }

          .chronotype-intro-image-wrap {
            width: 300px;
            margin-left: 0;
          }

          .chronotype-intro-image {
            height: 250px;
          }
        }

        @media (min-width: 1024px) {
          .chronotype-intro-section {
            padding: 52px 48px 44px;
          }
        }
      `}</style>
    </section>
  );
}