const CHEAP_MAX = 20;
const LEAD_MAX = 3;
const WINDOW_MS = 15 * 60 * 1000;

const cheap = new Map<string, number[]>();
const lead = new Map<string, number[]>();

function hit(map: Map<string, number[]>, key: string, max: number): boolean {
  const now = Date.now();
  // Lightweight sweep: once the map grows past 500 keys, drop entries whose
  // timestamps have fully aged out of the window so dead IPs can't accumulate.
  if (map.size >= 500) {
    for (const [k, arr] of map) {
      if (arr.every((t) => now - t >= WINDOW_MS)) map.delete(k);
    }
  }
  const arr = (map.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= max) return false;
  arr.push(now);
  map.set(key, arr);
  return true;
}

export function rateLimitCheap(ip: string): boolean {
  return hit(cheap, ip, CHEAP_MAX);
}

export function rateLimit(ip: string): boolean {
  return hit(lead, ip, LEAD_MAX);
}
