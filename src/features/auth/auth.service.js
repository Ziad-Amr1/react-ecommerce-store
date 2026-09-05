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

export const sendRegistrationOTP = async (username, email, password, phone) => {
  const response = await api.post("/auth/register/send-otp", {
    username,
    email,
    password,
    phone,
  });

  return response.data;
};

export const verifyRegistrationOTP = async (email, otp) => {
  const response = await api.post("/auth/register/verify-otp", {
    email,
    otp,
  });

  return response.data;
};
