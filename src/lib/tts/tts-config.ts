import { SpeechPriority, SpeechType } from "./tts-types";

export interface TTSConfig {
  provider: string;
  freettsBaseUrl: string;
  maxChars: number;
  timeoutMs: number;
  rate: string;
  pitch: string;
  apiKey?: string;
  allowVoiceOverride: boolean;
  /**
   * Locales currently enabled for TTS. Milestone gating — start with English
   * only; verified locales are added one-by-one as they are confirmed.
   */
  activeLocales: string[];
}

function env(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

function envNumber(name: string, fallback: number): number {
  const v = process.env[name];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function envBool(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  return v === "true" || v === "1";
}

export const ttsConfig: TTSConfig = {
  provider: env("TTS_PROVIDER", "freetts"),
  freettsBaseUrl: env("FREETTS_BASE_URL", "https://freetts.org"),
  maxChars: envNumber("FREETTS_MAX_CHARS", 1000),
  timeoutMs: envNumber("FREETTS_TIMEOUT_MS", 8000),
  rate: env("FREETTS_RATE", "+0%"),
  pitch: env("FREETTS_PITCH", "+0Hz"),
  apiKey: env("FREETTS_API_KEY", "") || undefined,
  allowVoiceOverride: envBool("TTS_ALLOW_VOICE_OVERRIDE", false),
  activeLocales: env("TTS_ACTIVE_LOCALES", "en").split(",").map((s) => s.trim()).filter(Boolean),
};

export function resolveProvider(): string {
  return ttsConfig.provider;
}

export function isLocaleActive(locale: string): boolean {
  return ttsConfig.activeLocales.includes(locale);
}

export function maxChars(): number {
  return ttsConfig.maxChars;
}

export function ttsTimeout(): number {
  return ttsConfig.timeoutMs;
}

export function priorityForType(type?: SpeechType): SpeechPriority {
  switch (type) {
    case "error":
    case "warning":
    case "confirmation":
      return "HIGH";
    case "question":
    case "instruction":
    case "success":
      return "MEDIUM";
    case "label":
    case "helper":
    case "option":
    case "page":
    default:
      return "LOW";
  }
}
