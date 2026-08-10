"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import {
  dirForLocale,
  isValidLocale,
  type LocaleCode,
} from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";

interface I18nContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLocale(): LocaleCode {
  try {
    const fromDataLocale = document.documentElement.getAttribute("data-locale");
    if (fromDataLocale && isValidLocale(fromDataLocale)) return fromDataLocale;
    const fromLang = document.documentElement.lang;
    if (fromLang && isValidLocale(fromLang)) return fromLang;
  } catch {
    // ignore storage access errors
  }
  return "en" as LocaleCode;
}

function persistLocale(locale: LocaleCode) {
  try {
    document.cookie = `app_locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem("app_locale", locale);
  } catch {
    // ignore storage access errors
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initial locale is read from server-rendered <html data-locale> or lang attribute
  // This eliminates hydration mismatch - both server and client start with the same value
  const [locale, setLocaleState] = useState<LocaleCode>(() => getInitialLocale());

  // Keep <html lang dir data-locale> in sync with the active locale.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirForLocale(locale);
    document.documentElement.setAttribute("data-locale", locale);
  }, [locale]);

  const setLocale = useCallback(
    (next: LocaleCode) => {
      if (!isValidLocale(next) || next === locale) return;
      persistLocale(next);
      window.location.reload();
    },
    [locale]
  );

  const messages = useMemo(() => getMessages(locale), [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <I18nContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}

export function useAppLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useAppLocale must be used within I18nProvider");
  return ctx;
}
