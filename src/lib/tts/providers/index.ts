import { TTSProvider } from "../tts-types";
import { resolveProvider } from "../tts-config";
import { ElevenLabsProvider } from "./elevenlabs-provider";

export function getTTSProvider(): TTSProvider {
  const provider = resolveProvider();
  switch (provider) {
    case "elevenlabs":
      return new ElevenLabsProvider();
    default:
      return new ElevenLabsProvider();
  }
}
