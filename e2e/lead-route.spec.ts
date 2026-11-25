import { test, expect } from "@playwright/test";
import { NextRequest } from "next/server";
import { POST } from "../app/api/lead/route";
import { hashIp } from "../lib/db";

// Unit test of the lead route's delivery order: no server, no network (fetch is stubbed).
const DB = "https://db.test";
for (const name of ["SUPABASE_SERVICE_ROLE_KEY", "TG_BOT_TOKEN", "TG_CHAT_ID", "META_CAPI_TOKEN", "NEXT_PUBLIC_META_PIXEL_ID"]) {
  process.env[name] = "unit";
}
process.env.SUPABASE_URL = DB;

async function postLead(status: { db: number; tg: number }, ip: string) {
  const calls: string[] = [];
  const errors: string[] = [];
  const realFetch = globalThis.fetch;
  const realError = console.error;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);
    return new Response("{}", { status: url.startsWith(DB) ? status.db : status.tg });
  }) as typeof fetch;
  console.error = (msg: string) => errors.push(msg);
  try {
    const res = await POST(
      new NextRequest("https://www.menface.pro/api/lead", {
        method: "POST",
        headers: { origin: "https://www.menface.pro", "x-vercel-forwarded-for": ip },
        body: JSON.stringify({ name: "Test", contact: "+4700000000", consent: true }),
      }),
    );
    return { status: res.status, calls, errors };
  } finally {
    globalThis.fetch = realFetch;
    console.error = realError;
  }
}

test("Telegram fails: the lead is still saved and the request succeeds", async () => {
  const r = await postLead({ db: 201, tg: 500 }, "10.0.0.1");
  expect(r.status).toBe(200);
  expect(r.calls[0]).toBe(`${DB}/rest/v1/leads`);
  expect(r.errors).toEqual(["[/api/lead] telegram send failed"]);
});

test("both fail: 502 and both failures logged", async () => {
  const r = await postLead({ db: 500, tg: 500 }, "10.0.0.2");
  expect(r.status).toBe(502);
  expect(r.errors).toEqual(["[/api/lead] supabase save failed", "[/api/lead] telegram send failed"]);
});

test("IP hash: the salt is required in production only", () => {
  delete process.env.IP_HASH_SECRET;
  process.env.VERCEL_ENV = "preview";
  expect(hashIp("10.0.0.3")).toMatch(/^[0-9a-f]{64}$/);
  process.env.VERCEL_ENV = "production";
  try {
    expect(() => hashIp("10.0.0.3")).toThrow("IP_HASH_SECRET missing in production");
  } finally {
    delete process.env.VERCEL_ENV;
  }
});
