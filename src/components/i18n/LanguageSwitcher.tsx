"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, Languages } from "lucide-react";
import { localesByGroup } from "@/i18n/locales";
import { useAppLocale } from "./I18nProvider";

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
}

export default function LanguageSwitcher({ variant = "dark" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useAppLocale();
  const t = useTranslations("switcher");
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl" || document.dir === "rtl");
  }, [locale]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const allLocales = [...localesByGroup("international"), ...localesByGroup("indian")];
  const current = allLocales.find((l) => l.code === locale) ?? allLocales[0];
  const international = localesByGroup("international");
  const indian = localesByGroup("indian");

  const isLight = variant === "light";
  const iconColor = "#3B35A3";

  return (
    <div ref={ref} className={`relative ${isMobile ? "w-full" : ""}`} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        title={t("label")}
        className="inline-flex items-center justify-center gap-[6px] border cursor-pointer transition-all duration-200 hover:-translate-y-[0.5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-2 rounded-sm"
        style={{
          height: "36px",
          padding: "0 10px",
          background: isLight
            ? hover
              ? "rgba(59,53,163,0.18)"
              : "rgba(59,53,163,0.08)"
            : hover
              ? "rgba(59,53,163,0.16)"
              : "rgba(59,53,163,0.08)",
          color: iconColor,
          borderColor: "rgba(59,53,163,0.45)",
          backdropFilter: isLight ? "blur(8px)" : "none",
          WebkitBackdropFilter: isLight ? "blur(8px)" : "none",
          fontFamily: "Poppins, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          textShadow: "none",
        }}
      >
        <Languages
          size={15}
          style={isLight ? { filter: "drop-shadow(0 0 0.15px #FFFFFF) drop-shadow(0 0 0.15px #FFFFFF)" } : undefined}
        />
        <span style={isLight ? { WebkitTextStroke: "0.18px #FFFFFF", paintOrder: "stroke fill" } : undefined}>
          {current.nativeName}
        </span>
        <ChevronDown
          size={13}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 180ms ease",
            ...(isLight ? { filter: "drop-shadow(0 0 0.15px #FFFFFF) drop-shadow(0 0 0.15px #FFFFFF)" } : {}),
          }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("label")}
          data-lenis-prevent
          className={`absolute ${isMobile ? "inset-x-0" : (isRtl ? "left-0" : "right-0")} top-[calc(100%+8px)] z-[1200] rounded-lg`}
          style={{
            minWidth: isMobile ? "auto" : "520px",
            maxWidth: isMobile ? "calc(100vw - 32px)" : "520px",
            maxHeight: "min(70vh, 480px)",
            overflowY: "auto",
            background: "#FFFFFF",
            border: "1px solid #EFEFF5",
            boxShadow: "0 12px 32px rgba(23,23,23,0.14)",
            padding: "10px",
            overscrollBehavior: "contain",
          }}
        >
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "4px" : "24px" }}>
            <div className="flex-1 min-w-0">
              <p className="m-0 px-[6px] pt-[2px] pb-[6px] text-[10px] font-bold uppercase tracking-[0.08em]"
                style={{ color: "#3B35A3", fontFamily: "Poppins, sans-serif" }}>
                International Languages
              </p>
              {international.map((l) => {
                const active = l.code === locale;
                return (
                  <button
                    key={l.code}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setOpen(false);
                      if (!active) setLocale(l.code);
                    }}
                    className="flex items-center w-full text-left border-none cursor-pointer rounded-md transition-colors"
                    style={{
                      padding: "6px 10px",
                      gap: "8px",
                      background: active ? "rgba(53,49,155,0.07)" : "transparent",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "13px",
                      fontWeight: active ? 600 : 500,
                      color: "#171717",
                    }}
                  >
                    <span style={{ flex: "1", minWidth: 0 }}>{l.nativeName}</span>
                    <span style={{ color: "#98A2B3", fontSize: "11px", fontWeight: 400 }}>{l.label}</span>
                    {active && <Check size={14} style={{ color: "#35319B" }} />}
                  </button>
                );
              })}
            </div>

            {!isMobile && <div style={{ width: "1px", background: "#E5E7EB", flexShrink: 0 }} />}

            <div className="flex-1 min-w-0">
              <p className="m-0 px-[6px] pt-[2px] pb-[6px] text-[10px] font-bold uppercase tracking-[0.08em]"
                style={{ color: "#3B35A3", fontFamily: "Poppins, sans-serif" }}>
                Indian Languages
              </p>
              {indian.map((l) => {
                const active = l.code === locale;
                return (
                  <button
                    key={`${l.code}-in`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setOpen(false);
                      if (!active) setLocale(l.code);
                    }}
                    className="flex items-center w-full text-left border-none cursor-pointer rounded-md transition-colors"
                    style={{
                      padding: "6px 10px",
                      gap: "8px",
                      background: active ? "rgba(53,49,155,0.07)" : "transparent",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "13px",
                      fontWeight: active ? 600 : 500,
                      color: "#171717",
                    }}
                  >
                    <span style={{ flex: "1", minWidth: 0 }}>{l.nativeName}</span>
                    <span style={{ color: "#98A2B3", fontSize: "11px", fontWeight: 400 }}>{l.label}</span>
                    {active && <Check size={14} style={{ color: "#35319B" }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
