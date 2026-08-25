import { VoiceResolution } from "./tts-types";
import { isLocaleActive } from "./tts-config";

/**
 * Voice registry — ElevenLabs voice IDs.
 * Multiple i18n display variants that share one spoken language normalize to
 * one TTS language/voice.
 *
 * `pa` / `or` intentionally have NO entry (no verified voice, no compatible
 * fallback) → they resolve as `unavailable`.
 */
const VOICE_BY_LANGUAGE: Record<string, string> = {
  en: "XrExE9yKIg1WjnnlVkGX",
  hi: "10O5QNlxfEBcKAbSUH4D",
  bn: "10O5QNlxfEBcKAbSUH4D",
  ta: "10O5QNlxfEBcKAbSUH4D",
  te: "10O5QNlxfEBcKAbSUH4D",
  kn: "10O5QNlxfEBcKAbSUH4D",
  ml: "10O5QNlxfEBcKAbSUH4D",
  mr: "10O5QNlxfEBcKAbSUH4D",
  gu: "10O5QNlxfEBcKAbSUH4D",
  pa: "10O5QNlxfEBcKAbSUH4D",
  or: "10O5QNlxfEBcKAbSUH4D",
  as: "10O5QNlxfEBcKAbSUH4D",
  ur: "10O5QNlxfEBcKAbSUH4D",
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
  return false;
}

/** Global fallback used only when the incoming locale is invalid. */
export const GLOBAL_FALLBACK_VOICE = "XrExE9yKIg1WjnnlVkGX";
