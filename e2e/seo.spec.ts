import { expect, test } from "@playwright/test";

const SITE = "https://www.menface.pro";

test("canonicals use the served host (www)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", SITE);
  await page.goto("/privacy");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}/privacy`);
});

test("sitemap and robots use the served host", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>${SITE}</loc>`);
  expect(sitemap).not.toContain("https://menface.pro");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
});

test("unknown route returns 404", async ({ request }) => {
  expect((await request.get("/does-not-exist")).status()).toBe(404);
});
