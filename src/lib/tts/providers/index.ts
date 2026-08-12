import { TTSProvider } from "../tts-types";
import { resolveProvider } from "../tts-config";
import { FreeTTSProvider } from "./freetts-provider";

export function getTTSProvider(): TTSProvider {
  const provider = resolveProvider();
  switch (provider) {
    case "freetts":
      return new FreeTTSProvider();
    default:
      throw new Error(`Unknown TTS provider: ${provider}`);
  }
}
