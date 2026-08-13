"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Volume2, Square, Loader2, VolumeX } from "lucide-react";
import { useTTS } from "./TTSProvider";
import { SpeechType } from "@/lib/tts/tts-types";
import { useAppLocale } from "@/components/i18n/I18nProvider";

interface TTSButtonProps {
  text: string;
  type?: SpeechType;
  label?: string;
  size?: number;
  variant?: "light" | "dark";
  disabled?: boolean;
  className?: string;
}

export default function TTSButton({
  text,
  type = "label",
  label,
  size = 16,
  variant = "light",
  disabled,
  className = "",
}: TTSButtonProps) {
  const t = useTranslations("tts");
  const { speak, stop, isSpeaking, status, currentText, voiceUnavailableForLocale } = useTTS();
  const { locale } = useAppLocale();
  const [isGenerating, setIsGenerating] = useState(false);

  const unavailable = voiceUnavailableForLocale(locale);
  const normalizedText = (text ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const isCurrent = isSpeaking && currentText === normalizedText;

  const handleClick = async () => {
    if (unavailable || disabled || !normalizedText) return;
    if (isCurrent) {
      stop();
      return;
    }
    setIsGenerating(true);
    try {
      await speak({ text: normalizedText, type, automatic: false });
    } catch {
      // error is handled inside provider
    } finally {
      setIsGenerating(false);
    }
  };

  const labelText = label || t("speakAria");
  const stateLabel = isCurrent ? t("stopAria") : labelText;

  const fg = variant === "dark" ? "#B45309" : "#B45309";
  const bg = variant === "dark" ? "rgba(245,154,0,0.10)" : "rgba(245,154,0,0.08)";
  const border = variant === "dark" ? "rgba(245,154,0,0.35)" : "rgba(245,154,0,0.45)";

  const [isMobile, setIsMobile] = useState(false);
  const sizeClass = isMobile ? "w-[40px] h-[40px]" : "w-[30px] h-[30px]";
  const iconBase = isMobile ? size * 1.1 : size * 0.85;

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
      onClick={handleClick}
      disabled={unavailable || disabled || !normalizedText}
      aria-label={unavailable ? t("voiceUnavailable") : stateLabel}
      aria-pressed={isCurrent}
      title={unavailable ? t("voiceUnavailable") : stateLabel}
      className={`inline-flex items-center justify-center rounded-sm border cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed ${sizeClass} ${className}`}
      style={{
        background: bg,
        color: unavailable ? "#AAA" : fg,
        borderColor: unavailable ? "rgba(170,170,170,0.3)" : border,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {isGenerating ? (
        <Loader2 size={iconBase} className="animate-spin" />
      ) : isCurrent ? (
        <Square size={iconBase} />
      ) : unavailable ? (
        <VolumeX size={iconBase} />
      ) : (
        <Volume2 size={iconBase} />
      )}
    </button>
  );
}
