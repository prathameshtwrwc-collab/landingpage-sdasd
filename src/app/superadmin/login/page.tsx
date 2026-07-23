"use client";

import SuperAdminLoginCard from "@/components/auth/SuperAdminLoginCard";
import { Shield, Lock } from "lucide-react";

export default function SuperAdminLoginPage() {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* ─── Left: Decorative Panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0F0C29 0%, #1A1740 40%, #2B2660 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23FFFFFF' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        }} />
        <div className="absolute top-[-100px] right-[-80px] w-[350px] h-[350px] rounded-full opacity-[0.05]" style={{ background: "#D32F2F" }} />

        <div className="relative z-10 flex flex-col items-center text-center px-[40px] max-w-[460px]">
          <span className="flex items-center justify-center w-[64px] h-[64px] rounded-2xl mb-[28px]" style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", boxShadow: "0 8px 32px rgba(211,47,47,0.3)" }}>
            <Shield size={32} stroke="white" strokeWidth={1.8} />
          </span>

          <h1 className="m-0 text-[30px] font-bold leading-[1.2] text-white mb-[12px]">
            Admin Console
          </h1>
          <p className="m-0 text-[15px] leading-[1.6] mb-[32px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            Platform administration and organization management. Authorized personnel only.
          </p>

          <div className="flex flex-col gap-[16px] w-full max-w-[320px]">
            {[
              { text: "Organization management & analytics" },
              { text: "Member oversight & assessment data" },
              { text: "Platform-wide reporting & insights" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-[12px] text-left">
                <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: "#D32F2F" }} />
                <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-[40px] pt-[24px] w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="m-0 text-[12px] leading-[1.5] text-center flex items-center justify-center gap-[6px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Lock size={12} />
              Secured by Clerk Authentication
            </p>
          </div>
        </div>
      </div>

      {/* ─── Right: Login Form ─── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-[24px] py-[40px] md:px-[48px]" style={{ background: "#FAFAFC" }}>
        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-[10px] mb-[32px]">
          <span className="flex items-center justify-center w-[36px] h-[36px] rounded-xl" style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)" }}>
            <Shield size={16} stroke="white" strokeWidth={2} />
          </span>
          <span className="text-[16px] font-bold" style={{ color: "#D32F2F" }}>Chronotype Admin</span>
        </div>

        <div className="w-full max-w-[420px] mx-auto">
          <div className="flex items-center gap-[8px] mb-[24px] px-[12px] py-[8px] rounded-lg" style={{ background: "rgba(211,47,47,0.06)" }}>
            <Lock size={14} stroke="#D32F2F" />
            <span className="text-[12px] font-medium" style={{ color: "#D32F2F" }}>Restricted Access</span>
          </div>
          <SuperAdminLoginCard />
        </div>

        <p className="m-0 mt-[auto] pt-[24px] text-[11px] text-center" style={{ color: "#BBB" }}>
          &copy; {new Date().getFullYear()} WelcomeCure HealthTech. All rights reserved.
        </p>
      </div>
    </div>
  );
}
