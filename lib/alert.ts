// Ops alerts to Ivan's alert-only Telegram bot. Never carries lead data, never throws:
// an alert failure must not change the visitor's response.
const HOUR_MS = 60 * 60 * 1000;
// ponytail: throttle lives in instance memory (resets on cold start); a shared store if alerts get noisy.
const lastSent = new Map<string, number>();

export async function alert(text: string, throttleKey?: string): Promise<void> {
  if (throttleKey) {
    const last = lastSent.get(throttleKey);
    if (last !== undefined && Date.now() - last < HOUR_MS) return;
    lastSent.set(throttleKey, Date.now());
  }
  const token = process.env.TELEGRAM_ALERT_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ALERT_CHAT_ID;
  if (!token || !chatId) {
    console.error("[alert] TELEGRAM_ALERT_* not set:", text);
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      signal: AbortSignal.timeout(5000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) console.error("[alert] send failed", res.status);
  } catch (err) {
    console.error("[alert] send failed", err);
  }
}

// A failure reason safe for an alert: the HTTP status or the error name, never the message body.
export function failReason(err: unknown): string {
  if (!(err instanceof Error)) return "unknown";
  return err.message.match(/\b[1-5]\d\d\b/)?.[0] ?? err.name;
}
