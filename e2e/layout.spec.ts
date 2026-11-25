import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/privacy", "/success", "/does-not-exist"];
const WIDTHS = [320, 390, 768, 1024, 1440];

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem("pf_marketing_consent", "denied"));
});

for (const width of WIDTHS) {
  for (const route of ROUTES) {
    test(`no horizontal scroll: ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.mouse.wheel(0, 30000);
      await page.waitForTimeout(500);
      const { scroll, client } = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(scroll).toBeLessThanOrEqual(client);
    });
  }
}

for (const route of ROUTES) {
  test(`one h1, lang ru, named controls: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    const unnamed = await page.evaluate(() =>
      [...document.querySelectorAll("button, a[href]")]
        .filter((el) => !el.closest("[aria-hidden=true]"))
        .filter((el) => !(el.getAttribute("aria-label") || el.textContent || "").trim())
        .map((el) => el.outerHTML.slice(0, 80)),
    );
    expect(unnamed).toEqual([]);
  });
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("hero text is visible and nothing covers it", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator(".hero h1");
    await expect.poll(() => h1.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    // toBeVisible ignores overlays: check what is actually on top at the heading's centre.
    const onTop = await h1.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    });
    expect(onTop).toBe(true);
  });

  test("motion items rendered hidden are shown", async ({ page }) => {
    await page.goto("/");
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('[style*="opacity:0"]')].filter((el) => getComputedStyle(el).opacity !== "1").length,
    );
    expect(hidden).toBe(0);
    expect(await page.locator('[style*="opacity:0"]').count()).toBeGreaterThan(0);
  });
});
