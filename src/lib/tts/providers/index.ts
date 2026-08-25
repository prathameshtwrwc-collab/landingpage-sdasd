import { TTSProvider, TTSResult } from "../tts-types";

export class NativeTTSUnavailableError extends Error {}

export class NativeTTSProvider implements TTSProvider {
  async synthesize(): Promise<TTSResult> {
    throw new NativeTTSUnavailableError("ElevenLabs TTS is disabled. Use native browser speech synthesis instead.");
  }
}

export function getTTSProvider(): TTSProvider {
  return new NativeTTSProvider();
}
