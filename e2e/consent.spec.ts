import { expect, test, type Page } from "@playwright/test";

const META = /(^|\.)facebook\.(net|com)$/;

async function visit(page: Page, route: string) {
  const meta: string[] = [];
  page.on("request", (r) => {
    if (META.test(new URL(r.url()).host)) meta.push(r.url());
  });
  await page.goto(`${route}?fbclid=e2etest`);
  await page.waitForTimeout(1500);
  return meta;
}

const fbp = (page: Page) => page.evaluate(() => document.cookie.includes("_fbp="));
const fbclid = (page: Page) => page.evaluate(() => sessionStorage.getItem("pf_fbclid"));

test("before an answer: nothing from Meta, no _fbp, no fbclid", async ({ page }) => {
  const meta = await visit(page, "/");
  expect(meta).toEqual([]);
  expect(await fbp(page)).toBe(false);
  expect(await fbclid(page)).toBeNull();
});

test("decline: nothing from Meta on any page", async ({ page }) => {
  const meta = await visit(page, "/");
  await page.locator(".btn-decline").click();
  await page.waitForTimeout(1000);
  for (const route of ["/privacy", "/success"]) meta.push(...(await visit(page, route)));
  expect(meta).toEqual([]);
  expect(await fbp(page)).toBe(false);
  expect(await fbclid(page)).toBeNull();
  await expect(page.locator(".consent-banner")).toHaveCount(0);
});

test("accept: Pixel loads, _fbp and fbclid set", async ({ page }) => {
  const meta = await visit(page, "/");
  await page.locator(".btn-allow").click();
  await expect.poll(() => meta.some((u) => u.includes("fbevents.js"))).toBe(true);
  expect(await fbp(page)).toBe(true);
  expect(await fbclid(page)).toBe("e2etest");
});

test("withdraw: the footer button clears the answer, _fbp and fbclid, and asks again", async ({ page }) => {
  await visit(page, "/");
  await page.locator(".btn-allow").click();
  await expect.poll(() => fbp(page)).toBe(true);
  await page.getByRole("button", { name: "Настройки cookie" }).click();
  await expect(page.locator(".consent-banner")).toBeVisible();
  expect(await fbp(page)).toBe(false);
  expect(await fbclid(page)).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem("pf_marketing_consent"))).toBeNull();
});

test("/privacy: the banner does not block reading the policy", async ({ page }) => {
  await visit(page, "/privacy");
  await expect(page.locator(".consent-banner")).toBeVisible();
  expect(await page.evaluate(() => document.querySelector("dialog:modal"))).toBeNull();
});

test("lead API refuses a foreign origin", async ({ request }) => {
  const res = await request.post("/api/lead", {
    headers: { origin: "https://evil.example" },
    data: { name: "x", contact: "x", consent: true },
  });
  expect(res.status()).toBe(403);
});

// The lead request is answered by the test (no real lead); only its body is checked.
async function submittedLead(page: Page, answer: "btn-decline" | "btn-allow") {
  let body: Record<string, unknown> = {};
  await page.route("**/api/lead", async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true } });
  });
  await visit(page, "/");
  await page.locator(`.${answer}`).click();
  const form = page.locator("#apply form");
  await form.locator('[name="name"]').fill("E2E Test");
  await form.locator('[name="contact"]').fill("+4700000000");
  const consent = form.locator('[name="consent"]');
  await expect(consent).not.toBeChecked(); // consent must be an active choice, never pre-ticked
  await consent.check();
  await form.locator('button[type="submit"]').click();
  await page.waitForURL("**/success");
  return body;
}

test("decline: the lead carries no eventId, so the server sends nothing to Meta", async ({ page }) => {
  const body = await submittedLead(page, "btn-decline");
  expect(body.eventId).toBeUndefined();
  expect(body.fbclid).toBeUndefined();
  expect(body.fbp).toBeUndefined();
});

test("accept: the lead carries eventId, fbclid and fbp", async ({ page }) => {
  const body = await submittedLead(page, "btn-allow");
  expect(body.eventId).toMatch(/^[0-9a-f-]{36}$/);
  expect(body.fbclid).toBe("e2etest");
  expect(body.fbclidAt).toBeGreaterThan(Date.now() - 60_000);
  expect(body.fbp).toMatch(/^fb\.1\./);
});

for (const answer of ["btn-decline", "btn-allow"] as const) {
  test(`no CSP violations after ${answer}`, async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { csp: string[] }).csp = [];
      document.addEventListener("securitypolicyviolation", (e) =>
        (window as unknown as { csp: string[] }).csp.push(`${e.violatedDirective} ${e.blockedURI}`),
      );
    });
    for (const route of ["/", "/privacy", "/success", "/does-not-exist"]) {
      await page.goto(route);
      const banner = page.locator(`.${answer}`);
      if (await banner.isVisible()) await banner.click();
      await page.waitForTimeout(1500);
      expect(await page.evaluate(() => (window as unknown as { csp: string[] }).csp)).toEqual([]);
    }
  });
}
