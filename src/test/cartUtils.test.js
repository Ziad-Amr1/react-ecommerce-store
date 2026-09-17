import { describe, expect, it } from "vitest";
import {
  addGuestItem,
  clearGuestCart,
  EMPTY_CART,
  formatItemCount,
  normalizeServerCart,
  productToLine,
  removeGuestItem,
  setGuestQuantity,
} from "../features/cart/cartUtils";

const HEADPHONES = {
  _id: "p1",
  name: "Wireless Headphones",
  images: [{ url: "https://example.com/a.jpg" }],
  price: 249.99,
  discountPrice: 199.99,
  stock: 10,
};

const MOUSE = {
  _id: "p2",
  name: "Wireless Mouse",
  images: [{ url: "https://example.com/b.jpg" }],
  price: 49.5,
  stock: 3,
};

describe("productToLine", () => {
  it("uses the discounted price when one is set", () => {
    expect(productToLine(HEADPHONES)).toEqual({
      id: "p1",
      name: "Wireless Headphones",
      image: "https://example.com/a.jpg",
      price: 199.99,
      quantity: 1,
    });
  });

  it("falls back to the regular price", () => {
    const line = productToLine(MOUSE);
    expect(line.price).toBe(49.5);
    expect(line.id).toBe("p2");
  });
});

describe("addGuestItem", () => {
  it("adds a new line and computes totals", () => {
    const next = addGuestItem(EMPTY_CART, HEADPHONES);

    expect(next.items).toHaveLength(1);
    expect(next.itemCount).toBe(1);
    expect(next.subtotal).toBe(199.99);
    expect(next.discountAmount).toBe(0);
    expect(next.total).toBe(next.subtotal);
  });

  it("increments the quantity when the product is already in the cart", () => {
    let cart = addGuestItem(EMPTY_CART, HEADPHONES);
    cart = addGuestItem(cart, HEADPHONES);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.itemCount).toBe(2);
    expect(cart.subtotal).toBeCloseTo(399.98);
  });

  it("keeps different products as separate lines", () => {
    let cart = addGuestItem(EMPTY_CART, HEADPHONES);
    cart = addGuestItem(cart, MOUSE);

    expect(cart.items).toHaveLength(2);
    expect(cart.itemCount).toBe(2);
    expect(cart.subtotal).toBeCloseTo(249.49);
  });
});

describe("setGuestQuantity", () => {
  it("sets the quantity of an existing line", () => {
    let cart = addGuestItem(EMPTY_CART, HEADPHONES);
    cart = setGuestQuantity(cart, "p1", 3);

    expect(cart.items[0].quantity).toBe(3);
    expect(cart.itemCount).toBe(3);
  });

  it("clamps to a minimum of 1", () => {
    let cart = addGuestItem(EMPTY_CART, HEADPHONES);
    cart = setGuestQuantity(cart, "p1", 0);

    expect(cart.items[0].quantity).toBe(1);
  });

  it("leaves the cart unchanged for an unknown product", () => {
    let cart = addGuestItem(EMPTY_CART, HEADPHONES);
    const next = setGuestQuantity(cart, "missing", 5);

    expect(next.items).toEqual(cart.items);
  });
});

describe("removeGuestItem and clearGuestCart", () => {
  it("removes only the matching line", () => {
    let cart = addGuestItem(EMPTY_CART, HEADPHONES);
    cart = addGuestItem(cart, MOUSE);
    cart = removeGuestItem(cart, "p1");

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].id).toBe("p2");
  });

  it("clears to the empty cart shape", () => {
    let cart = addGuestItem(EMPTY_CART, HEADPHONES);
    cart = clearGuestCart(cart);

    expect(cart).toEqual(EMPTY_CART);
  });
});

describe("normalizeServerCart", () => {
  it("maps a server payload into the shared cart shape", () => {
    const result = normalizeServerCart({
      itemCount: 3,
      subtotal: 749.97,
      discountAmount: 74.99,
      total: 674.98,
      coupon: "SAVE10",
      items: [
        {
          _id: "line-1",
          product: "p1",
          name: "Wireless Headphones",
          image: "https://example.com/a.jpg",
          price: 249.99,
          quantity: 2,
        },
      ],
    });

    expect(result.items[0]).toEqual({
      id: "p1",
      name: "Wireless Headphones",
      image: "https://example.com/a.jpg",
      price: 249.99,
      quantity: 2,
    });
    expect(result.itemCount).toBe(3);
    expect(result.subtotal).toBe(749.97);
    expect(result.discountAmount).toBe(74.99);
    expect(result.total).toBe(674.98);
    expect(result.coupon).toBe("SAVE10");
  });

  it("keeps a populated product object as the line id", () => {
    const result = normalizeServerCart({
      itemCount: 1,
      items: [
        {
          _id: "line-1",
          product: { _id: "p9", name: "Mouse", images: [{ url: "x.jpg" }] },
          price: 10,
          quantity: 1,
        },
      ],
    });

    expect(result.items[0].id).toBe("p9");
    expect(result.items[0].name).toBe("Mouse");
  });

  it("treats an empty response as an empty cart", () => {
    expect(normalizeServerCart({})).toEqual(EMPTY_CART);
    expect(normalizeServerCart(undefined)).toEqual(EMPTY_CART);
  });
});

describe("formatItemCount", () => {
  it("returns empty for zero or negative", () => {
    expect(formatItemCount(0)).toBe("");
    expect(formatItemCount(-2)).toBe("");
  });

  it("returns the number below the cap", () => {
    expect(formatItemCount(1)).toBe("1");
    expect(formatItemCount(99)).toBe("99");
  });

  it("caps at 99+", () => {
    expect(formatItemCount(100)).toBe("99+");
    expect(formatItemCount(150)).toBe("99+");
  });
});