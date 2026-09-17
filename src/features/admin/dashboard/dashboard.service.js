import api from "@/api/axios";

export const getDashboard = async (signal) => {
  const response = await api.get("/orders/admin/dashboard", { signal });

  return response.data;
};
