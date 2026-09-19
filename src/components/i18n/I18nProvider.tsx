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
  initialLocale: LocaleCode;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>(() =>
    isValidLocale(initialLocale) ? initialLocale : "en"
  );
  const [messages, setMessages] = useState<Record<string, unknown>>({});
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMessages(locale).then((msgs) => {
      if (!cancelled) {
        setMessages(msgs);
        setMessagesLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirForLocale(locale);
    document.documentElement.setAttribute("data-locale", locale);
  }, [locale]);

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

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  if (!messagesLoaded) {
    return (
      <I18nContext.Provider value={value}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
          {children}
        </NextIntlClientProvider>
      </I18nContext.Provider>
    );
  }

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
