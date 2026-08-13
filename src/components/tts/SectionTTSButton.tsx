"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Volume2, Square, Loader2, VolumeX } from "lucide-react";
import { useTTS } from "./TTSProvider";
import { useAppLocale } from "@/components/i18n/I18nProvider";

const IGNORE_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE",
  "BUTTON", "A", "NAV", "HEADER", "FOOTER",
  "SVG", "PATH", "G", "RECT", "CIRCLE",
]);

function isIgnored(el: HTMLElement): boolean {
  if (IGNORE_TAGS.has(el.tagName)) return true;
  if (el.hasAttribute?.("aria-hidden") && el.getAttribute("aria-hidden") === "true") return true;
  return false;
}

function extractSectionText(section: HTMLElement): string {
  const root = section.cloneNode(true) as HTMLElement;
  root.querySelectorAll<HTMLElement>(
    "button, a, nav, [data-lenis-prevent], script, style, svg, [role='navigation'], [role='banner'], [role='contentinfo']"
  ).forEach((el) => el.remove());
  const parts: string[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || isIgnored(parent)) return NodeFilter.FILTER_REJECT;
      if (IGNORE_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      const t = (node.textContent ?? "").trim();
      if (!t) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  while (walker.nextNode()) {
    parts.push(walker.currentNode.textContent!.trim());
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

interface SectionTTSButtonProps {
  className?: string;
  scheme?: "light" | "dark";
}

/**
 * Manual TTS button for landing-page sections. Reads the full section
 * text content (excluding buttons, links, nav, decorative SVG, etc.).
 *
 * scheme="light" — amber icon/text for light backgrounds (default).
 * scheme="dark"  — white icon/text for dark/indigo backgrounds.
 *
 * Respects the global `enabled` toggle from TTSProvider (navbar switch).
 */
export default function SectionTTSButton({ className = "", scheme = "light" }: SectionTTSButtonProps) {
  const t = useTranslations("tts");
  const { speak, stop, isSpeaking, currentText, voiceUnavailableForLocale, enabled, setEnabled } = useTTS();
  const { locale } = useAppLocale();
  const [isGenerating, setIsGenerating] = useState(false);

  const unavailable = voiceUnavailableForLocale(locale);
  const isDark = scheme === "dark";

  const iconColor = unavailable ? "#777" : isDark ? "#FFFFFF" : "#B45309";
  const bg = unavailable ? "rgba(120,120,120,0.12)" : isDark ? "rgba(255,255,255,0.12)" : "rgba(245,154,0,0.08)";
  const borderColor = unavailable ? "rgba(120,120,120,0.25)" : isDark ? "rgba(255,255,255,0.35)" : "rgba(245,154,0,0.45)";

  const handleClick = async () => {
    if (unavailable) return;
    if (!enabled) {
      setEnabled(true);
      return;
    }
    const btn = document.activeElement as HTMLElement | null;
    const section = (btn?.closest?.("section, footer") ?? document.querySelector("section, footer")) as HTMLElement | null;
    if (!section) return;
    const text = extractSectionText(section);
    if (!text) return;

    if (isSpeaking && currentText === text) {
      stop();
      return;
    }

    setIsGenerating(true);
    try {
      await speak({ text, type: "page", automatic: false });
    } catch {
      // error is handled inside provider
    } finally {
      setIsGenerating(false);
    }
  };

  const stateLabel = isSpeaking ? t("stopAria") : t("speakAria");
  const disabled = unavailable || isGenerating;
  const ariaLabel = !enabled ? t("offLabel") : unavailable ? t("voiceUnavailable") : stateLabel;

  const [isMobile, setIsMobile] = useState(false);
  const btnSize = isMobile ? 32 : 30;
  const iconBase = isMobile ? 15 : 14;
  const iconSmall = isMobile ? 13 : 12;

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
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={isSpeaking}
      title={ariaLabel}
      className={`inline-flex items-center justify-center rounded-sm border cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        width: btnSize,
        height: btnSize,
        background: bg,
        color: iconColor,
        borderColor: borderColor,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {isGenerating ? (
        <Loader2 size={iconSmall} className="animate-spin" />
      ) : isSpeaking ? (
        <Square size={iconSmall} />
      ) : unavailable ? (
        <VolumeX size={iconSmall} />
      ) : !enabled ? (
        <VolumeX size={iconSmall} />
      ) : (
        <Volume2 size={iconBase} />
      )}
    </button>
  );
}
