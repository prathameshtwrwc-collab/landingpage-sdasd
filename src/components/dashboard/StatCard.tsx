"use client";

import type { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp = true,
  gradient = "linear-gradient(135deg, #35319B, #7B76D4)",
  lightBg = "rgba(53,49,155,0.06)",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  gradient?: string;
  lightBg?: string;
}) {
  return (
    <div
      className="flex flex-col relative overflow-hidden"
      style={{
        borderRadius: "16px",
        background: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[3px] w-full shrink-0"
        style={{ background: gradient }}
      />

      <div className="p-[20px] md:p-[24px] flex items-start justify-between">
        <div className="flex flex-col gap-[4px]">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.06em]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#AAA" }}
          >
            {label}
          </span>
          <span
            className="text-[30px] md:text-[34px] font-bold leading-[1.1] tracking-[-0.02em]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#171717" }}
          >
            {value}
          </span>
          {trend && (
            <span
              className="flex items-center gap-[4px] text-[12px] font-medium mt-[2px]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                color: trendUp ? "#2E7D32" : "#D32F2F",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {trendUp ? (
                  <polyline points="18 15 12 9 6 15" />
                ) : (
                  <polyline points="6 9 12 15 18 9" />
                )}
              </svg>
              {trend} vs last week
            </span>
          )}
        </div>
        {icon && (
          <div
            className="flex items-center justify-center w-[44px] h-[44px] rounded-xl shrink-0"
            style={{ background: lightBg }}
          >
            <span style={{ color: gradient.includes("35319B") ? "#35319B" : "#F59A00" }}>
              {icon}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
