import { createHash } from "node:crypto";
import { getEnv } from "./env";

const GRAPH_API = "https://graph.facebook.com/v26.0";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}


export interface CapiLeadInput {
  name: string;
  contact: string; // phone or telegram handle
  eventId: string;
  fbclid?: string;
  fbclidAt?: number; // ms, when the ad click landed
  fbp?: string;
  ip?: string;
  userAgent?: string;
}

export async function sendLeadEvent(input: CapiLeadInput): Promise<void> {
  const env = getEnv();
  const pixelId = env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = env.META_CAPI_TOKEN;

  const userData: Record<string, string> = {};
  if (input.name) {
    const parts = input.name.trim().split(/\s+/);
    if (parts[0]) userData.fn = sha256(parts[0].toLowerCase());
    if (parts[1]) userData.ln = sha256(parts[1].toLowerCase());
  }
  const phone = normalizePhone(input.contact);
  if (/^\+?\d{7,}$/.test(phone)) {
    userData.ph = sha256(phone);
  }
  // fbp/fbc go to CAPI raw (click/cookie ids are not hashed — only personal
  // identifiers like fn/ln/ph/em are, per Meta's user_data spec).
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbclid) userData.fbc = `fb.1.${input.fbclidAt ?? Date.now()}.${input.fbclid}`;
  if (input.ip) userData.client_ip_address = input.ip;
  if (input.userAgent) userData.client_user_agent = input.userAgent;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        user_data: userData,
      },
    ],
  };

  // Token in the body, not the URL: URLs end up in logs.
  const res = await fetch(`${GRAPH_API}/${pixelId}/events`, {
    method: "POST",
    signal: AbortSignal.timeout(8000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, access_token: token }),
  });
  if (!res.ok) throw new Error(`CAPI ${res.status}: ${await res.text()}`);
}