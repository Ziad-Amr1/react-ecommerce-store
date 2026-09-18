import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/api/axios";
import {
  addToWishlist,
  clearWishlist,
  getMyWishlist,
  removeFromWishlist,
} from "@/services/wishlist.service";

vi.mock("@/api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const PRODUCTS = [
  { _id: "p1", name: "Wireless Headphones" },
  { _id: "p2", name: "Mechanical Keyboard" },
];

describe("wishlist.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getMyWishlist returns the populated products", async () => {
    api.get.mockResolvedValueOnce({
      data: { success: true, totalProducts: 2, wishlist: { products: PRODUCTS } },
    });

    const products = await getMyWishlist();

    expect(api.get).toHaveBeenCalledWith("/wishlists/my", { signal: undefined });
    expect(products).toEqual(PRODUCTS);
  });

  it("getMyWishlist resolves to an empty array when no wishlist exists (404)", async () => {
    api.get.mockRejectedValueOnce({ response: { status: 404 } });

    await expect(getMyWishlist()).resolves.toEqual([]);
  });

  it("getMyWishlist rethrows non-404 failures", async () => {
    const failure = { response: { status: 500 } };
    api.get.mockRejectedValueOnce(failure);

    await expect(getMyWishlist()).rejects.toBe(failure);
  });

  it("addToWishlist posts to /wishlists/add/{productId}", async () => {
    api.post.mockResolvedValueOnce({
      data: { success: true, wishlist: { products: PRODUCTS } },
    });

    await addToWishlist("p2");

    expect(api.post).toHaveBeenCalledWith("/wishlists/add/p2", null, {
      signal: undefined,
    });
  });

  it("removeFromWishlist calls DELETE /wishlists/remove/{productId}", async () => {
    api.delete.mockResolvedValueOnce({
      data: { success: true, wishlist: { products: [PRODUCTS[0]] } },
    });

    await removeFromWishlist("p2");

    expect(api.delete).toHaveBeenCalledWith("/wishlists/remove/p2", {
      signal: undefined,
    });
  });

  it("clearWishlist calls DELETE /wishlists/clear", async () => {
    api.delete.mockResolvedValueOnce({ data: { success: true } });

    await clearWishlist();

    expect(api.delete).toHaveBeenCalledWith("/wishlists/clear", {
      signal: undefined,
    });
  });
});
