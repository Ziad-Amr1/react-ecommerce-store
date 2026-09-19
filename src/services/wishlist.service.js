import api from "@/api/axios";

// The API returns the wishlist with populated product objects. `null` means the
// response did not carry a products array, which callers treat as "no update".
function extractProducts(payload) {
  if (payload && Array.isArray(payload.wishlist?.products)) {
    return payload.wishlist.products;
  }
  return null;
}

export function getMyWishlist(signal) {
  return api
    .get("/wishlists/my", { signal })
    .then((response) => extractProducts(response.data) ?? [])
    .catch((error) => {
      // A user without a wishlist yet is documented as 404, not an error.
      if (error.response?.status === 404) return [];
      throw error;
    });
}

export function addToWishlist(productId, signal) {
  return api
    .post(`/wishlists/add/${productId}`, null, { signal })
    .then((response) => extractProducts(response.data));
}

export function removeFromWishlist(productId, signal) {
  return api
    .delete(`/wishlists/remove/${productId}`, { signal })
    .then((response) => extractProducts(response.data));
}

export function clearWishlist(signal) {
  return api
    .delete("/wishlists/clear", { signal })
    .then((response) => response.data);
}
