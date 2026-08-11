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

function persistLocale(locale: LocaleCode) {
  try {
    document.cookie = `app_locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem("app_locale", locale);
  } catch {
    // ignore storage access errors
  }
}

interface I18nProviderProps {
  children: ReactNode;
  /** Locale resolved on the server (from the app_locale cookie). Using this as the
   *  initial state guarantees the client's first render matches the server HTML,
   *  which eliminates hydration mismatches. */
  initialLocale: LocaleCode;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>(() =>
    isValidLocale(initialLocale) ? initialLocale : "en"
  );

  // Keep <html lang dir data-locale> in sync with the active locale.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirForLocale(locale);
    document.documentElement.setAttribute("data-locale", locale);
  }, [locale]);

  // Superadmin / admin dashboards are always English — never translate the
  // management UI or the member data shown there. Applied after hydration so
  // the server-rendered HTML and client first paint always match.
  useEffect(() => {
    const path = window.location.pathname;
    if ((path.startsWith("/superadmin") || path.startsWith("/admin")) && locale !== "en") {
      setLocaleState("en");
    }
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
