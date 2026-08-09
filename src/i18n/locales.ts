export const locales = [
  { code: "en", label: "English", nativeName: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "mr", label: "Marathi", nativeName: "मराठी", dir: "ltr" },
  { code: "bn", label: "Bengali", nativeName: "বাংলা", dir: "ltr" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
  { code: "gu", label: "Gujarati", nativeName: "ગુજરાતી", dir: "ltr" },
  { code: "es", label: "Spanish", nativeName: "Español", dir: "ltr" },
  { code: "fr", label: "French", nativeName: "Français", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeName: "العربية", dir: "rtl" },
] as const;

export type LocaleCode = (typeof locales)[number]["code"];

export const DEFAULT_LOCALE: LocaleCode = "en";

export const LOCALE_COOKIE = "app_locale";
export const LOCALE_STORAGE = "app_locale";

export function isValidLocale(value: unknown): value is LocaleCode {
  return (
    typeof value === "string" &&
    (locales as readonly { code: string }[]).some((l) => l.code === value)
  );
}

export function dirForLocale(locale: LocaleCode): "ltr" | "rtl" {
  return (locales.find((l) => l.code === locale)?.dir ?? "ltr") as "ltr" | "rtl";
}

export function localeInfo(locale: string) {
  return locales.find((l) => l.code === locale) ?? locales[0];
}
