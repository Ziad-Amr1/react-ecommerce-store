export const EMPTY_CART = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  discountAmount: 0,
  total: 0,
  coupon: null,
};

function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function computeTotals(lines) {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = roundMoney(
    lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
  );
  return {
    items: lines,
    itemCount,
    subtotal,
    discountAmount: 0,
    total: subtotal,
    coupon: null,
  };
}

// Turn a shop product into a normalized line item so guests and signed-in
// users end up with the same `{ id, name, image, price, quantity }` shape.
export function productToLine(product) {
  const price =
    product.discountPrice != null && product.discountPrice > 0
      ? product.discountPrice
      : product.price;

  return {
    id: product._id ?? product.id,
    name: product.name || "",
    image: product.images?.find((image) => image?.url)?.url || "",
    price: Number(price) || 0,
    quantity: 1,
  };
}

// Guest cart: adding a product that is already present increments the
// quantity, mirroring the documented POST /carts/items behaviour.
export function addGuestItem(cart, product) {
  const line = productToLine(product);
  const existing = cart.items.find((item) => item.id === line.id);

  if (existing) {
    const lines = cart.items.map((item) =>
      item.id === line.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    return computeTotals(lines);
  }

  return computeTotals([...cart.items, line]);
}

export function setGuestQuantity(cart, productId, quantity) {
  const next = Math.max(1, Math.floor(Number(quantity) || 1));
  const lines = cart.items.map((item) =>
    item.id === productId ? { ...item, quantity: next } : item,
  );
  return computeTotals(lines);
}

export function removeGuestItem(cart, productId) {
  return computeTotals(cart.items.filter((item) => item.id !== productId));
}

export function clearGuestCart() {
  return { ...EMPTY_CART };
}

function normalizeServerItem(item) {
  const product = typeof item?.product === "object" ? item.product : null;
  return {
    id: product?._id ?? item?.product ?? item?._id,
    name: item?.name || product?.name || "",
    image: item?.image || product?.images?.find((image) => image?.url)?.url || "",
    price: roundMoney(item?.price ?? product?.price),
    quantity: Math.max(1, Math.floor(Number(item?.quantity) || 1)),
  };
}

// Normalize a server cart payload (GET/POST/PATCH/DELETE /carts responses)
// into the shared cart shape.
export function normalizeServerCart(data) {
  const items = Array.isArray(data?.items) ? data.items : [];

  return {
    items: items.map(normalizeServerItem),
    itemCount: Number(data?.itemCount) || 0,
    subtotal: roundMoney(data?.subtotal),
    discountAmount: roundMoney(data?.discountAmount),
    total: roundMoney(data?.total),
    coupon: data?.coupon || null,
  };
}

export function formatItemCount(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }
  if (value > 99) {
    return "99+";
  }
  return String(value);
}