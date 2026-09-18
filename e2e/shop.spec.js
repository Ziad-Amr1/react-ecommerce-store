import { test, expect } from "@playwright/test";
import { createApiState, installMockApi } from "./support/mockApi.js";

test.describe("Shop storefront", () => {
  let state;

  test.beforeEach(async ({ page }) => {
    state = createApiState();
    await installMockApi(page, state);
  });

  test("renders the catalog and the price slider", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { level: 1, name: "Shop" })).toBeVisible();
    await expect(page.getByText("Wireless Headphones", { exact: true })).toBeVisible();
    await expect(page.locator('[data-slot="slider"]')).toBeVisible();
  });

  test("brand filter sends the brand param and narrows results", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText("Wireless Headphones", { exact: true })).toBeVisible();

    const requestPromise = page.waitForRequest(
      (req) =>
        req.url().includes("/api/products") &&
        new URL(req.url()).searchParams.get("brand") === "TechNova",
    );
    await page.getByLabel("Brand").selectOption("TechNova");
    await requestPromise;

    await expect(page.getByText("Wireless Headphones", { exact: true })).toBeVisible();
    await expect(page.getByText("Wireless Charger", { exact: true })).toBeVisible();
    await expect(page.getByText("Smart Watch", { exact: true })).toBeHidden();
  });

  test("price range sends minPrice and maxPrice and narrows results", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText("Smart Watch", { exact: true })).toBeVisible();

    const requestPromise = page.waitForRequest((req) => {
      if (!req.url().includes("/api/products")) return false;
      const params = new URL(req.url()).searchParams;
      return params.get("minPrice") === "1000" && params.get("maxPrice") === "2000";
    });
    await page.getByPlaceholder("Min").fill("1000");
    await page.getByPlaceholder("Max").fill("2000");
    await requestPromise;

    await expect(page.getByText("Running Shoes", { exact: true })).toBeVisible();
    await expect(page.getByText("Yoga Mat", { exact: true })).toBeHidden();
    await expect(page.getByText("Smart Watch", { exact: true })).toBeHidden();
  });

  test("renders in Arabic RTL with the translated title", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("language", "ar"));
    await page.goto("/products");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1, name: "المتجر" })).toBeVisible();
  });
});
