/**
 * Per-IP in-memory rate limiter for the TTS endpoint.
 * Min-interval between requests + max requests per window.
 * In-memory only — documented as non-shared across serverless instances.
 */

const MIN_INTERVAL_MS = 500;
const MAX_PER_WINDOW = 15;
const WINDOW_MS = 60 * 1000; // 1 minute

interface Bucket {
  lastRequestAt: number;
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

export function rateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket) {
    bucket = { lastRequestAt: 0, timestamps: [] };
    buckets.set(ip, bucket);
  }

  if (now - bucket.lastRequestAt < MIN_INTERVAL_MS) {
    return { allowed: false, retryAfterMs: MIN_INTERVAL_MS - (now - bucket.lastRequestAt) };
  }

  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
  if (bucket.timestamps.length >= MAX_PER_WINDOW) {
    const oldest = bucket.timestamps[0] ?? now;
    return { allowed: false, retryAfterMs: Math.max(WINDOW_MS - (now - oldest), 1000) };
  }

  bucket.lastRequestAt = now;
  bucket.timestamps.push(now);
  return { allowed: true };
}

export function rateLimitSize(): number {
  return buckets.size;
}
