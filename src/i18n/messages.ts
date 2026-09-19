type Messages = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const key of Object.keys(override)) {
    const baseValue = out[key];
    const overrideValue = override[key];
    if (isRecord(baseValue) && isRecord(overrideValue)) {
      out[key] = deepMerge(baseValue, overrideValue);
    } else {
      out[key] = overrideValue;
    }
  }
  return out;
}

const localeFiles: Record<string, string> = {
  en: "../../messages/en.json",
  hi: "../../messages/hi.json",
  mr: "../../messages/mr.json",
  bn: "../../messages/bn.json",
  ta: "../../messages/ta.json",
  te: "../../messages/te.json",
  gu: "../../messages/gu.json",
  kn: "../../messages/kn.json",
  pa: "../../messages/pa.json",
  ml: "../../messages/ml.json",
  or: "../../messages/or.json",
  es: "../../messages/es.json",
  fr: "../../messages/fr.json",
  de: "../../messages/de.json",
  ru: "../../messages/ru.json",
  zh: "../../messages/zh.json",
  "zh-tw": "../../messages/zh-tw.json",
  ja: "../../messages/ja.json",
  it: "../../messages/it.json",
  tr: "../../messages/tr.json",
  ar: "../../messages/ar.json",
  fi: "../../messages/fi.json",
  he: "../../messages/he.json",
  el: "../../messages/el.json",
  ms: "../../messages/ms.json",
  pt: "../../messages/pt.json",
  ur: "../../messages/ur.json",
  "ur-in": "../../messages/ur.json",
};

const cache = new Map<string, Messages>();

export async function getMessages(locale: string): Promise<Messages> {
  const base = cache.get("en") ?? (await import("../../messages/en.json")).default;
  cache.set("en", base);

  if (locale === "en") return base;

  const key = locale;
  const cached = cache.get(key);
  if (cached) return deepMerge(base, cached);

  const file = localeFiles[key];
  if (!file) return base;

  const override = (await import(/* webpackChunkName: "locale-[request]" */ file)).default;
  cache.set(key, override);
  return deepMerge(base, override);
}
