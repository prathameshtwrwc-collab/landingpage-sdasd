"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginCard from "@/components/auth/LoginCard";
import { Moon, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) return;
    const path = user.role === "superadmin"
      ? "/superadmin/dashboard"
      : user.role === "organization_admin"
        ? "/admin/dashboard"
        : "/dashboard";
    router.replace(path);
  }, [isSignedIn, isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
        <p className="text-[14px] text-[#888]">Loading...</p>
      </div>
    );
  }

  if (isSignedIn && user) return null;

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* ─── Left: Decorative Image Panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #0F0C29 0%, #1A1740 40%, #2B2660 70%, #35319B 100%)",
        }}
      >
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23FFFFFF' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        }} />

        {/* Floating orbs */}
        <div className="absolute top-[-80px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-[0.06]" style={{ background: "#F59A00" }} />
        <div className="absolute bottom-[-60px] left-[-40px] w-[250px] h-[250px] rounded-full opacity-[0.04]" style={{ background: "#FFFFFF" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-[40px] max-w-[480px]">
          {/* Logo */}
          <span className="flex items-center justify-center w-[64px] h-[64px] rounded-2xl mb-[28px]" style={{ background: "linear-gradient(135deg, #F59A00, #FFB74D)", boxShadow: "0 8px 32px rgba(245,154,0,0.3)" }}>
            <Moon size={32} stroke="#1A1740" strokeWidth={1.8} />
          </span>

          <h1 className="m-0 text-[32px] font-bold leading-[1.2] text-white mb-[12px]">
            Sleep is the Foundation
          </h1>
          <p className="m-0 text-[16px] leading-[1.6] mb-[32px]" style={{ color: "rgba(255,255,255,0.6)" }}>
            Your chronotype is the blueprint. Align your life with your biological rhythm.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-col gap-[16px] w-full max-w-[340px]">
            {[
              { icon: <Moon size={16} stroke="#F59A00" />, text: "Discover your sleep chronotype" },
              { icon: <Sparkles size={16} stroke="#F59A00" />, text: "Personalized wellness insights" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59A00" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, text: "Organization wellness programs" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-[12px] text-left">
                <span className="flex items-center justify-center w-[32px] h-[32px] rounded-lg shrink-0" style={{ background: "rgba(245,154,0,0.12)" }}>
                  {item.icon}
                </span>
                <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-[40px] pt-[24px] w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="m-0 text-[13px] italic leading-[1.6]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Poppins, sans-serif" }}>
              &ldquo;Better sleep, better energy, better life.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* ─── Right: Login Form ─── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-[24px] py-[40px] md:px-[48px]"
        style={{ background: "#FFFFFF" }}
      >
        {/* Mobile brand (hidden on desktop) */}
        <div className="lg:hidden flex items-center gap-[10px] mb-[32px]">
          <span className="flex items-center justify-center w-[36px] h-[36px] rounded-xl" style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 12px rgba(53,49,155,0.25)" }}>
            <Moon size={16} stroke="white" strokeWidth={2} />
          </span>
          <span className="text-[16px] font-bold" style={{ color: "#1A1668" }}>Chronotype</span>
        </div>

        <LoginCard />

        <p className="m-0 mt-[auto] pt-[24px] text-[11px] text-center" style={{ color: "#BBB" }}>
          &copy; {new Date().getFullYear()} WelcomeCure HealthTech. All rights reserved.
        </p>
      </div>
    </div>
  );
}
