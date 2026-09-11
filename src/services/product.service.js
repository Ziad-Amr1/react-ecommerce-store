import api from "@/api/axios";

export function getProducts(params = {}, signal) {
  return api.get("/products", { params, signal }).then((response) => response.data);
}

export function getProduct(id, signal) {
  if (!id) {
    return Promise.reject(new Error("getProduct: missing product id"));
  }
  return api.get(`/products/${id}`, { signal }).then((response) => response.data);
}

export function createProduct(formData, signal) {
  return api
    .post("/products", formData, { signal })
    .then((response) => response.data);
}

export function updateProduct(id, formData, signal) {
  return api
    .patch(`/products/update/${id}`, formData, { signal })
    .then((response) => response.data);
}

export function deleteProduct(id, signal) {
  return api.delete(`/products/${id}`, { signal }).then((response) => response.data);
}
