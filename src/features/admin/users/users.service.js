import api from "@/api/axios";

export function getUsers(signal) {
  return api.get("/users/all", { signal }).then((response) => response.data?.users || []);
}

export function createUser(payload, signal) {
  return api.post("/users/add", payload, { signal }).then((response) => response.data);
}

// Documented as "update own profile" (username, phone, avatar). Admin pages
// use it to edit a user's profile fields; email is not editable per the API.
export function updateUserProfile(id, payload, signal) {
  return api.patch(`/users/${id}`, payload, { signal }).then((response) => response.data);
}

// Role changes are a separate admin endpoint, not a field of PATCH /users/{id}.
export function changeUserRole({ userId, role }, signal) {
  return api.patch("/auth/change-role", { userId, role }, { signal }).then((response) => response.data);
}

export function deleteUser(id, signal) {
  return api.delete(`/users/${id}`, { signal }).then((response) => response.data);
}