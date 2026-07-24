// In-memory cache with deduplication for client-side API calls

const cache = new Map<string, { data: unknown; timestamp: number }>();
const inflight = new Map<string, Promise<unknown>>();
const TTL = 45_000; // 45 seconds

export async function cachedFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const key = `${url}_${JSON.stringify(options ?? {})}`;

  // Check cache first
  const hit = cache.get(key);
  if (hit && Date.now() - hit.timestamp < TTL) {
    return hit.data as T;
  }

  // Deduplicate in-flight requests
  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;

  // Start new fetch
  const promise = (async () => {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      cache.set(key, { data, timestamp: Date.now() });
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

// Preload: start fetching data before component mounts
const preloads = new Map<string, Promise<unknown>>();

export function preload<T>(url: string): Promise<T> {
  const existing = preloads.get(url);
  if (existing) return existing as Promise<T>;
  const p = cachedFetch<T>(url);
  preloads.set(url, p);
  return p;
}
