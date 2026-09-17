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
    const totalProductsKpi = page
      .getByText("Total Products")
      .locator("xpath=ancestor::div[contains(@class, 'h-full')]");
    await expect(totalProductsKpi).toBeVisible();
    await expect(totalProductsKpi.getByText("10")).toBeVisible();
    await expect(page.getByText("1 / 2")).toBeVisible();
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
    await expect(page.getByText("2 / 2")).toBeVisible();

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

  test("Product name header sends the name sort param", async ({ page }) => {
    const getRequests = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/products")) getRequests.push(req);
    });

    await page.goto("/admin/products");
    await expect(page.locator("table tbody tr")).toHaveCount(10);
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(1);

    const productHeader = page.getByRole("columnheader", { name: "Product" });
    await productHeader.getByRole("button").click();
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(2);
    expect(new URL(getRequests.at(-1).url()).searchParams.get("sort")).toBe("name");
    await expect(productHeader).toHaveAttribute("aria-sort", "ascending");

    await productHeader.getByRole("button").click();
    await expect(productHeader).toHaveAttribute("aria-sort", "descending");
  });

  test("Price header sorts by price_asc then price_desc", async ({ page }) => {
    const getRequests = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/products")) getRequests.push(req);
    });

    await page.goto("/admin/products");
    await expect(page.locator("table tbody tr")).toHaveCount(10);
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(1);

    const priceHeader = page.getByRole("columnheader", { name: "Price" });
    await priceHeader.getByRole("button").click();
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(2);
    expect(new URL(getRequests.at(-1).url()).searchParams.get("sort")).toBe("price_asc");
    await expect(page.locator("table tbody tr").first()).toContainText("Stainless Steel Bottle");

    await priceHeader.getByRole("button").click();
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(3);
    expect(new URL(getRequests.at(-1).url()).searchParams.get("sort")).toBe("price_desc");
    await expect(page.locator("table tbody tr").first()).toContainText("Noise Cancelling Headphones");
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
    await expect(page.getByText("إجمالي المنتجات")).toBeVisible();
  });
});