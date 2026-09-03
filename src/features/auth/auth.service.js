import api from "@/api/axios";

export const sendForgotPasswordOTP = async (email) => {
  const response = await api.post("/auth/forgot-password/send-otp", {
    email,
  });

  return response.data;
};

export const verifyForgotPasswordOTP = async (email, otp, newPassword) => {
  const response = await api.post("/auth/forgot-password/verify-otp", {
    email,
    otp,
    newPassword,
  });

  return response.data;
};
