import api from "@/api/axios";

// Documented backend contract:
// POST /orders
// { shippingAddress: { fullName, phone, country, city, address, postalCode }, paymentMethod, customerNote }
// Stripe is not part of this contract yet, so only "cash" is ever sent here.
export function createOrder({ shippingAddress, paymentMethod, customerNote }, signal) {
  return api.post(
    "/orders",
    {
      shippingAddress,
      paymentMethod,
      customerNote,
    },
    { signal },
  );
}
