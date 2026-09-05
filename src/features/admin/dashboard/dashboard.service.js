import api from "@/api/axios";

export const getDashboard = async () => {
  const response = await api.get("/orders/admin/dashboard");

  return response.data;
};
