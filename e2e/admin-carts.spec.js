import { test, expect } from "@playwright/test";
import { createApiState, installMockApi } from "./support/mockApi.js";

test.describe("Admin Carts", () => {
  let state;

  test.beforeEach(async ({ page }) => {
    state = createApiState();
    await installMockApi(page, state);
  });

  test("renders the first page of carts with the total statistic", async ({ page }) => {
    await page.goto("/admin/carts");

    await expect(page.getByRole("heading", { name: "Carts" })).toBeVisible();
    await expect(page.locator("table tbody tr")).toHaveCount(10);
    await expect(page.getByText("customer1", { exact: true })).toBeVisible();
    await expect(page.getByText("Total").first()).toBeVisible();
    await expect(page.getByText("12")).toBeVisible();
  });

  test("paginates to the next page", async ({ page }) => {
    await page.goto("/admin/carts");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.getByRole("button", { name: "Next" }).click();

    await expect(page.locator("table tbody tr")).toHaveCount(2);
    await expect(page.getByText("customer12", { exact: true })).toBeVisible();
  });

  test("opens the details sheet for a cart", async ({ page }) => {
    await page.goto("/admin/carts");

    await page
      .locator("table tbody tr")
      .first()
      .getByText("customer1", { exact: true })
      .click();

    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await expect(sheet.getByText("Cart Details")).toBeVisible();
    await expect(sheet.getByText("#cart1")).toBeVisible();
    await expect(sheet.getByText("Product 1", { exact: true })).toBeVisible();
  });

  test("empty state is shown when there are no carts", async ({ page }) => {
    state.carts = [];
    await page.goto("/admin/carts");

    await expect(page.getByText("No carts found.")).toBeVisible();
    await expect(
      page.getByText("New customer carts will appear here as they shop."),
    ).toBeVisible();
  });

  test("error state is shown and retry recovers", async ({ page }) => {
    state.cartStatus = 500;
    await page.goto("/admin/carts");
    await expect(page.getByText("Could not load carts")).toBeVisible();

    state.cartStatus = 200;
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.locator("table tbody tr").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("RTL Arabic layout applies correct direction and translations", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("language", "ar"));
    await page.goto("/admin/carts");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(
      page.getByRole("heading", { name: "عربات التسوق" }),
    ).toBeVisible();
    await expect(page.getByText("الإجمالي").first()).toBeVisible();
  });
});
