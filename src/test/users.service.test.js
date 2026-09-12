import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/api/axios";
import {
  changeUserRole,
  createUser,
  deleteUser,
  getUsers,
} from "../features/admin/users/users.service";

vi.mock("@/api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const resolve = () => new Promise((resolve) => resolve({ data: {} }));

describe("users.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockReturnValue(resolve());
    api.post.mockReturnValue(resolve());
    api.patch.mockReturnValue(resolve());
    api.delete.mockReturnValue(resolve());
  });

  it("getUsers calls GET /users/all and returns data.users", async () => {
    api.get.mockResolvedValueOnce({ data: { users: [{ _id: "u1" }] } });

    const result = await getUsers();

    expect(api.get).toHaveBeenCalledWith("/users/all", { signal: undefined });
    expect(result).toEqual([{ _id: "u1" }]);
  });

  it("createUser sends only the documented fields (no fabricated role)", async () => {
    const payload = { username: "x", email: "x@y.com", password: "123456", phone: "0100" };

    await createUser(payload);

    expect(api.post).toHaveBeenCalledWith("/users/add", payload, { signal: undefined });
    expect(api.post.mock.calls[0][1]).not.toHaveProperty("role");
  });

  it("changeUserRole calls PATCH /auth/change-role with { userId, role }", async () => {
    await changeUserRole({ userId: "u1", role: "admin" });

    expect(api.patch).toHaveBeenCalledWith(
      "/auth/change-role",
      { userId: "u1", role: "admin" },
      { signal: undefined },
    );
  });

  it("deleteUser calls DELETE /users/{id}", async () => {
    await deleteUser("u1");

    expect(api.delete).toHaveBeenCalledWith("/users/u1", { signal: undefined });
  });
});