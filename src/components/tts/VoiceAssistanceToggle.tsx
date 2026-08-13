"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Volume2, VolumeX } from "lucide-react";
import { useTTS } from "./TTSProvider";

interface VoiceAssistanceToggleProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function VoiceAssistanceToggle({ variant = "light", className = "" }: VoiceAssistanceToggleProps) {
  const t = useTranslations("tts");
  const { enabled, setEnabled } = useTTS();

  const bg = enabled
    ? variant === "dark"
      ? "rgba(245,154,0,0.14)"
      : "rgba(245,154,0,0.12)"
    : variant === "dark"
      ? "rgba(245,154,0,0.08)"
      : "rgba(245,154,0,0.06)";
  const fg = enabled ? "#B45309" : variant === "dark" ? "#8A6D2B" : "#B45309";
  const border = enabled
    ? "rgba(245,154,0,0.55)"
    : variant === "dark"
      ? "rgba(245,154,0,0.28)"
      : "rgba(245,154,0,0.35)";

  const [isMobile, setIsMobile] = useState(false);
  const btnHeight = isMobile ? 42 : 36;
  const iconSize = isMobile ? 17 : 15;

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={enabled ? t("onLabel") : t("offLabel")}
      title={enabled ? t("onLabel") : t("offLabel")}
      className={`inline-flex items-center gap-[6px] border cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-2 rounded-sm ${className}`}
      style={{
        height: btnHeight,
        padding: "0 10px",
        background: bg,
        color: fg,
        borderColor: border,
        fontFamily: "Poppins, sans-serif",
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {enabled ? <Volume2 size={iconSize} /> : <VolumeX size={iconSize} />}
      <span>{enabled ? t("onLabel") : t("offLabel")}</span>
    </button>
  );
}
