import { TTSProvider, TTSResult } from "../tts-types";
import { ttsConfig, ttsTimeout } from "../tts-config";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export class ElevenLabsRateLimitedError extends Error {}
export class ElevenLabsUnavailableError extends Error {}
export class ElevenLabsTextTooLongError extends Error {}

export { ElevenLabsRateLimitedError as TTSRateLimitedError, ElevenLabsUnavailableError as TTSUnavailableError, ElevenLabsTextTooLongError as TTSTextTooLongError };

export class ElevenLabsProvider implements TTSProvider {
  private client: ElevenLabsClient;
  private voiceId: string;

  constructor(apiKey?: string, voiceId?: string) {
    this.client = new ElevenLabsClient({ apiKey: apiKey || ttsConfig.elevenLabsApiKey });
    this.voiceId = voiceId || ttsConfig.elevenLabsVoiceId || "XrExE9yKIg1WjnnlVkGX";
  }

  async synthesize(input: { text: string; voice: string; rate?: number; pitch?: number }): Promise<TTSResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ttsTimeout());

    try {
      const voiceId = input.voice || this.voiceId;
      const stream = await this.client.textToSpeech.convert(voiceId, {
        text: input.text,
        modelId: "eleven_v3",
        outputFormat: "mp3_44100_128",
        languageCode: "en",
      });

      const chunks: Uint8Array[] = [];
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const audioBuffer = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        audioBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      return { audioBuffer: audioBuffer.buffer, requestId: voiceId };
    } catch (err: any) {
      if (err.status === 429) throw new ElevenLabsRateLimitedError("Rate limited by ElevenLabs");
      if (err.status === 413 || err.message?.includes("too long")) throw new ElevenLabsTextTooLongError("Text too long for ElevenLabs");
      if (err.status === 401 || err.status === 403) throw new ElevenLabsUnavailableError("ElevenLabs authorization failed");
      throw new ElevenLabsUnavailableError(`ElevenLabs error: ${err.message || err.status || "unknown"}`);
    } finally {
      clearTimeout(timer);
    }
  }
}
