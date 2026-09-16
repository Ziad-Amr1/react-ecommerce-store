import { test, expect } from "@playwright/test";
import { createApiState, installMockApi } from "./support/mockApi.js";

test.describe("Admin Orders", () => {
  let state;

  test.beforeEach(async ({ page }) => {
    state = createApiState();
    await installMockApi(page, state);
  });

  test("page renders with title and total-orders statistic", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();
    await expect(page.locator("dt").filter({ hasText: "Total Orders" })).toBeVisible();
    await expect(page.locator("dd").filter({ hasText: "16" })).toBeVisible();
  });

  test("status filter sends the correct query param", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("table tbody tr")).toHaveCount(15);

    const requestPromise = page.waitForRequest(
      (req) =>
        req.url().includes("/api/orders/admin") &&
        new URL(req.url()).searchParams.get("status") === "delivered",
    );
    await page.locator('[data-slot="select-trigger"]').filter({ hasText: "All statuses" }).click();
    await page.getByRole("option", { name: "Delivered" }).click();
    await requestPromise;
    await expect(page.locator("table tbody tr")).toHaveCount(5);
  });

  test("payment filter sends paymentStatus param", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("table tbody tr")).toHaveCount(15);

    const requestPromise = page.waitForRequest(
      (req) =>
        req.url().includes("/api/orders/admin") &&
        new URL(req.url()).searchParams.get("paymentStatus") === "pending",
    );
    await page.locator('[data-slot="select-trigger"]').filter({ hasText: "All payments" }).click();
    await page.getByRole("option", { name: "Pending" }).click();
    await requestPromise;
    await expect(page.locator("table tbody tr")).toHaveCount(5);
  });

  test("clicking the Date header toggles sort direction", async ({ page }) => {
    const getRequests = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/orders/admin")) getRequests.push(req);
    });

    await page.goto("/admin/orders");
    await expect(page.locator("table tbody tr")).toHaveCount(15);
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(1);

    await page.getByRole("columnheader", { name: "Date" }).getByRole("button").click();
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(2);
    const asc = new URL(getRequests.at(-1).url());
    expect(asc.searchParams.get("sortBy")).toBe("createdAt");
    expect(asc.searchParams.get("sortDir")).toBe("asc");

    await page.getByRole("columnheader", { name: "Date" }).getByRole("button").click();
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(3);
    const desc = new URL(getRequests.at(-1).url());
    expect(desc.searchParams.get("sortDir")).toBe("desc");
  });

  test("pagination navigates between pages", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("table tbody tr")).toHaveCount(15);

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.locator("table tbody tr")).toHaveCount(1);
    await page.getByRole("button", { name: "Previous" }).click();
    await expect(page.locator("table tbody tr")).toHaveCount(15);
  });

  test("row actions menu opens without triggering the details sheet", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("table tbody tr")).toHaveCount(15);

    await page.locator("table tbody tr").first().getByRole("button", { name: "Actions" }).click();
    await expect(page.getByRole("menu")).toBeVisible();

    // Opening the menu must not open the order details sheet.
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await page.getByRole("menuitem", { name: "View details" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toContainText("Order Details");
  });

  test("clicking a row opens the order details sheet", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("table tbody tr")).toHaveCount(15);

    await page.locator("table tbody tr").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toContainText("Order Details");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("empty state is shown when there are no orders", async ({ page }) => {
    state.orders = [];
    await page.goto("/admin/orders");
    await expect(page.getByText("No orders found.")).toBeVisible();
  });

  test("loading skeleton appears then resolves to data", async ({ page }) => {
    state.delayMs = 2000;
    await page.goto("/admin/orders");
    await expect(page.locator(".animate-pulse").first()).toBeVisible();
    await expect(page.locator("table tbody tr").first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".animate-pulse")).toHaveCount(0);
  });

  test("error state is shown and retry recovers", async ({ page }) => {
    state.orderStatus = 500;
    await page.goto("/admin/orders");
    await expect(page.getByText("Failed to load orders")).toBeVisible();

    state.orderStatus = 200;
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.locator("table tbody tr").first()).toBeVisible({ timeout: 5000 });
  });

  test("RTL Arabic layout applies correct direction and translations", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("language", "ar"));
    await page.goto("/admin/orders");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { name: "الطلبات" })).toBeVisible();
    await expect(page.locator("dt").filter({ hasText: "إجمالي الطلبات" })).toBeVisible();
  });
});