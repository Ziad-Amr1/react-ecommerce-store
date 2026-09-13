import api from "@/api/axios";

export function getOrders({
  page,
  limit,
  search,
  status,
  paymentStatus,
  sortBy,
  sortDir,
  signal,
}) {
  return api.get("/orders/admin", {
    signal,
    params: {
      page,
      limit,
      search,
      status,
      paymentStatus,
      sortBy,
      sortDir,
    },
  });
}

export function updateOrderStatus(orderId, { status, adminNote }, signal) {
  return api.patch(`/orders/admin/${orderId}/status`, { status, adminNote }, { signal });
}