// In-memory cache with deduplication for client-side API calls.
//
// - Same-origin GET responses are additionally cached by the browser via the
//   Cache-Control headers set on every API route, so the in-memory layer only
//   needs a short TTL to make revisits feel instant.
// - `revalidate: true` bypasses the cache (used after mutations so lists are
//   always fresh). `ttlMs` overrides the default TTL for a single call.

const cache = new Map<string, { data: unknown; timestamp: number }>();
const inflight = new Map<string, Promise<unknown>>();
const TTL = 60_000; // 60 seconds

export interface CachedFetchOptions {
  /** Bypass the cache and fetch fresh data (for post-mutation reloads). */
  revalidate?: boolean;
  /** Override the default TTL for this request. */
  ttlMs?: number;
}

function cacheKey(url: string, options?: RequestInit): string {
  return `${url}_${JSON.stringify(options ?? {})}`;
}

function isCacheFresh(entry: { timestamp: number }, ttlMs: number): boolean {
  return Date.now() - entry.timestamp < ttlMs;
}

export async function cachedFetch<T>(url: string, options?: RequestInit, opts?: CachedFetchOptions): Promise<T> {
  const key = cacheKey(url, options);
  const ttlMs = opts?.ttlMs ?? TTL;

  // Post-mutation reloads skip the cache entirely (but still dedupe).
  if (opts?.revalidate) {
    const existing = inflight.get(key);
    if (existing) return existing as Promise<T>;
    return startFetch<T>(url, options, key, false);
  }

  // Serve a fresh cached entry instantly.
  const hit = cache.get(key);
  if (hit && isCacheFresh(hit, ttlMs)) {
    return hit.data as T;
  }

  // Deduplicate in-flight requests.
  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;

  return startFetch<T>(url, options, key, true);
}

async function startFetch<T>(url: string, options: RequestInit | undefined, key: string, storeInCache: boolean): Promise<T> {
  const promise = (async () => {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      if (storeInCache) cache.set(key, { data, timestamp: Date.now() });
      return data;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise as Promise<T>;
}

export function clearCache() {
  cache.clear();
  inflight.clear();
}

// Preload: start fetching data before a component mounts.
const preloads = new Map<string, Promise<unknown>>();

export function preload<T>(url: string): Promise<T> {
  const existing = preloads.get(url);
  if (existing) return existing as Promise<T>;
  const p = cachedFetch<T>(url);
  preloads.set(url, p);
  return p;
}
