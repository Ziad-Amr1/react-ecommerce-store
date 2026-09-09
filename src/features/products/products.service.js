import api from "@/api/axios";

export const getAllProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};
