"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAppLocale } from "@/components/i18n/I18nProvider";
import { SpeakOptions, SpeechPriority, TTSStatus } from "@/lib/tts/tts-types";
import { priorityForType } from "@/lib/tts/tts-config";
import { normalizeForSpeech, hashText } from "@/lib/tts/text-utils";
import { voiceUnavailable } from "@/lib/tts/voice-registry";

interface TTSContextValue {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  isSpeaking: boolean;
  isPaused: boolean;
  status: TTSStatus;
  currentText: string;
  speak: (opts: SpeakOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  voiceUnavailableForLocale: (locale?: string) => boolean;
}

const TTSContext = createContext<TTSContextValue | null>(null);

const ENABLED_KEY = "tts_enabled";
const CLIENT_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_ENTRIES = 100;

interface ClientCacheEntry {
  url: string;
  expiresAt: number;
}

const clientCache = new Map<string, ClientCacheEntry>();

function clientCacheGet(key: string): string | null {
  const entry = clientCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    clientCache.delete(key);
    return null;
  }
  return entry.url;
}

function clientCacheSet(key: string, url: string): void {
  clientCache.set(key, { url, expiresAt: Date.now() + CLIENT_CACHE_TTL });
  if (clientCache.size > MAX_CACHE_ENTRIES) {
    const oldest = [...clientCache.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt)[0];
    if (oldest) clientCache.delete(oldest[0]);
  }
}

function clearClientCache(): void {
  for (const entry of clientCache.values()) URL.revokeObjectURL(entry.url);
  clientCache.clear();
}

