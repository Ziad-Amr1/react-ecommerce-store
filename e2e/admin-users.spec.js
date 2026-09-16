import { test, expect } from "@playwright/test";
import { createApiState, installMockApi } from "./support/mockApi.js";

test.describe("Admin Users", () => {
  let state;

  test.beforeEach(async ({ page }) => {
    state = createApiState();
    await installMockApi(page, state);
  });

  test("page renders with title and statistics", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    await expect(page.locator("dt").filter({ hasText: "Total" })).toBeVisible();
    await expect(page.locator("dd").filter({ hasText: "12" })).toBeVisible();
    await expect(page.locator("dt").filter({ hasText: "Page" })).toBeVisible();
    await expect(page.locator("dd").filter({ hasText: "1 / 2" })).toBeVisible();
  });

  test("client-side pagination navigates between pages", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.locator("table tbody tr")).toHaveCount(2);
    await expect(page.locator("dd").filter({ hasText: "2 / 2" })).toBeVisible();

    await page.getByRole("button", { name: "Previous" }).click();
    await expect(page.locator("table tbody tr")).toHaveCount(10);
  });

  test("search filters users by username or email client-side", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.getByPlaceholder("Search users by username or email...").fill("jane");
    await expect(page.locator("table tbody tr")).toHaveCount(1);
    await expect(page.getByText("janesmith")).toBeVisible();
    await expect(page.locator("dd").filter({ hasText: "1 / 1" })).toBeVisible();

    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(page.locator("table tbody tr")).toHaveCount(10);
  });

  test("role filter narrows the list to admins client-side", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.getByLabel("Filter by role").click();
    await page.getByRole("option", { name: "Admin" }).click();

    await expect(page.locator("table tbody tr")).toHaveCount(2);
    await expect(page.getByText("janesmith")).toBeVisible();
    await expect(page.getByText("caroladams")).toBeVisible();
    await expect(page.getByText("davidlee")).not.toBeVisible();
  });

  test("username column sorts ascending then descending client-side", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    const usernameHeader = page.getByRole("columnheader", { name: "Username" });
    await usernameHeader.getByRole("button").click();
    await expect(usernameHeader).toHaveAttribute("aria-sort", "ascending");
    await expect(page.locator("table tbody tr").first()).toContainText("bobwilson");

    await usernameHeader.getByRole("button").click();
    await expect(usernameHeader).toHaveAttribute("aria-sort", "descending");
    await expect(page.locator("table tbody tr").first()).toContainText("leodavis");
  });

  test("row click opens the details dialog", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.locator("table tbody tr").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close" }).last().click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("actions menu opens without triggering row click and edit opens edit dialog", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    const actionsTrigger = page.locator("table tbody tr").first().getByRole("button", { name: "Actions" });
    await actionsTrigger.click();
    await expect(page.getByRole("menu")).toBeVisible();

    // Details dialog must not have opened (stopPropagation on trigger)
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await page.getByRole("menuitem", { name: "Change role" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("delete user flow removes the row", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("table tbody tr")).toHaveCount(10);

    await page.locator("table tbody tr").first().getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: "Delete janesmith" }).click();

    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.getByRole("button", { name: "Delete User" }).click();

    await expect(page.getByText("janesmith")).not.toBeVisible({ timeout: 5000 });
  });

  test("add user button opens add dialog", async ({ page }) => {
    await page.goto("/admin/users");
    await page.getByRole("button", { name: "Add User" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("empty state is shown when there are no users", async ({ page }) => {
    state.users = [];
    await page.goto("/admin/users");
    await expect(page.getByText("No users found.")).toBeVisible();
    await expect(page.getByText("There are currently no users to display.")).toBeVisible();
  });

  test("loading skeleton appears then resolves to data", async ({ page }) => {
    state.delayMs = 2000;
    await page.goto("/admin/users");
    await expect(page.locator(".animate-pulse").first()).toBeVisible();
    await expect(page.locator("table tbody tr").first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".animate-pulse")).toHaveCount(0);
  });

  test("error state is shown and retry recovers", async ({ page }) => {
    state.userStatus = 500;
    await page.goto("/admin/users");
    await expect(page.getByText("Unable to load users")).toBeVisible();

    state.userStatus = 200;
    await page.getByRole("button", { name: "Try Again" }).click();
    await expect(page.locator("table tbody tr").first()).toBeVisible({ timeout: 5000 });
  });

  test("RTL Arabic layout applies correct direction and translations", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("language", "ar"));
    await page.goto("/admin/users");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { name: "المستخدمون" })).toBeVisible();
    await expect(page.locator("dt").filter({ hasText: "إجمالي" })).toBeVisible();
  });
});