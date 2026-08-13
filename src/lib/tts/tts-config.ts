import { SpeechPriority, SpeechType } from "./tts-types";

export interface TTSConfig {
  provider: string;
  elevenLabsApiKey: string;
  elevenLabsVoiceId: string;
  maxChars: number;
  timeoutMs: number;
  allowVoiceOverride: boolean;
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
  provider: env("TTS_PROVIDER", "elevenlabs"),
  elevenLabsApiKey: env("ELEVENLABS_API_KEY", ""),
  elevenLabsVoiceId: env("ELEVENLABS_VOICE_ID", "XrExE9yKIg1WjnnlVkGX"),
  maxChars: envNumber("TTS_MAX_CHARS", 1000),
  timeoutMs: envNumber("TTS_TIMEOUT_MS", 8000),
  allowVoiceOverride: envBool("TTS_ALLOW_VOICE_OVERRIDE", false),
  activeLocales: env("TTS_ACTIVE_LOCALES", "en,hi,bn,ta,te,kn,ml,mr,gu,pa,or,as,ur").split(",").map((s) => s.trim()).filter(Boolean),
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
