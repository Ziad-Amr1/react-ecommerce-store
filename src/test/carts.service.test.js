import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/api/axios";
import { getCarts } from "../features/admin/carts/carts.service";

vi.mock("@/api/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("carts.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCarts calls GET /orders/admin/carts with page, limit and the abort signal", async () => {
    const response = { data: { carts: [], total: 0, totalPages: 1 } };
    api.get.mockResolvedValueOnce(response);
    const controller = new AbortController();

    const result = await getCarts({
      page: 2,
      limit: 10,
      signal: controller.signal,
    });

    expect(api.get).toHaveBeenCalledWith("/orders/admin/carts", {
      signal: controller.signal,
      params: { page: 2, limit: 10 },
    });
    expect(result).toBe(response);
  });
});
