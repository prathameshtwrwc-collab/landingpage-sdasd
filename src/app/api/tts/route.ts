import { NextResponse } from "next/server";
import { maxChars, isLocaleActive, ttsConfig } from "@/lib/tts/tts-config";
import { resolveVoice } from "@/lib/tts/voice-registry";
import { normalizeForSpeech, hashText } from "@/lib/tts/text-utils";
import { serverCacheGet, serverCacheSet } from "@/lib/tts/server-cache";
import { rateLimit } from "@/lib/tts/server-rate-limit";
import { getTTSProvider } from "@/lib/tts/providers";
import { TTSRateLimitedError, TTSUnavailableError, TTSTextTooLongError } from "@/lib/tts/providers/freetts-provider";

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      text?: unknown;
      locale?: unknown;
      type?: unknown;
      voice?: unknown;
      userContent?: unknown;
    } | null;

    if (!body || typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json({ success: false, error: "TTS_UNAVAILABLE" }, { status: 400 });
    }

    const locale = typeof body.locale === "string" && isLocaleActive(body.locale) ? body.locale : "en";
    const normalized = normalizeForSpeech(body.text);
    if (!normalized) {
      return NextResponse.json({ success: false, error: "TTS_UNAVAILABLE" }, { status: 400 });
    }
    if (normalized.length > maxChars()) {
      return NextResponse.json({ success: false, error: "TTS_TEXT_TOO_LONG" }, { status: 413 });
    }

    const voiceRes = resolveVoice(locale);
    if (voiceRes.status === "unavailable") {
      return NextResponse.json({ success: false, error: "TTS_VOICE_UNAVAILABLE" }, { status: 422 });
    }

    const ip = clientIp(req);
    const limit = rateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: "TTS_RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(Math.ceil((limit.retryAfterMs ?? 1000) / 1000)) } }
      );
    }

    const isUserContent = body.userContent === true;
    const cacheKey = `tts|${locale}|${voiceRes.voice}|${hashText(normalized)}`;

    let audioBuffer: Buffer | null = null;
    if (!isUserContent) {
      audioBuffer = serverCacheGet(cacheKey);
    }

    if (!audioBuffer) {
      try {
        const result = await getTTSProvider().synthesize({ text: normalized, voice: voiceRes.voice });
        audioBuffer = Buffer.from(result.audioBuffer);
        if (!isUserContent) serverCacheSet(cacheKey, audioBuffer);
      } catch (err) {
        if (err instanceof TTSRateLimitedError) {
          return NextResponse.json({ success: false, error: "TTS_RATE_LIMITED" }, { status: 429 });
        }
        if (err instanceof TTSTextTooLongError) {
          return NextResponse.json({ success: false, error: "TTS_TEXT_TOO_LONG" }, { status: 413 });
        }
        return NextResponse.json({ success: false, error: "TTS_UNAVAILABLE" }, { status: 502 });
      }
    }

    return new NextResponse(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": isUserContent ? "no-store" : "private, max-age=3600",
        "X-Request-Id": `${locale}|${voiceRes.voice}|${hashText(normalized).slice(0, 8)}`,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "TTS_UNAVAILABLE" }, { status: 500 });
  }
}
