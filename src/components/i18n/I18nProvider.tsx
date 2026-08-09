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
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_STORAGE,
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
  return DEFAULT_LOCALE;
}

function readStoredLocale(): LocaleCode | null {
  try {
    const cookie = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${LOCALE_COOKIE}=`));
    if (cookie) {
      const value = cookie.slice(LOCALE_COOKIE.length + 1);
      if (isValidLocale(value)) return value;
    }
    const stored = localStorage.getItem(LOCALE_STORAGE);
    if (stored && isValidLocale(stored)) return stored;
  } catch {
    // ignore storage access errors
  }
  return null;
}

function persistLocale(locale: LocaleCode) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem(LOCALE_STORAGE, locale);
  } catch {
    // ignore storage access errors
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => getInitialLocale());

  // Sync stored locale after mount (e.g., when locale changes via LanguageSwitcher and page reloads)
  useEffect(() => {
    const stored = readStoredLocale();
    if (stored && stored !== locale) setLocaleState(stored);
  }, [locale]);

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
      <NextIntlClientProvider locale={locale} messages={messages}>
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
