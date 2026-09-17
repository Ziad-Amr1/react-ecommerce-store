import api from "@/api/axios";

export function getUsers(signal) {
  return api.get("/users/all", { signal }).then((response) => response.data?.users || []);
}

export function createUser(payload, signal) {
  return api.post("/users/add", payload, { signal }).then((response) => response.data);
}

// PATCH /users/{id} is documented as "update own profile" only, so it is not
// used from this admin feature. The only admin-side user mutation backed by a
// documented admin endpoint is the role change below.
export function changeUserRole({ userId, role }, signal) {
  return api.patch("/auth/change-role", { userId, role }, { signal }).then((response) => response.data);
}

export function deleteUser(id, signal) {
  return api.delete(`/users/${id}`, { signal }).then((response) => response.data);
}