export function TTSProvider({ children }: { children: ReactNode }) {
  const { locale } = useAppLocale();

  const [enabled, setEnabledState] = useState(false);
  const [status, setStatus] = useState<TTSStatus>("idle");
  const [currentText, setCurrentText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentKeyRef = useRef<string | null>(null);
  const currentPriorityRef = useRef<SpeechPriority>("LOW");
  const hasInteractedRef = useRef(false);
  const inflightRef = useRef<Set<string>>(new Set());
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Init enabled state from localStorage (client-only).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ENABLED_KEY);
      if (stored === "1" || stored === "true") setEnabledState(true);
    } catch {
      // ignore storage access errors
    }
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      audio.onended = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setStatus("idle");
        setCurrentText("");
        currentKeyRef.current = null;
      };
      audio.onpause = () => {
        if (!audio.ended) setIsPaused(true);
      };
      audio.onplay = () => {
        setIsPaused(false);
      };
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    setStatus("idle");
    setCurrentText("");
    currentKeyRef.current = null;
    currentPriorityRef.current = "LOW";
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      setStatus("paused");
    }
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.paused && audio.src) {
      audio.play().catch(() => {
        setStatus("autoplayBlocked");
      });
      setStatus("speaking");
    }
  }, []);

  const setEnabled = useCallback(
    (v: boolean) => {
      setEnabledState(v);
      try {
        localStorage.setItem(ENABLED_KEY, v ? "1" : "0");
      } catch {
        // ignore storage access errors
      }
      if (!v) stop();
    },
    [stop]
  );

  const playBuffer = useCallback(
    async (blob: Blob, key: string) => {
      const audio = ensureAudio();
      // Priority replacement: higher-priority speech interrupts lower ones.
      const p = currentPriorityRef.current;
      if (isSpeaking && currentKeyRef.current && p !== "LOW") {
        // allow interrupt
      }
      const url = URL.createObjectURL(blob);
      clientCacheSet(key, url);
      audio.src = url;
      audio.onerror = () => {
        setStatus("idle");
        setIsSpeaking(false);
        currentKeyRef.current = null;
      };
      setStatus("speaking");
      setIsSpeaking(true);
      try {
        await audio.play();
      } catch {
        setStatus("autoplayBlocked");
        setIsSpeaking(false);
        currentKeyRef.current = null;
      }
    },
    [ensureAudio, isSpeaking]
  );

  const speak = useCallback(
    (opts: SpeakOptions) => {
      const text = normalizeForSpeech(opts.text);
      if (!text) return;

      // Interaction gate for automatic speech: only fires after the user has
      // meaningfully interacted AND the global toggle is ON.
      if (opts.automatic === true) {
        if (!enabled) return;
        if (!hasInteractedRef.current) return;
      }

      const priority = priorityForType(opts.type);
      const key = `${locale}|${hashText(text)}`;

      // Dedupe identical request already loading or speaking.
      if (inflightRef.current.has(key)) return;
      if (currentKeyRef.current === key && status !== "idle") return;

      // Priority: LOW only when idle; HIGH/MEDIUM replace current.
      if (status !== "idle" && status !== "paused") {
        if (priority === "LOW") return;
        stop();
      }

      // userContent is never cached.
      const cached = opts.userContent ? null : clientCacheGet(key);

      if (cached) {
        currentKeyRef.current = key;
        currentPriorityRef.current = priority;
        setCurrentText(text);
        const audio = ensureAudio();
        audio.src = cached;
        setStatus("speaking");
        setIsSpeaking(true);
        audio.play().catch(() => {
          setStatus("autoplayBlocked");
          setIsSpeaking(false);
          currentKeyRef.current = null;
        });
        return;
      }

      inflightRef.current.add(key);
      fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          locale,
          type: opts.type ?? "label",
          userContent: opts.userContent === true,
        }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`TTS server error ${res.status}`);
          const blob = await res.blob();
          currentKeyRef.current = key;
          currentPriorityRef.current = priority;
          setCurrentText(text);
          await playBuffer(blob, key);
        })
        .catch(async () => {
          if (!("speechSynthesis" in window)) return;
          try {
            currentKeyRef.current = key;
            currentPriorityRef.current = priority;
            setCurrentText(text);
            setStatus("speaking");
            setIsSpeaking(true);
            await new Promise<void>((resolve) => {
              const u = new SpeechSynthesisUtterance(text);
              u.lang = locale === "en" ? "en-US" : locale;
              u.rate = 1;
              u.pitch = 1;
              utteranceRef.current = u;
              u.onend = () => {
                utteranceRef.current = null;
                setIsSpeaking(false);
                setIsPaused(false);
                setStatus("idle");
                setCurrentText("");
                currentKeyRef.current = null;
                resolve();
              };
              u.onerror = () => {
                utteranceRef.current = null;
                setIsSpeaking(false);
                setIsPaused(false);
                setStatus("idle");
                currentKeyRef.current = null;
                resolve();
              };
              window.speechSynthesis.speak(u);
            });
          } catch {
            // native TTS also failed — silent
          }
        })
        .finally(() => {
          inflightRef.current.delete(key);
        });
    },
    [enabled, locale, status, stop, ensureAudio, playBuffer]
  );

  // Interaction gate: first pointer/key interaction arms automatic speech.
  useEffect(() => {
    const onInteract = () => {
      hasInteractedRef.current = true;
    };
    window.addEventListener("pointerdown", onInteract, { once: true });
    window.addEventListener("keydown", onInteract, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  // Stop on locale change and clear the client cache.
  const prevLocaleRef = useRef(locale);
  useEffect(() => {
    if (prevLocaleRef.current !== locale) {
      stop();
      clearClientCache();
      prevLocaleRef.current = locale;
    }
  }, [locale, stop]);

  // Stop on unmount.
  useEffect(() => {
    return () => stop();
  }, [stop]);

  const value = useMemo<TTSContextValue>(
    () => ({
      enabled,
      setEnabled,
      isSpeaking,
      isPaused,
      status,
      currentText,
      speak,
      stop,
      pause,
      resume,
      voiceUnavailableForLocale: (l?: string) => voiceUnavailable(l ?? locale),
    }),
    [enabled, setEnabled, isSpeaking, isPaused, status, currentText, speak, stop, pause, resume, locale]
  );

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
}

export function useTTS() {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error("useTTS must be used within TTSProvider");
  return ctx;
}
