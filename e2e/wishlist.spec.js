import { test, expect } from "@playwright/test";
import { createApiState, installMockApi } from "./support/mockApi.js";

test.describe("Wishlist", () => {
  let state;

  test.beforeEach(async ({ page }) => {
    state = createApiState();
    await installMockApi(page, state);
  });

  test("lists the saved items with a total count", async ({ page }) => {
    state.wishlist = [state.products[0], state.products[1]];

    await page.goto("/wishlist");

    await expect(
      page.getByRole("heading", { level: 1, name: "Wishlist" }),
    ).toBeVisible();
    await expect(page.getByText("Saved items: 2")).toBeVisible();
    await expect(
      page.getByText("Wireless Headphones", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Smart Watch", { exact: true })).toBeVisible();
  });

  test("shows the empty state when nothing is saved", async ({ page }) => {
    await page.goto("/wishlist");

    await expect(page.getByText("Your wishlist is empty")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Browse Products" }),
    ).toBeVisible();
  });

  test("adds a product from a product card", async ({ page }) => {
    await page.goto("/products");
    await expect(
      page.getByText("Wireless Headphones", { exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Add to wishlist" }).first().click();
    await expect(page.getByText("Added to your wishlist.")).toBeVisible();

    await page.goto("/wishlist");
    await expect(page.getByText("Saved items: 1")).toBeVisible();
  });

  test("removes a saved product from the wishlist page", async ({ page }) => {
    state.wishlist = [state.products[0]];

    await page.goto("/wishlist");
    await expect(page.getByText("Saved items: 1")).toBeVisible();

    await page
      .getByRole("button", { name: "Remove from wishlist" })
      .first()
      .click();

    await expect(page.getByText("Removed from your wishlist.")).toBeVisible();
    await expect(page.getByText("Your wishlist is empty")).toBeVisible();
  });

  test("clears the whole wishlist after confirming", async ({ page }) => {
    state.wishlist = [state.products[0], state.products[1]];

    await page.goto("/wishlist");
    await expect(page.getByText("Saved items: 2")).toBeVisible();

    await page.getByRole("button", { name: "Clear wishlist" }).click();

    const dialog = page.getByRole("alertdialog");
    await expect(dialog.getByText("Clear your wishlist?")).toBeVisible();
    await dialog.getByRole("button", { name: "Clear wishlist" }).click();

    await expect(page.getByText("Your wishlist is empty")).toBeVisible();
  });

  test("shows an error state and retries successfully", async ({ page }) => {
    state.wishlistStatus = 500;
    state.wishlist = [state.products[0]];

    await page.goto("/wishlist");
    await expect(
      page.getByText("We couldn't load your wishlist."),
    ).toBeVisible();

    state.wishlistStatus = 200;
    await page.getByRole("button", { name: "Try again" }).click();

    await expect(page.getByText("Saved items: 1")).toBeVisible();
  });

  test("redirects unauthenticated visitors to the login page", async ({
    page,
  }) => {
    state.authStatus = 401;

    await page.goto("/wishlist");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("renders in Arabic RTL", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("language", "ar"));
    state.wishlist = [state.products[0]];

    await page.goto("/wishlist");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(
      page.getByRole("heading", { level: 1, name: "المفضلة" }),
    ).toBeVisible();
  });
});
