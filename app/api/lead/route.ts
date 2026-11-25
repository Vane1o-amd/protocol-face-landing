import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitCheap, rateLimit } from "@/lib/rateLimit";
import { sendLead, type LeadData } from "@/lib/telegram";
import { sendLeadEvent } from "@/lib/meta-capi";
import { saveLead, hashIp } from "@/lib/db";
import { alert, failReason } from "@/lib/alert";

const LeadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  contact: z.string().trim().min(1).max(200),
  consent: z.boolean().refine((v) => v === true, "Consent required"),
  eventId: z.string().uuid().optional(),
  fbclid: z.string().max(512).optional(),
  fbclidAt: z.number().int().positive().optional(),
  fbp: z.string().max(512).optional(),
  company: z.string().max(200).optional(),
});

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-vercel-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

// Hardcoded: the domain never changes, so no env var. Local runs get 403 by design.
const ALLOWED_ORIGINS = new Set([
  "https://menface.pro",
  "https://www.menface.pro",
]);

function originAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin")?.toLowerCase();
  return !!origin && ALLOWED_ORIGINS.has(origin);
}

// One retry: a single Telegram hiccup must not cost a notification. Returns the last error, or null.
async function sendLeadWithRetry(lead: LeadData): Promise<unknown> {
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await sendLead(lead);
      return null;
    } catch (err) {
      lastError = err;
      console.error(`[/api/lead] telegram send failed (attempt ${attempt})`, err);
    }
  }
  return lastError;
}

export async function POST(req: NextRequest) {
  if (!originAllowed(req)) {
    return NextResponse.json({ ok: false, error: "Origin not allowed" }, { status: 403 });
  }

  const ip = clientIp(req);

  if (!rateLimitCheap(ip)) {
    await alert("menface: rate limit hit on /api/lead (requests)", "rate-limit");
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try later." },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const msg = firstIssue?.message ?? "Validation error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const d = parsed.data;

  if (d.company && d.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!rateLimit(ip)) {
    await alert("menface: rate limit hit on /api/lead (leads)", "rate-limit");
    return NextResponse.json(
      { ok: false, error: "Too many leads. Try later." },
      { status: 429 },
    );
  }

  const leadData: LeadData = {
    name: d.name,
    contact: d.contact,
  };

  // The DB is the system of record, Telegram the notification: the lead is lost only if both fail.
  let dbError: unknown = null;
  try {
    await saveLead({
      name: d.name,
      contact: d.contact,
      ip_hash: hashIp(ip),
      event_id: d.eventId,
      fbclid: d.fbclid,
      fbp: d.fbp,
      consent: d.consent,
    });
  } catch (err) {
    dbError = err;
    console.error("[/api/lead] supabase save failed", err);
  }
  const tgError = await sendLeadWithRetry(leadData);

  if (dbError && tgError) {
    await alert(`menface: lead LOST, database (${failReason(dbError)}) and Telegram (${failReason(tgError)}) failed`);
    return NextResponse.json({ ok: false, error: "Delivery failed. Try later." }, { status: 502 });
  }
  if (tgError) await alert(`menface: lead saved, Telegram notify failed (${failReason(tgError)})`);
  if (dbError) await alert(`menface: lead NOT saved in database (${failReason(dbError)}), Telegram notify sent`);

  // CAPI only for leads with an eventId: the form sends one only after a marketing yes on the banner.
  if (d.eventId) {
    try {
      await sendLeadEvent({
        name: d.name,
        contact: d.contact,
        eventId: d.eventId,
        fbclid: d.fbclid,
        fbclidAt: d.fbclidAt,
        fbp: d.fbp,
        ip,
        userAgent: req.headers.get("user-agent") ?? undefined,
      });
    } catch (err) {
      // CAPI failure never blocks the lead: the Pixel still has the event.
      console.error("[/api/lead] CAPI send failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}