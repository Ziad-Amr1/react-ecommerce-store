import { test, expect } from "@playwright/test";
import {
  EMPTY_CART,
  createApiState,
  createCart,
  installMockApi,
} from "./support/mockApi.js";

const CART_ITEM = {
  id: "p8",
  name: "Desk Lamp",
  image: "",
  price: 600,
  quantity: 2,
};

test.describe("Checkout", () => {
  let state;

  test.beforeEach(async ({ page }) => {
    state = createApiState({ cart: createCart([CART_ITEM]) });
    await installMockApi(page, state);
  });

  test("redirects guests to the login page", async ({ page }) => {
    state.authUser = null;

    await page.goto("/checkout");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("shows an empty state when the cart has no items", async ({ page }) => {
    state.cart = { ...EMPTY_CART };

    await page.goto("/checkout");

    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });

  test("blocks submission and surfaces validation errors", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByText("Order summary")).toBeVisible();

    await page.getByRole("button", { name: "Place order" }).click();

    await expect(page.getByText("Full name is required")).toBeVisible();
    await expect(page.getByText("Phone number is required")).toBeVisible();
    expect(state.lastOrder).toBeNull();
  });

  test("submits the order and lands on the confirmation page", async ({ page }) => {
    await page.goto("/checkout");

    await page.getByLabel("Full name").fill("Jane Smith");
    await page.getByLabel("Phone number").fill("+20 100 000 0000");
    await page.getByLabel("Country").fill("Egypt");
    await page.getByLabel("City").fill("Cairo");
    await page.getByLabel("Street address").fill("123 Nile Street");

    const requestPromise = page.waitForRequest(
      (request) =>
        request.method() === "POST" && request.url().endsWith("/api/orders"),
    );

    await page.getByRole("button", { name: "Place order" }).click();
    const request = await requestPromise;

    expect(request.postDataJSON()).toMatchObject({
      paymentMethod: "cash",
      shippingAddress: {
        fullName: "Jane Smith",
        phone: "+20 100 000 0000",
        country: "Egypt",
        city: "Cairo",
        address: "123 Nile Street",
      },
    });

    await expect(page).toHaveURL(/\/order-success$/);
    await expect(page.getByText("Order confirmed")).toBeVisible();
    expect(state.lastOrder).not.toBeNull();
  });

  test("renders the checkout form in Arabic RTL", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("language", "ar"));

    await page.goto("/checkout");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(
      page.getByRole("heading", { name: "إتمام الشراء" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "تأكيد الطلب" }),
    ).toBeVisible();
  });
});
