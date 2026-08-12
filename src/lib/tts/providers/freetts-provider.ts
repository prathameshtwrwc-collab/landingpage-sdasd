import { TTSProvider, TTSResult } from "../tts-types";
import { ttsConfig, ttsTimeout } from "../tts-config";

export class TTSUnauthorizedError extends Error {}
export class TTSRateLimitedError extends Error {}
export class TTSUnavailableError extends Error {}
export class TTSTextTooLongError extends Error {}

/**
 * FreeTTS provider — dev/staging default (see docs/TTS.md licensing note).
 * Free tier is personal/non-commercial and watermarked; production must use
 * a commercial provider via TTS_PROVIDER. No voices are hardcoded here.
 */
export class FreeTTSProvider implements TTSProvider {
  private base: string;
  private apiKey?: string;

  constructor(base: string = ttsConfig.freettsBaseUrl, apiKey?: string) {
    this.base = base.replace(/\/+$/, "");
    this.apiKey = apiKey;
  }

  async synthesize(input: { text: string; voice: string; rate?: number; pitch?: number }): Promise<TTSResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ttsTimeout());

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (this.apiKey) headers["X-API-Key"] = this.apiKey;

      const synthRes = await fetch(`${this.base}/api/tts`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          text: input.text,
          voice: input.voice,
          rate: input.rate !== undefined ? `${input.rate >= 0 ? "+" : ""}${input.rate}%` : ttsConfig.rate,
          pitch: input.pitch !== undefined ? `${input.pitch >= 0 ? "+" : ""}${input.pitch}Hz` : ttsConfig.pitch,
        }),
        signal: controller.signal,
      });

      if (synthRes.status === 429) throw new TTSRateLimitedError("Rate limited by TTS provider");
      if (synthRes.status === 413) throw new TTSTextTooLongError("Text too long for TTS provider");
      if (synthRes.status === 401 || synthRes.status === 403) throw new TTSUnauthorizedError("TTS provider authorization failed");
      if (!synthRes.ok) throw new TTSUnavailableError(`TTS provider error ${synthRes.status}`);

      const json = (await synthRes.json()) as { file_id?: string };
      if (!json.file_id) throw new TTSUnavailableError("TTS provider returned no file id");

      const audioRes = await fetch(`${this.base}/api/audio/${json.file_id}`, { signal: controller.signal });
      if (audioRes.status === 429) throw new TTSRateLimitedError("Rate limited by TTS provider");
      if (!audioRes.ok) throw new TTSUnavailableError(`TTS audio error ${audioRes.status}`);

      const audioBuffer = await audioRes.arrayBuffer();
      return { audioBuffer, requestId: json.file_id };
    } finally {
      clearTimeout(timer);
    }
  }
}
