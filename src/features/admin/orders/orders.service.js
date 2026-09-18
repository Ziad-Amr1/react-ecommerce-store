import api from "@/api/axios";

export function getOrders({ page, limit, status, paymentStatus, sortBy, sortDir, search, signal }) {
  return api.get("/orders/admin", {
    signal,
    params: {
      page,
      limit,
      status,
      paymentStatus,
      sortBy,
      sortDir,
      search: search || undefined,
    },
  });
}

export function updateOrderStatus(orderId, { status, adminNote }, signal) {
  return api.patch(`/orders/admin/${orderId}/status`, { status, adminNote }, { signal });
}