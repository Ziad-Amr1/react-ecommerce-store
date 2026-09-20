import { test, expect } from "@playwright/test";
import { createApiState, installMockApi } from "./support/mockApi.js";

// Cross-cutting tests exercising shared infrastructure directly.
test.describe("Shared admin architecture", () => {
  let state;

  test.beforeEach(async ({ page }) => {
    state = createApiState();
    await installMockApi(page, state);
  });

  // ── AdminPageHeader / statistic surfaces ───────────────────────────────
  test("admin pages render header title, KPI stat cards, and the page indicator", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.locator("span.tabular-nums.text-primary")).toHaveText("12");
    await expect(page.getByText("1 / 2")).toBeVisible();
  });

  // ── SortableTableHeader ────────────────────────────────────────────────
  test("SortableTableHeader renders buttons only for sortable columns and updates aria-sort", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("table tbody tr")).toHaveCount(15);

    // Date column is sortable and renders a button
    const dateHeader = page.getByRole("columnheader", { name: "Date" });
    await expect(dateHeader.getByRole("button")).toBeVisible();
    await expect(dateHeader).not.toHaveAttribute("aria-sort");

    await dateHeader.getByRole("button").click();
    await expect(dateHeader).toHaveAttribute("aria-sort", "ascending");

    await dateHeader.getByRole("button").click();
    await expect(dateHeader).toHaveAttribute("aria-sort", "descending");

    // Products page: Product (name) and Price columns are sortable with buttons
    await page.goto("/admin/products");
    await expect(page.locator("table tbody tr")).toHaveCount(10);
    await expect(page.getByRole("columnheader", { name: "Product" }).getByRole("button")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Price" }).getByRole("button")).toBeVisible();
  });

  // ── AdminTablePagination ───────────────────────────────────────────────
  test("AdminTablePagination disables Previous on first page and Next on last page", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("table tbody tr")).toHaveCount(15);

    await expect(page.getByRole("button", { name: "Previous" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Next" })).toBeEnabled();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.locator("table tbody tr")).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Previous" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  // ── RowActionsMenu ─────────────────────────────────────────────────────
  test("RowActionsMenu opens via trigger and items fire expected actions", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.locator("table tbody tr").first().getByRole("button", { name: "Actions" }).click();
    await expect(page.getByRole("menu")).toBeVisible();

    // Menu items present
    await expect(page.getByRole("menuitem", { name: "View details" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Change role" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Delete janesmith" })).toBeVisible();

    // Clicking View details opens the details dialog (same as row click)
    await page.getByRole("menuitem", { name: "View details" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  // ── TableSkeletonRows ──────────────────────────────────────────────────
  test("TableSkeletonRows renders animation during initial load", async ({ page }) => {
    state.delayMs = 2500;
    await page.goto("/admin/products");

    await expect(page.locator(".animate-pulse").first()).toBeVisible();
    const skeletons = await page.locator(".animate-pulse").count();
    expect(skeletons).toBeGreaterThan(0);

    await expect(page.getByText("Wireless Headphones")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".animate-pulse")).toHaveCount(0);
  });

  // ── AdminTableEmptyState ───────────────────────────────────────────────
  test("AdminTableEmptyState appears when resource list is empty", async ({ page }) => {
    state.products = [];
    await page.goto("/admin/products");

    await expect(page.getByText("No products found")).toBeVisible();
    await expect(page.getByText("Try adjusting your search or filters.")).toBeVisible();
  });

  // ── AdminErrorState ────────────────────────────────────────────────────
  test("AdminErrorState appears on failure and retry re-fetches data", async ({ page }) => {
    state.orderStatus = 500;
    await page.goto("/admin/orders");
    await expect(page.getByText("Failed to load orders")).toBeVisible();

    state.orderStatus = 200;
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.locator("table tbody tr").first()).toBeVisible({ timeout: 5000 });
  });

  // ── Shared server-side controller pagination ───────────────────────────
  test("changing page in the shared controller updates request params", async ({ page }) => {
    const getRequests = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/orders/admin")) getRequests.push(req);
    });

    await page.goto("/admin/orders");
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(1);
    expect(new URL(getRequests[0].url()).searchParams.get("page")).toBe("1");

    await page.getByRole("button", { name: "Next" }).click();
    await expect.poll(() => getRequests.length).toBeGreaterThanOrEqual(2);
    const lastReq = getRequests.at(-1);
    expect(new URL(lastReq.url()).searchParams.get("page")).toBe("2");
  });
});