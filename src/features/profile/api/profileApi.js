import api from "@/api/axios";

export async function fetchProfile(signal) {
  const response = await api.get("/auth/me", { signal });

  return response.data.user;
}
