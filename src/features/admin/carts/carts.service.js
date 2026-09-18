import api from "@/api/axios";

export function getCarts({ page, limit, signal }) {
  return api.get("/orders/admin/carts", {
    signal,
    params: { page, limit },
  });
}
