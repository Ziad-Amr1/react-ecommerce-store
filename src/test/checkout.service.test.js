import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/api/axios";
import { createOrder } from "@/features/checkout/checkout.service";

vi.mock("@/api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const payload = {
  shippingAddress: {
    fullName: "Jane Smith",
    phone: "+20 100 000 0000",
    country: "Egypt",
    city: "Cairo",
    address: "123 Nile Street",
    postalCode: "",
  },
  paymentMethod: "cash",
  customerNote: "",
};

describe("checkout.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POSTs the order payload and resolves with the parsed body", async () => {
    const body = { success: true, message: "Order created", order: { _id: "o1" } };
    api.post.mockResolvedValueOnce({ data: body });
    const controller = new AbortController();

    const result = await createOrder(payload, controller.signal);

    expect(api.post).toHaveBeenCalledWith("/orders", payload, {
      signal: controller.signal,
    });
    expect(result).toEqual(body);
  });

  it("propagates API errors to the caller", async () => {
    const error = new Error("request failed");
    api.post.mockRejectedValueOnce(error);

    await expect(createOrder(payload, undefined)).rejects.toBe(error);
  });
});
