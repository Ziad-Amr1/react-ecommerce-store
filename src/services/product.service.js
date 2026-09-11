import api from "@/api/axios";

export function getProducts(params = {}, signal) {
  return api.get("/products", { params, signal }).then((response) => response.data);
}

export function getProduct(id, signal) {
  return api.get(`/products/${id}`, { signal }).then((response) => response.data);
}

export function createProduct(formData) {
  return api
    .post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
}

export function updateProduct(id, formData) {
  return api
    .patch(`/products/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
}

export function deleteProduct(id) {
  return api.delete(`/products/${id}`).then((response) => response.data);
}