import { test, expect } from "@playwright/test";
import { NextRequest } from "next/server";
import { POST } from "../app/api/lead/route";
import { hashIp } from "../lib/db";

// Unit tests of the lead route: no server, no network (fetch is stubbed). Runs serially:
// the alert throttle and rate limits are module state.
test.describe.configure({ mode: "serial" });

const DB = "https://db.test";
const LEAD_BOT_ID = "unit-lead";
const ALERT_BOT_ID = "unit-alert";
const LEAD_BOT = `https://api.telegram.org/bot${LEAD_BOT_ID}/`;
const ALERT_BOT = `https://api.telegram.org/bot${ALERT_BOT_ID}/`;
const LEAD = { name: "Test Person", contact: "+4700000000", consent: true };
const ENV: [string, string][] = [
  ["SUPABASE_URL", DB],
  ["SUPABASE_SERVICE_ROLE_KEY", "unit"],
  ["TG_CHAT_ID", "unit"],
  ["META_CAPI_TOKEN", "unit"],
  ["NEXT_PUBLIC_META_PIXEL_ID", "unit"],
  ["TELEGRAM_ALERT_CHAT_ID", "unit"],
  ["TG_BOT_TOKEN", LEAD_BOT_ID],
  ["TELEGRAM_ALERT_BOT_TOKEN", ALERT_BOT_ID],
];
for (const [name, value] of ENV) process.env[name] = value;

let ipSeq = 0;

// `tg` lists the lead bot's status per attempt; alerts always get 200.
async function postLead(status: { db: number; tg: number[] }, ip = `10.0.1.${++ipSeq}`) {
  const tg = [...status.tg];
  const leadCalls: string[] = [];
  const alerts: string[] = [];
  const errors: string[] = [];
  const realFetch = globalThis.fetch;
  const realError = console.error;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.startsWith(ALERT_BOT)) {
      alerts.push(JSON.parse(String(init?.body)).text);
      return new Response("{}", { status: 200 });
    }
    if (url.startsWith(LEAD_BOT)) {
      leadCalls.push(url);
      return new Response("{}", { status: tg.shift() ?? 200 });
    }
    return new Response("{}", { status: url.startsWith(DB) ? status.db : 200 });
  }) as typeof fetch;
  console.error = (msg: string) => errors.push(msg);
  try {
    const res = await POST(
      new NextRequest("https://www.menface.pro/api/lead", {
        method: "POST",
        headers: { origin: "https://www.menface.pro", "x-vercel-forwarded-for": ip },
        body: JSON.stringify(LEAD),
      }),
    );
    return { status: res.status, leadCalls, alerts, errors };
  } finally {
    globalThis.fetch = realFetch;
    console.error = realError;
  }
}

const noLeadData = (alerts: string[]) => {
  for (const a of alerts) {
    expect(a).not.toContain(LEAD.name);
    expect(a).not.toContain(LEAD.contact);
  }
};

test("Telegram fails twice: lead saved, one retry, one alert without lead data", async () => {
  const r = await postLead({ db: 201, tg: [500, 500] });
  expect(r.status).toBe(200);
  expect(r.leadCalls).toHaveLength(2);
  expect(r.alerts).toEqual(["menface: lead saved, Telegram notify failed (500)"]);
  noLeadData(r.alerts);
});

test("Telegram fails once: the retry delivers, no alert", async () => {
  const r = await postLead({ db: 201, tg: [500, 200] });
  expect(r.status).toBe(200);
  expect(r.leadCalls).toHaveLength(2);
  expect(r.alerts).toEqual([]);
});

test("database fails, Telegram works: alert says the lead is not in the database", async () => {
  const r = await postLead({ db: 500, tg: [200] });
  expect(r.status).toBe(200);
  expect(r.alerts).toEqual(["menface: lead NOT saved in database (500), Telegram notify sent"]);
});

test("both fail: 502, both logged, one 'lead LOST' alert", async () => {
  const r = await postLead({ db: 500, tg: [500, 500] });
  expect(r.status).toBe(502);
  expect(r.errors).toEqual([
    "[/api/lead] supabase save failed",
    "[/api/lead] telegram send failed (attempt 1)",
    "[/api/lead] telegram send failed (attempt 2)",
  ]);
  expect(r.alerts).toEqual(["menface: lead LOST, database (500) and Telegram (500) failed"]);
  noLeadData(r.alerts);
});

test("rate limit: alerts once per hour, not on every hit", async () => {
  const ip = "10.0.2.1";
  for (let i = 0; i < 3; i++) expect((await postLead({ db: 201, tg: [200] }, ip)).status).toBe(200);
  const first = await postLead({ db: 201, tg: [200] }, ip);
  expect(first.status).toBe(429);
  expect(first.alerts).toEqual(["menface: rate limit hit on /api/lead (leads)"]);
  const second = await postLead({ db: 201, tg: [200] }, ip);
  expect(second.status).toBe(429);
  expect(second.alerts).toEqual([]);
});

test("alert vars missing: log only, the visitor still gets success", async () => {
  delete process.env.TELEGRAM_ALERT_BOT_TOKEN;
  try {
    const r = await postLead({ db: 201, tg: [500, 500] });
    expect(r.status).toBe(200);
    expect(r.alerts).toEqual([]);
    expect(r.errors).toContain("[alert] TELEGRAM_ALERT_* not set:");
  } finally {
    process.env.TELEGRAM_ALERT_BOT_TOKEN = ALERT_BOT_ID;
  }
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
