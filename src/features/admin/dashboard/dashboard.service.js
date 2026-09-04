import api from "@/api/axios";

export const getDashboard = async () => {
  const response = await api.get("/orders/admin/dashboard");
  console.log("DASHBOARD RESPONSE:", response.data);
  console.log("TOP PRODUCTS:", response.data.dashboard?.topProducts);
  console.log(
    "FIRST TOP PRODUCT:",
    response.data.dashboard?.topProducts?.[0]
  );
  return response.data;
};
