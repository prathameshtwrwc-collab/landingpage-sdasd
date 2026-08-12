export type SpeechType =
  | "question"
  | "option"
  | "error"
  | "warning"
  | "success"
  | "instruction"
  | "label"
  | "helper"
  | "confirmation"
  | "page";

export type SpeechPriority = "HIGH" | "MEDIUM" | "LOW";

export interface SpeakOptions {
  text: string;
  type?: SpeechType;
  rate?: number;
  pitch?: number;
  /** Mark as user-entered content — never cached client or server side. */
  userContent?: boolean;
  /** Automatic speech only fires when the global toggle is ON and the user has interacted. */
  automatic?: boolean;
}

export type TTSStatus = "idle" | "loading" | "speaking" | "paused" | "autoplayBlocked";

export type TTSClientErrorCode =
  | "TTS_TEXT_TOO_LONG"
  | "TTS_VOICE_UNAVAILABLE"
  | "TTS_RATE_LIMITED"
  | "TTS_UNAVAILABLE";

export interface TTSResult {
  audioBuffer: ArrayBuffer;
  requestId?: string;
}

export interface TTSProvider {
  synthesize(input: { text: string; voice: string; rate?: number; pitch?: number }): Promise<TTSResult>;
}

export type VoiceResolution =
  | { status: "exact"; voice: string }
  | { status: "unavailable" };
