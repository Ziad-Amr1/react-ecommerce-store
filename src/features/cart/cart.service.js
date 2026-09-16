// import api from "@/api/axios";

// export function getCart(signal) {
//   return api.get("/carts", { signal });
// }

// export function addCartItem(payload, signal) {
//   return api.post("/carts/items", payload, { signal });
// }

// export function updateCartItem(payload, signal) {
//   return api.patch("/carts/items", payload, { signal });
// }

// export function removeCartItem(productId, signal) {
//   return api.delete(`/carts/items/${productId}`, { signal });
// }

// export function clearCart(signal) {
//   return api.delete("/carts/clear", { signal });
// }

import api from "@/api/axios";

export function getCart(signal) {
  return api.get("/carts", { signal });
}

export function addCartItem(payload, signal) {
  return api.post("/carts/items", payload, { signal });
}

export function updateCartItem(payload, signal) {
  return api.patch("/carts/items", payload, { signal });
}

export function removeCartItem(productId, signal) {
  return api.delete(`/carts/items/${productId}`, { signal });
}

export function clearCart(signal) {
  return api.delete("/carts/clear", { signal });
}

export function applyCartCoupon(payload, signal) {
  return api.post("/carts/coupon", payload, { signal });
}

export function removeCartCoupon(signal) {
  return api.delete("/carts/coupon", { signal });
}