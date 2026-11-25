import { createHash } from "crypto";

// Supabase write via PostgREST — no client dependency for a single-table insert.
// SUPABASE_SERVICE_ROLE_KEY is server-only (never NEXT_PUBLIC).

// IP is personal data under GDPR: store a salted hash instead of the raw value.
// Production must have the salt (an unsalted hash of an IPv4 is reversible); Preview has none by design.
export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET ?? "";
  if (!secret && process.env.VERCEL_ENV === "production") throw new Error("IP_HASH_SECRET missing in production");
  return createHash("sha256").update(`${ip}:${secret}`).digest("hex");
}

type LeadRow = {
  name: string;
  contact: string;
  ip_hash: string;
  event_id?: string;
  fbclid?: string;
  fbp?: string;
  consent: boolean;
};

export async function saveLead(row: LeadRow): Promise<void> {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("supabase env missing");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
    signal: AbortSignal.timeout(8000),
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error(`supabase insert failed: ${res.status}`);
  }
}