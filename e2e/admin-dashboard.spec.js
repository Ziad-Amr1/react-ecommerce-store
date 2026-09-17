import { test, expect } from "@playwright/test";
import { createApiState, installMockApi } from "./support/mockApi.js";

test.describe("Admin Dashboard", () => {
  let state;

  test.beforeEach(async ({ page }) => {
    state = createApiState();
    await installMockApi(page, state);
  });

  // The chart svg is wrapped in `dir="ltr"` regardless of page direction, so
  // the y-axis ticks are always discoverable as semantic SVG <text> without
  // relying on Recharts internal class names.
  const chartSvg = (page) => page.locator('div[dir="ltr"] svg').first();
  const currencyTicks = (page, pattern) =>
    page.locator('div[dir="ltr"] svg text').filter({ hasText: pattern });

  // Every y-axis tick must render fully inside the svg/axis lane — a label
  // widened beyond the lane would start left of the svg or overflow its edge.
  async function expectTicksFit(page, pattern) {
    const svgBox = await chartSvg(page).boundingBox();
    expect(svgBox).not.toBeNull();

    const ticks = currencyTicks(page, pattern);
    await expect(ticks.first()).toBeVisible();
    expect(await ticks.count()).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < (await ticks.count()); i++) {
      const box = await ticks.nth(i).boundingBox();
      expect(box).not.toBeNull();
      // Allow sub-pixel tolerance; a clipped/truncated label escapes the lane.
      expect(box.x).toBeGreaterThanOrEqual(svgBox.x - 0.5);
      expect(box.x + box.width).toBeLessThanOrEqual(svgBox.x + svgBox.width + 0.5);
    }
  }

  test("renders KPIs, revenue card and the daily-revenue chart", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Commerce Health" })).toBeVisible();
    await expect(page.getByText("Total Orders").first()).toBeVisible();
    await expect(page.getByText("16").first()).toBeVisible();
    await expect(page.getByText("EGP 89,450.00").first()).toBeVisible();

    // The chart's sr-only accessibility list mirrors the real daily points.
    await expect(page.locator(".sr-only ul li")).toHaveCount(7);
  });

  test("LTR y-axis labels are not clipped and the EGP 120K peak label fits", async ({ page }) => {
    await page.goto("/admin");

    // "EGP 120K" is the widest compact label in the fake data (today's peak).
    const peak = page.locator('div[dir="ltr"] svg text', { hasText: "EGP 120K" });
    await expect(peak.first()).toBeVisible();

    await expectTicksFit(page, /^EGP/);
  });

  test("RTL Arabic y-axis labels fit a wide-enough lane", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("language", "ar"));
    await page.goto("/admin");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { name: "صحة التجارة" })).toBeVisible();

    // Arabic compact-currency ticks (e.g. "١٢٠ ألف ج.م.") must stay in the lane.
    await expectTicksFit(page, /ألف/);
  });

  test("date range selector filters the chart to the chosen window", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator(".sr-only ul li")).toHaveCount(7);

    await page.locator('[data-slot="select-trigger"]').filter({ hasText: "All time" }).click();
    await page.getByRole("option", { name: "Last 3 days" }).click();

    await expect(page.locator(".sr-only ul li")).toHaveCount(3);
  });

  test("empty daily-revenue keeps the chart card height", async ({ page }) => {
    state.dashboard = { ...state.dashboard, dailyRevenue: [] };
    await page.goto("/admin");

    const message = page.getByText("No dashboard data available.");
    await expect(message).toBeVisible();

    const box = await message.locator("..").boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(200);
  });
});
