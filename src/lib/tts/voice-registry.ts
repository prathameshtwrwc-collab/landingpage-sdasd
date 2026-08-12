import { VoiceResolution } from "./tts-types";
import { isLocaleActive } from "./tts-config";

/**
 * Voice registry — verified against FreeTTS `GET /api/voices` (2026-08-12).
 * Multiple i18n display variants that share one spoken language normalize to
 * one TTS language/voice. No invented voice IDs.
 *
 * `pa` / `or` intentionally have NO entry (no verified voice, no compatible
 * fallback) → they resolve as `unavailable`.
 */
const VOICE_BY_LANGUAGE: Record<string, string> = {
  en: "en-US-JennyNeural",
  es: "es-ES-ElviraNeural",
  fr: "fr-FR-DeniseNeural",
  de: "de-DE-KatjaNeural",
  ru: "ru-RU-SvetlanaNeural",
  zh: "zh-CN-XiaoxiaoNeural",
  "zh-tw": "zh-TW-HsiaoChenNeural",
  ja: "ja-JP-NanamiNeural",
  it: "it-IT-ElsaNeural",
  tr: "tr-TR-EmelNeural",
  ar: "ar-SA-ZariyahNeural",
  bn: "bn-IN-TanishaaNeural",
  fi: "fi-FI-NooraNeural",
  he: "he-IL-HilaNeural",
  el: "el-GR-AthinaNeural",
  ms: "ms-MY-YasminNeural",
  pt: "pt-PT-RaquelNeural",
  ur: "ur-IN-GulNeural",
  hi: "hi-IN-SwaraNeural",
  mr: "mr-IN-AarohiNeural",
  gu: "gu-IN-DhwaniNeural",
  ta: "ta-IN-PallaviNeural",
  te: "te-IN-ShrutiNeural",
  kn: "kn-IN-SapnaNeural",
  ml: "ml-IN-SobhanaNeural",
};

/** i18n locale → normalized TTS language. Identity unless listed. */
export function normalizeLanguage(locale: string): string {
  switch (locale) {
    case "ur-in":
      return "ur";
    default:
      return locale;
  }
}

/**
 * Resolve a voice for the given i18n locale.
 * - Locales not yet active in this milestone → `unavailable` (no audio).
 * - `pa`/`or` → `unavailable` (no verified voice, no Hindi fallback).
 * - Unknown/invalid locale → `en` global fallback.
 */
export function resolveVoice(locale: string): VoiceResolution {
  if (!isLocaleActive(locale)) return { status: "unavailable" };

  const language = normalizeLanguage(locale);
  const voice = VOICE_BY_LANGUAGE[language];
  if (!voice) return { status: "unavailable" };
  return { status: "exact", voice };
}

/** Exposed for the client so UI can show the voice-unavailable state without calling the API. */
export function voiceUnavailable(locale: string): boolean {
  return resolveVoice(locale).status === "unavailable";
}

/** Global fallback used only when the incoming locale is invalid. */
export const GLOBAL_FALLBACK_VOICE = "en-US-JennyNeural";
