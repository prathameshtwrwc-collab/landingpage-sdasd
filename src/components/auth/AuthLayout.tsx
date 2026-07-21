"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Moon, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
  title,
  subtitle,
  variant = "default",
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  variant?: "default" | "superadmin";
}) {
  const isSuperAdmin = variant === "superadmin";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-[16px] py-[40px] relative overflow-hidden"
      style={{
        fontFamily: "Poppins, sans-serif",
        background: isSuperAdmin
          ? "linear-gradient(180deg, #1A1740 0%, #2B2660 40%, #35319B 100%)"
          : "linear-gradient(180deg, #EDF5FF 0%, #F5FAFF 40%, #FFFFFF 100%)",
      }}
    >
      {/* Decorative background elements */}
      {!isSuperAdmin && (
        <>
          <div
            className="absolute top-[-80px] right-[-60px] w-[240px] h-[240px] rounded-full opacity-[0.06]"
            style={{ background: "#35319B" }}
          />
          <div
            className="absolute bottom-[-40px] left-[-80px] w-[200px] h-[200px] rounded-full opacity-[0.04]"
            style={{ background: "#F59A00" }}
          />
          <div
            className="absolute top-[20%] left-[5%] opacity-[0.03]"
            style={{ transform: "rotate(-10deg)" }}
          >
            <Moon size={120} stroke="#35319B" />
          </div>
          <div
            className="absolute bottom-[15%] right-[8%] opacity-[0.03]"
            style={{ transform: "rotate(15deg)" }}
          >
            <Sparkles size={80} stroke="#F59A00" />
          </div>
        </>
      )}

      {isSuperAdmin && (
        <>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23FFFFFF' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          }} />
          <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full opacity-[0.05]" style={{ background: "#FFFFFF" }} />
        </>
      )}

      {/* Brand */}
      <Link
        href="/"
        className="no-underline mb-[36px] inline-flex items-center gap-[12px] group relative z-10"
      >
        <span
          className="flex items-center justify-center w-[44px] h-[44px] rounded-xl transition-transform duration-200 group-hover:scale-105"
          style={{
            background: isSuperAdmin
              ? "linear-gradient(135deg, #4A45B0, #6A65D0)"
              : "linear-gradient(135deg, #35319B, #5A55C0)",
            boxShadow: "0 4px 12px rgba(53, 49, 155, 0.25)",
          }}
        >
          <Moon size={22} stroke="white" strokeWidth={1.8} />
        </span>
        <div className="flex flex-col">
          <span
            className="text-[20px] font-semibold leading-[1.2]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: isSuperAdmin ? "#FFFFFF" : "#2F2A86",
            }}
          >
            Chronotype
          </span>
          {isSuperAdmin && (
            <span
              className="text-[10px] uppercase tracking-[0.15em] font-medium"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Admin Console
            </span>
          )}
        </div>
      </Link>

      {/* Card */}
      <div
        className="w-full relative z-10"
        style={{
          maxWidth: "440px",
        }}
      >
        <div
          className="bg-white overflow-hidden"
          style={{
            borderRadius: "20px",
            boxShadow: isSuperAdmin
              ? "0 8px 32px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(53, 49, 155, 0.08)",
          }}
        >
          {/* Accent bar */}
          <div
            className="h-[4px] w-full"
            style={{
              background: isSuperAdmin
                ? "linear-gradient(90deg, #D32F2F, #FF6B6B)"
                : "linear-gradient(90deg, #35319B, #F59A00)",
            }}
          />

          <div className="px-[28px] py-[32px] md:px-[36px] md:py-[36px]">
            {/* Icon */}
            <div className="flex justify-center mb-[18px]">
              <div
                className="flex items-center justify-center w-[56px] h-[56px] rounded-full"
                style={{
                  background: isSuperAdmin
                    ? "linear-gradient(135deg, #D32F2F, #FF6B6B)"
                    : "linear-gradient(135deg, #35319B, #5A55C0)",
                  boxShadow: isSuperAdmin
                    ? "0 4px 16px rgba(211, 47, 47, 0.25)"
                    : "0 4px 16px rgba(53, 49, 155, 0.2)",
                }}
              >
                {isSuperAdmin ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ) : (
                  <Moon size={26} stroke="white" strokeWidth={1.8} />
                )}
              </div>
            </div>

            <div className="text-center mb-[28px]">
              <h1
                className="m-0 text-[22px] font-semibold leading-[1.3]"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: isSuperAdmin ? "#D32F2F" : "#35319B",
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className="m-0 mt-[6px] text-[14px] leading-[1.55]"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    color: isSuperAdmin ? "rgba(0,0,0,0.55)" : "#888",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        </div>

        {/* Back to home */}
        <div className="flex justify-center mt-[20px]">
          <Link
            href="/"
            className="inline-flex items-center gap-[6px] text-[13px] font-medium no-underline transition-colors duration-150"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              color: isSuperAdmin ? "rgba(255,255,255,0.6)" : "#888",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = isSuperAdmin ? "#FFFFFF" : "#35319B"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isSuperAdmin ? "rgba(255,255,255,0.6)" : "#888"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="19 12 5 12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
