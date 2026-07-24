"use client";

import type { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp = true,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        borderRadius: "16px",
        background: "#FFFFFF",
        border: "1px solid #E6E8F0",
        padding: "20px 20px 20px 20px",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[6px]">
          <span className="text-[12px] font-semibold uppercase tracking-[0.05em]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#667085" }}>
            {label}
          </span>
          <span className="text-[30px] md:text-[34px] font-bold leading-[1.1] tracking-[-0.02em]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#111827" }}>
            {value}
          </span>
          {trend && (
            <span className="flex items-center gap-[4px] text-[12px] font-medium mt-[1px]"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, color: trendUp ? "#1F8A5B" : "#D92D20" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {trendUp ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
              </svg>
              {trend}
            </span>
          )}
        </div>
        {icon && (
          <div className="flex items-center justify-center w-[42px] h-[42px] rounded-xl shrink-0"
            style={{ background: "#F1F4FA" }}>
            <span style={{ color: "#35319B" }}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
