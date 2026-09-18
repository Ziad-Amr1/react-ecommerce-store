import api from "@/api/axios";

// Documented contract (docs/personal/endpoints.md -> POST /orders):
//   { shippingAddress: { fullName, phone, country, city, address, postalCode },
//     paymentMethod, customerNote } -> { success, message, order }
// The cart is cleared server-side once the order is created. Cash is the only
// supported payment method today.
// Returns the parsed body so callers read `response.order` directly instead of
// the Axios envelope.
export function createOrder(payload, signal) {
  return api
    .post("/orders", payload, { signal })
    .then((response) => response.data);
}
