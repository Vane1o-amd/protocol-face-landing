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
  test("hero text is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hero h1")).toBeVisible();
    await expect.poll(() => page.locator(".hero h1").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
});
