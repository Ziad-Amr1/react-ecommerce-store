import { describe, expect, it, vi } from "vitest";
import { shouldOpenWishlistRemoveModal } from "../features/products/components/ProductCard";

describe("wishlist click gating", () => {
  it("opens confirmation modal instead of removing immediately when the wishlist card asks for confirmation", () => {
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() };
    const product = { _id: "p123", name: "Test Product" };
    const callback = vi.fn();

    const result = shouldOpenWishlistRemoveModal({
      event,
      product,
      showDetailsButton: false,
      onWishlistRemoveRequest: callback,
    });

    expect(result).toBe(true);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(product);
  });

  it("keeps the direct remove flow for normal product cards", () => {
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() };

    const result = shouldOpenWishlistRemoveModal({
      event,
      product: { _id: "p456" },
      showDetailsButton: true,
      onWishlistRemoveRequest: vi.fn(),
    });

    expect(result).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(event.stopPropagation).not.toHaveBeenCalled();
  });
});
