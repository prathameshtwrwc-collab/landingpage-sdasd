/**
 * Best-effort in-memory server cache for TTS audio.
 * NOT a reliable shared cache (serverless instances don't share memory).
 * Bounded size, TTL'd, oldest-first eviction. Never persisted to disk.
 * The client-side cache is the primary mechanism for repeated static audio.
 */

interface CacheEntry {
  buffer: Buffer;
  expiresAt: number;
  lastAccess: number;
}

const MAX_ENTRIES = 200;
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

const cache = new Map<string, CacheEntry>();

function pruneLocked(): void {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(key);
  }
  if (cache.size > MAX_ENTRIES) {
    const sorted = [...cache.entries()].sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    const toEvict = sorted.slice(0, sorted.length - MAX_ENTRIES);
    for (const [key] of toEvict) cache.delete(key);
  }
}

export function serverCacheGet(key: string): Buffer | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  entry.lastAccess = Date.now();
  return entry.buffer;
}

export function serverCacheSet(key: string, buffer: Buffer, ttlMs: number = DEFAULT_TTL_MS): void {
  cache.set(key, { buffer, expiresAt: Date.now() + ttlMs, lastAccess: Date.now() });
  pruneLocked();
}

export function serverCacheSize(): number {
  return cache.size;
}
