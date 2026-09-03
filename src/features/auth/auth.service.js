import api from "@/api/axios";

export const sendForgotPasswordOTPApi = async (email) => {
  const response = await api.post("/auth/forgot-password/send-otp", {
    email,
  });

  return response.data;
};
