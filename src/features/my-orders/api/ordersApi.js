import api from "@/api/axios";

export function getMyOrders({ page, limit, status, signal }){
  return api.get("/orders/my", {
    signal,
    params: {
      page,
      limit,
      status,
    },
  });
}

export function getMyOrderById(orderId, signal){
  return api.get(`/orders/my/${orderId}`, {
    signal,
  });
}

export function cancelMyOrder(orderId, signal){
  return api.patch(`/orders/my/${orderId}/cancel`, {}, {
    signal,
  });
}