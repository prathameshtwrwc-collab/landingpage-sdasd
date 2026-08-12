"use client";

import { useState } from "react";
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

  const handleClick = () => {
    if (unavailable || disabled || !normalizedText) return;
    if (isCurrent) {
      stop();
      return;
    }
    setIsGenerating(true);
    const finished = () => setIsGenerating(false);
    speak({ text: normalizedText, type, automatic: false });
    // Rough indicator: generating state ends shortly after request starts.
    setTimeout(finished, 1200);
  };

  const labelText = label || t("speakAria");
  const stateLabel = isCurrent ? t("stopAria") : labelText;

  const fg = variant === "dark" ? "#B45309" : "#B45309";
  const bg = variant === "dark" ? "rgba(245,154,0,0.10)" : "rgba(245,154,0,0.08)";
  const border = variant === "dark" ? "rgba(245,154,0,0.35)" : "rgba(245,154,0,0.45)";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={unavailable || disabled || !normalizedText}
      aria-label={unavailable ? t("voiceUnavailable") : stateLabel}
      aria-pressed={isCurrent}
      title={unavailable ? t("voiceUnavailable") : stateLabel}
      className={`inline-flex items-center justify-center rounded-sm border cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        width: 30,
        height: 30,
        background: bg,
        color: unavailable ? "#AAA" : fg,
        borderColor: unavailable ? "rgba(170,170,170,0.3)" : border,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {isGenerating ? (
        <Loader2 size={size * 0.8} className="animate-spin" />
      ) : isCurrent ? (
        <Square size={size * 0.8} />
      ) : unavailable ? (
        <VolumeX size={size * 0.8} />
      ) : (
        <Volume2 size={size} />
      )}
    </button>
  );
}
