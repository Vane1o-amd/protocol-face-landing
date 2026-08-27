import { getEnv } from "./env";

export interface LeadData {
  name: string;
  contact: string; // phone or telegram handle
  goal: string;
  consent: boolean;
  utm?: { source?: string; medium?: string; campaign?: string };
  eventId?: string;
  fbclid?: string;
}

function sanitize(text: string): string {
  return text
    .split("")
    .filter((c) => {
      const code = c.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join("")
    .trim();
}

export function composeLeadMessage(d: LeadData): string {
  const lines = [
    "🔔 Новый лид — Protocol Face",
    "",
    `👤 Имя: ${sanitize(d.name)}`,
    `📞 Контакт: ${sanitize(d.contact)}`,
    `🎯 Цель: ${sanitize(d.goal)}`,
    `✅ Согласие: ${d.consent ? "да" : "нет"}`,
  ];
  if (d.utm?.source) lines.push(`📊 utm_source: ${sanitize(d.utm.source)}`);
  if (d.utm?.medium) lines.push(`📊 utm_medium: ${sanitize(d.utm.medium)}`);
  if (d.utm?.campaign) lines.push(`📊 utm_campaign: ${sanitize(d.utm.campaign)}`);
  return lines.join("\n");
}

export async function sendLead(d: LeadData): Promise<void> {
  const env = getEnv();
  const text = composeLeadMessage(d);
  const url = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TG_CHAT_ID,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram ${res.status}: ${body}`);
  }
}