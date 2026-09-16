import api from "@/api/axios";

export async function fetchProfile(signal) {
  const response = await api.get("/auth/me", { signal });

  return response.data.user;
}

export async function updateProfile(userId ,data){
  const response = await api.patch(`/users/${userId}`, data);
  
  return response.data;

}