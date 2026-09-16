import { createHash } from "crypto";

// Supabase write via PostgREST — no client dependency for a single-table insert.
// SUPABASE_SERVICE_ROLE_KEY is server-only (never NEXT_PUBLIC).
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// IP is personal data under GDPR: store a salted hash instead of the raw value.
export function hashIp(ip: string): string {
  if (ip === "unknown") return "unknown";
  const secret = process.env.IP_HASH_SECRET ?? "";
  return createHash("sha256").update(`${ip}:${secret}`).digest("hex");
}

export type LeadRow = {
  name: string;
  contact: string;
  ip_hash: string;
  event_id?: string;
  fbclid?: string;
  fbp?: string;
};

export async function saveLead(row: LeadRow): Promise<void> {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("supabase env missing");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
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