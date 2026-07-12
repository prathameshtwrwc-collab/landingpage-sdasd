"use client";

import React, { useEffect } from "react";

export default function HeroSection() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = "/assets/hero/hero-bg.png";
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch {}
    };
  }, []);

  return (
    <section
      aria-label="Sleep is the Foundation hero"
      className="hero-section relative w-full overflow-hidden bg-white pt-[64px] md:pt-[68px] lg:pt-[72px] min-h-[680px]"
      style={{ fontFamily: "Poppins, var(--font-poppins), sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media(min-width:768px) and (max-width:1023px){
              .hero-section{ min-height:620px !important; }
              .hero-inner{ min-height:620px !important; padding:88px 32px 30px !important; }
              .hero-content{ width:500px !important; max-width:56% !important; }
              .hero-heading-orange{ font-size:54px !important; }
              .hero-heading-indigo{ font-size:50px !important; }
            }
            @media(min-width:1024px){
              .hero-section{ min-height:680px !important; }
              .hero-inner{ min-height:680px !important; padding:96px 64px 34px !important; }
              .hero-content{ width:610px !important; max-width:44% !important; min-width:560px !important; padding-bottom:30px !important; }
              .hero-heading-orange{ font-size:clamp(48px,3.7vw,60px) !important; }
              .hero-heading-indigo{ font-size:clamp(44px,3.45vw,56px) !important; margin-top:12px !important; }
            }
            @media(min-width:1440px){
              .hero-section{ min-height:680px !important; }
            }
            @media(max-width:767px){
              .hero-section{ min-height:0 !important; background-image:none !important; background-color:#ffffff !important; }
              .hero-inner{ min-height:0 !important; width:100% !important; padding:82px 18px 20px !important; }
              .hero-content{ width:100% !important; max-width:none !important; min-width:0 !important; padding-bottom:0 !important; }
              .hero-heading-orange{ font-size:clamp(39px,10.2vw,47px) !important; }
              .hero-heading-indigo{ font-size:clamp(35px,9.3vw,43px) !important; margin-top:10px !important; }
              .hero-line-chronotype{ white-space:normal !important; }
              .hero-mobile-visual{ display:block !important; width:100% !important; aspect-ratio:16/10 !important; margin-top:20px !important; background-image:url(\"/assets/hero/hero-bg.png\") !important; background-repeat:no-repeat !important; background-size:cover !important; background-position:68% center !important; }
              .hero-benefits{ width:100% !important; max-width:none !important; margin-top:22px !important; grid-template-columns:repeat(3,minmax(0,1fr)) !important; gap:6px !important; }
              .hero-actions{ width:100% !important; max-width:none !important; margin-top:22px !important; grid-template-columns:1fr !important; gap:9px !important; }
              .hero-actions button{ height:46px !important; font-size:14px !important; }
              .hero-benefit-media{
                width:clamp(60px,18vw,74px);
                height:clamp(60px,18vw,74px);
                flex-basis:auto;
              }
              .hero-benefit-label{
                font-size:clamp(12px,3.5vw,15px);
              }
              .hero-benefit:not(:last-child)::after{
                height:76px;
              }
            }
            .hero-heading-orange{
              color:#ff6500;
              font-size:clamp(54px,4.15vw,66px);
              line-height:1.03;
              font-weight:700;
              letter-spacing:-0.04em;
              display:block;
              margin:0;
            }
            .hero-heading-indigo{
              display:block;
              margin-top:12px;
              color:#35319b;
              font-size:clamp(50px,3.9vw,62px);
              line-height:1.04;
              font-weight:600;
              letter-spacing:-0.04em;
            }
            .hero-line{
              display:block;
            }
            @media(min-width:1024px){
              .hero-line-chronotype{
                white-space:nowrap;
              }
            }
            .hero-benefits{
              width:100%;
              max-width:570px;
              margin-top:34px;
              display:grid;
              grid-template-columns:repeat(3,minmax(0,1fr));
              align-items:start;
              gap:0;
            }
            .hero-benefit{
              position:relative;
              display:flex;
              flex-direction:column;
              align-items:center;
              justify-content:flex-start;
              text-align:center;
              min-width:0;
            }
            .hero-benefit-media{
              position:relative;
              width:78px;
              height:78px;
              flex:0 0 78px;
              overflow:hidden;
              border-radius:50%;
              background:linear-gradient(145deg,#eef7fb 0%,#f3f0fb 100%);
            }
            .hero-benefit-media img{
              display:block;
              width:100%;
              height:100%;
              object-fit:cover;
              border-radius:inherit;
            }
            .hero-benefit:not(:last-child)::after{
              content:"";
              position:absolute;
              top:4px;
              right:0;
              width:1.5px;
              height:92px;
              background:#e4b93d;
            }
            .hero-benefit-label{
              width:100%;
              margin-top:10px;
              font-size:18px;
              line-height:1.15;
              font-weight:600;
              text-align:center;
              white-space:normal;
            }
            .hero-actions{
              width:100%;
              max-width:650px;
              margin-top:28px;
              display:grid;
              grid-template-columns:190px 190px 245px;
              gap:7px;
            }
            .hero-actions button{
              width:100%;
              height:42px;
              border-radius:0;
              font-size:14px;
              font-weight:600;
            }
            @media(max-width:767px){
              .hero-actions{
                grid-template-columns:1fr;
              }
              .hero-actions > :last-child{
                grid-column:1 / -1;
              }
            }
          `,
        }}
      />

      <div
        className="hidden md:block absolute inset-0 z-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("/assets/hero/hero-bg.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundColor: "#eef9fd",
        }}
      />

      <div
        className="hidden md:block absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.91) 27%, rgba(255,255,255,0.48) 43%, rgba(255,255,255,0.08) 58%, rgba(255,255,255,0) 70%)`,
        }}
      />

      <div className="hero-inner relative z-[2] w-full max-w-[1440px] mx-auto min-w-0">
        <div className="hero-content">
          <h1 className="hero-heading m-0 p-0">
            <span className="hero-heading-orange">
              <span className="hero-line">Sleep is the</span>
              <span className="hero-line">Foundation.</span>
            </span>
            <span className="hero-heading-indigo">
              <span className="hero-line hero-line-chronotype">Sleep Chronotype</span>
              <span className="hero-line">is the Blueprint.</span>
            </span>
          </h1>

          <div className="hero-benefits">
            <div className="hero-benefit">
              <div className="hero-benefit-media">
                <img
                  src="/assets/hero/benefit-1.png"
                  alt="Person experiencing restorative sleep"
                  draggable={false}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <p className="hero-benefit-label" style={{ color: "#FF9700" }}>
                Better Sleep
              </p>
            </div>
            <div className="hero-benefit">
              <div className="hero-benefit-media">
                <img
                  src="/assets/hero/benefit-2.png"
                  alt="Person feeling energized"
                  draggable={false}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <p className="hero-benefit-label" style={{ color: "#37329D" }}>
                Better Energy
              </p>
            </div>
            <div className="hero-benefit">
              <div className="hero-benefit-media">
                <img
                  src="/assets/hero/benefit-3.png"
                  alt="Person enjoying an active healthy life"
                  draggable={false}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <p className="hero-benefit-label" style={{ color: "#FF9700" }}>
                Better Life
              </p>
            </div>
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="flex items-center justify-center bg-[#3A34A3] hover:bg-[#322e8e] text-white text-[14px] font-semibold leading-[1] tracking-[-0.01em] px-[14px] rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9700] focus-visible:ring-offset-2 transition-all duration-[180ms] hover:-translate-y-[1px] hover:brightness-[0.96] cursor-pointer"
              style={{ fontWeight: 600, borderRadius: 0 }}
            >
              Take Test Now
            </button>
            <button
              type="button"
              className="flex items-center justify-center bg-[#FF9700] hover:bg-[#e68a00] text-white text-[14px] font-semibold leading-[1] tracking-[-0.01em] px-[14px] rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A34A3] focus-visible:ring-offset-2 transition-all duration-[180ms] hover:-translate-y-[1px] hover:brightness-[0.96] cursor-pointer"
              style={{ fontWeight: 600, borderRadius: 0 }}
            >
              Learn About Sleep
            </button>
            <button
              type="button"
              className="flex items-center justify-center bg-[#FF9700] hover:bg-[#e68a00] text-white text-[14px] font-semibold leading-[1] tracking-[-0.01em] px-[14px] rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A34A3] focus-visible:ring-offset-2 transition-all duration-[180ms] hover:-translate-y-[1px] hover:brightness-[0.96] cursor-pointer"
              style={{ fontWeight: 600, borderRadius: 0 }}
            >
              Consult a Sleep Specialist
            </button>
          </div>
        </div>

        <div className="block md:hidden w-full mt-[20px] mb-[8px] overflow-hidden" aria-hidden="true" style={{ aspectRatio: "16/10", backgroundImage: "url(\"/assets/hero/hero-bg.png\")", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "68% center" }} />
      </div>
    </section>
  );
}