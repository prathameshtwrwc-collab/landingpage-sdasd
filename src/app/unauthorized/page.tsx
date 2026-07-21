"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-[16px]"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="text-center max-w-[400px]">
        <div
          className="inline-flex items-center justify-center w-[64px] h-[64px] rounded-full mb-[20px]"
          style={{ background: "#FFF0F0" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="m-0 text-[22px] font-semibold text-[#171717] mb-[8px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          Access Denied
        </h1>
        <p className="m-0 text-[14px] leading-[1.6] text-[#888] mb-[28px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
          You do not have the required permissions to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-[#3B35A3] hover:bg-[#2D2890] text-white text-[15px] font-semibold px-[32px] py-[12px] no-underline transition-colors"
          style={{ borderRadius: "8px", fontFamily: "Poppins, sans-serif" }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
