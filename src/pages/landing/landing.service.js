import api from "@/api/axios";

export function getLandingProducts(signal) {
  return api.get("/products", { signal }).then((response) => response.data);
}