const cache = new Map<string, { data: unknown; timestamp: number }>();
const TTL = 30_000; // 30 seconds

export async function cachedFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const key = `${url}_${JSON.stringify(options ?? {})}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.timestamp < TTL) {
    return hit.data as T;
  }
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  cache.set(key, { data, timestamp: Date.now() });
  return data as T;
}

export function clearCache() {
  cache.clear();
}
