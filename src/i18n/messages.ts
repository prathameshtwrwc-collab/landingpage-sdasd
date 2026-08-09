import en from "../../messages/en.json";
import hi from "../../messages/hi.json";
import mr from "../../messages/mr.json";
import bn from "../../messages/bn.json";
import ta from "../../messages/ta.json";
import te from "../../messages/te.json";
import gu from "../../messages/gu.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import ar from "../../messages/ar.json";

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

const catalogs: Record<string, Messages> = { en, hi, mr, bn, ta, te, gu, es, fr, ar };

export function getMessages(locale: string): Messages {
  const base = catalogs.en ?? {};
  const override = catalogs[locale];
  return override ? deepMerge(base, override) : base;
}
