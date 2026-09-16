import { test, expect } from "@playwright/test";
import { createApiState, installMockApi } from "./support/mockApi.js";

test.describe("Admin Products", () => {
  let state;

  test.beforeEach(async ({ page }) => {
    state = createApiState();
    await installMockApi(page, state);
  });

  test("page renders with title and statistics", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.locator("dt").filter({ hasText: "Page" })).toBeVisible();
    await expect(page.locator("dd").filter({ hasText: "1 / 2" })).toBeVisible();
    await expect(page.locator("dt").filter({ hasText: "Records" })).toBeVisible();
    await expect(page.locator("dd").filter({ hasText: "10" })).toBeVisible();
  });

  test("search debounce sends the search query param", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    const requestPromise = page.waitForRequest(
      (req) =>
        req.url().includes("/api/products") &&
        new URL(req.url()).searchParams.get("search") === "wireless",
    );
    await page
      .getByPlaceholder("Search products by name or SKU...")
      .fill("wireless");
    await requestPromise;
    await expect(page.locator("table tbody tr")).toHaveCount(2);
  });

  test("selecting a search result commits the query immediately", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page
      .getByPlaceholder("Search products by name or SKU...")
      .fill("wirel");
    await expect(page.getByRole("button", { name: "Wireless Headphones" })).toBeVisible();

    const requestPromise = page.waitForRequest(
      (req) =>
        req.url().includes("/api/products") &&
        new URL(req.url()).searchParams.get("search") === "Wireless Headphones",
    );
    await page.getByRole("button", { name: "Wireless Headphones" }).click();
    await requestPromise;
    await expect(page.locator("table tbody tr")).toHaveCount(1);
  });

  test("pagination navigates between pages", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.getByRole("button", { name: "Next page" }).click();
    await expect(page.locator("table tbody tr")).toHaveCount(2);
    await expect(page.locator("dd").filter({ hasText: "2 / 2" })).toBeVisible();

    await page.getByRole("button", { name: "Previous page" }).click();
    await expect(page.locator("table tbody tr")).toHaveCount(10);
  });

  test("category filter applies and shrinks the result set", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.getByRole("button", { name: "Filters" }).click();
    await page.getByLabel("Category").fill("Electronics");

    const requestPromise = page.waitForRequest(
      (req) =>
        req.url().includes("/api/products") &&
        new URL(req.url()).searchParams.get("category") === "Electronics",
    );
    await page.getByRole("button", { name: "Apply" }).click();
    await requestPromise;
    await expect(page.locator("table tbody tr")).toHaveCount(5);
  });

  test("row actions menu provides view, edit and delete", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.locator("table tbody tr").first().getByRole("button", { name: "Actions" }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "View Product" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Edit Product" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Delete Product" })).toBeVisible();
  });

  test("empty state is shown when there are no products", async ({ page }) => {
    state.products = [];
    await page.goto("/admin/products");
    await expect(page.getByText("No products found")).toBeVisible();
    await expect(page.getByText("Try adjusting your search or filters.")).toBeVisible();
  });

  test("loading skeleton appears then resolves to data", async ({ page }) => {
    state.delayMs = 2000;
    await page.goto("/admin/products");
    await expect(page.locator(".animate-pulse").first()).toBeVisible();
    await expect(page.locator("table tbody tr").first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".animate-pulse")).toHaveCount(0);
  });

  test("error state is shown and retry recovers", async ({ page }) => {
    state.productStatus = 500;
    await page.goto("/admin/products");
    await expect(page.getByText("Something went wrong")).toBeVisible();

    state.productStatus = 200;
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.locator("table tbody tr").first()).toBeVisible({ timeout: 5000 });
  });

  test("RTL Arabic layout applies correct direction and translations", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("language", "ar"));
    await page.goto("/admin/products");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { name: "المنتجات" })).toBeVisible();
    await expect(page.locator("dt").filter({ hasText: "السجلات" })).toBeVisible();
  });
});