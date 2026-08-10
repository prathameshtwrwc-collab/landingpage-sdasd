export type LocaleGroup = "international" | "indian";

export const locales = [
  // ─── International (with English) ───
  { code: "en", label: "English", nativeName: "English", dir: "ltr", group: "international" },
  { code: "es", label: "Spanish", nativeName: "Español", dir: "ltr", group: "international" },
  { code: "fr", label: "French", nativeName: "Français", dir: "ltr", group: "international" },
  { code: "de", label: "German", nativeName: "Deutsch", dir: "ltr", group: "international" },
  { code: "ru", label: "Russian", nativeName: "Русский", dir: "ltr", group: "international" },
  { code: "zh", label: "Chinese (Simplified)", nativeName: "简体中文", dir: "ltr", group: "international" },
  { code: "zh-tw", label: "Chinese (Traditional)", nativeName: "繁體中文", dir: "ltr", group: "international" },
  { code: "ja", label: "Japanese", nativeName: "日本語", dir: "ltr", group: "international" },
  { code: "it", label: "Italian", nativeName: "Italiano", dir: "ltr", group: "international" },
  { code: "tr", label: "Turkish", nativeName: "Türkçe", dir: "ltr", group: "international" },
  { code: "ar", label: "Arabic", nativeName: "العربية", dir: "rtl", group: "international" },
  { code: "bn", label: "Bangla", nativeName: "বাংলা", dir: "ltr", group: "international" },
  { code: "fi", label: "Finnish", nativeName: "Suomi", dir: "ltr", group: "international" },
  { code: "he", label: "Hebrew", nativeName: "עברית", dir: "rtl", group: "international" },
  { code: "el", label: "Greek", nativeName: "Ελληνικά", dir: "ltr", group: "international" },
  { code: "ms", label: "Malay", nativeName: "Bahasa Melayu", dir: "ltr", group: "international" },
  { code: "pt", label: "Portuguese", nativeName: "Português", dir: "ltr", group: "international" },
  { code: "ur", label: "Urdu (Pakistan)", nativeName: "اردو", dir: "rtl", group: "international" },

  // ─── Indian (with English) ───
  { code: "en", label: "English", nativeName: "English", dir: "ltr", group: "indian" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी", dir: "ltr", group: "indian" },
  { code: "mr", label: "Marathi", nativeName: "मराठी", dir: "ltr", group: "indian" },
  { code: "bn", label: "Bengali", nativeName: "বাংলা", dir: "ltr", group: "indian" },
  { code: "gu", label: "Gujarati", nativeName: "ગુજરાતી", dir: "ltr", group: "indian" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்", dir: "ltr", group: "indian" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు", dir: "ltr", group: "indian" },
  { code: "kn", label: "Kannada", nativeName: "ಕನ್ನಡ", dir: "ltr", group: "indian" },
  { code: "pa", label: "Punjabi", nativeName: "ਪੰਜਾਬੀ", dir: "ltr", group: "indian" },
  { code: "ml", label: "Malayalam", nativeName: "മലയാളം", dir: "ltr", group: "indian" },
  { code: "or", label: "Odia", nativeName: "ଓଡ଼ିଆ", dir: "ltr", group: "indian" },
  { code: "ur-in", label: "Urdu (India)", nativeName: "اردو", dir: "rtl", group: "indian" },
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

export function localesByGroup(group: LocaleGroup) {
  return (locales as readonly { code: string; group: LocaleGroup }[])
    .filter((l) => l.group === group)
    .map((l) => locales.find((x) => x.code === l.code)!);
}
