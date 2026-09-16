import api from "@/api/axios";

export const loginUser = async (email, password) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me", {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }

    throw error;
  }
};

export const sendForgotPasswordOTP = async (email) => {
  const response = await api.post("/auth/forgot-password/send-otp", {
    email,
  });

  return response.data;
};

export const verifyForgotPasswordOTP = async (
  email,
  otp,
  newPassword,
) => {
  const response = await api.post("/auth/forgot-password/verify-otp", {
    email,
    otp,
    newPassword,
  });

  return response.data;
};

export const sendRegistrationOTP = async (
  username,
  email,
  password,
  phone,
) => {
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