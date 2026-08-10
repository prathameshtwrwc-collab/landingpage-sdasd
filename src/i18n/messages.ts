import en from "../../messages/en.json";
import hi from "../../messages/hi.json";
import mr from "../../messages/mr.json";
import bn from "../../messages/bn.json";
import ta from "../../messages/ta.json";
import te from "../../messages/te.json";
import gu from "../../messages/gu.json";
import kn from "../../messages/kn.json";
import pa from "../../messages/pa.json";
import ml from "../../messages/ml.json";
import or from "../../messages/or.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import de from "../../messages/de.json";
import ru from "../../messages/ru.json";
import zh from "../../messages/zh.json";
import zhTw from "../../messages/zh-tw.json";
import ja from "../../messages/ja.json";
import it from "../../messages/it.json";
import tr from "../../messages/tr.json";
import ar from "../../messages/ar.json";
import fi from "../../messages/fi.json";
import he from "../../messages/he.json";
import el from "../../messages/el.json";
import ms from "../../messages/ms.json";
import pt from "../../messages/pt.json";
import ur from "../../messages/ur.json";

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

const catalogs: Record<string, Messages> = {
  en, hi, mr, bn, ta, te, gu, kn, pa, ml, or,
  es, fr, de, ru, zh, "zh-tw": zhTw, ja, it, tr, ar, fi, he, el, ms, pt, ur,
  "ur-in": ur,
};

export function getMessages(locale: string): Messages {
  const base = catalogs.en ?? {};
  const override = catalogs[locale];
  return override ? deepMerge(base, override) : base;
}
