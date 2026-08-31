import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEnv } from "@/lib/env";
import { rateLimitCheap, rateLimit } from "@/lib/rateLimit";
import { sendLead, type LeadData } from "@/lib/telegram";
import { sendLeadEvent } from "@/lib/meta-capi";

const LeadSchema = z.object({
  name: z.string().min(1).max(200),
  contact: z.string().min(1).max(200),
  consent: z.boolean().refine((v) => v === true, "Consent required"),
  eventId: z.string().uuid().optional(),
  fbclid: z.string().optional(),
  company: z.string().optional(),
});

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-vercel-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

function originAllowed(req: NextRequest): boolean {
  const env = getEnv();
  if (env.ALLOWED_ORIGIN) {
    const allowed = env.ALLOWED_ORIGIN.split(",").map((h) => h.trim().toLowerCase());
    const origin = req.headers.get("origin")?.toLowerCase();
    if (!origin) return false;
    return allowed.includes(origin);
  }
  const host = req.headers.get("host")?.toLowerCase();
  if (!host) return false;
  return true;
}

export async function POST(req: NextRequest) {
  if (!originAllowed(req)) {
    return NextResponse.json({ ok: false, error: "Origin not allowed" }, { status: 403 });
  }

  const ip = clientIp(req);

  if (!rateLimitCheap(ip)) {
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
    return NextResponse.json(
      { ok: false, error: "Too many leads. Try later." },
      { status: 429 },
    );
  }

  const leadData: LeadData = {
    name: d.name,
    contact: d.contact,
    consent: d.consent,
    eventId: d.eventId,
    fbclid: d.fbclid,
  };

  try {
    await sendLead(leadData);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Delivery failed. Try later." },
      { status: 502 },
    );
  }

  if (d.eventId) {
    try {
      await sendLeadEvent({
        name: d.name,
        contact: d.contact,
        eventId: d.eventId,
        fbclid: d.fbclid,
        ip,
        userAgent: req.headers.get("user-agent") ?? undefined,
      });
    } catch {
      // CAPI failure never blocks — Pixel still has the event
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}