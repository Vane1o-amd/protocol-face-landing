import { createHash } from "node:crypto";
import { getEnv } from "./env";

const GRAPH_API = "https://graph.facebook.com/v18.0";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

function synthesizeFbc(fbclid?: string): string | undefined {
  if (!fbclid) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
}

export interface CapiLeadInput {
  name: string;
  contact: string; // phone or telegram handle
  eventId: string;
  fbclid?: string;
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
  if (input.fbp) userData.fbp = sha256(input.fbp);
  const fbc = synthesizeFbc(input.fbclid);
  if (fbc) userData.fbc = sha256(fbc);
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

  try {
    const url = `${GRAPH_API}/${pixelId}/events?access_token=${token}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`CAPI ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error("CAPI failure:", err);
  }
}