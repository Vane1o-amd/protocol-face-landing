const CHEAP_MAX = 20;
const LEAD_MAX = 3;
const WINDOW_MS = 15 * 60 * 1000;

const cheap = new Map<string, number[]>();
const lead = new Map<string, number[]>();

function hit(map: Map<string, number[]>, key: string, max: number): boolean {
  const now = Date.now();
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

export function __resetLimiter(): void {
  cheap.clear();
  lead.clear();
}