import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Checkout from "@/pages/Checkout/Checkout";
import useCart from "@/hooks/useCart";
import { createOrder } from "@/features/checkout/checkout.service";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => navigate };
});

vi.mock("@/hooks/useCart", () => ({ default: vi.fn() }));
vi.mock("@/features/checkout/checkout.service", () => ({
  createOrder: vi.fn(),
}));

const cart = {
  items: [{ id: "p1", name: "Desk Lamp", image: "", price: 100, quantity: 2 }],
  itemCount: 2,
  subtotal: 200,
  discountAmount: 0,
  total: 200,
  coupon: null,
};

function renderCheckout() {
  return render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>,
  );
}

describe("Checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCart.mockReturnValue({
      cart,
      isLoading: false,
      clear: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("shows an empty state and no form when the cart is empty", () => {
    useCart.mockReturnValue({
      cart: { ...cart, items: [], itemCount: 0, subtotal: 0, total: 0 },
      isLoading: false,
      clear: vi.fn(),
    });

    renderCheckout();

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Place order" }),
    ).not.toBeInTheDocument();
  });

  it("renders the order summary from the cart", () => {
    renderCheckout();

    expect(screen.getByText("Order summary")).toBeInTheDocument();
    expect(screen.getByText("Desk Lamp")).toBeInTheDocument();
  });

  it("blocks submission and surfaces field errors when the form is empty", async () => {
    renderCheckout();

    fireEvent.click(screen.getByRole("button", { name: "Place order" }));

    expect(await screen.findByText("Full name is required")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required")).toBeInTheDocument();
    expect(createOrder).not.toHaveBeenCalled();
  });

  it("submits the order, clears the cart and navigates on success", async () => {
    const clear = vi.fn().mockResolvedValue(undefined);
    useCart.mockReturnValue({ cart, isLoading: false, clear });
    createOrder.mockResolvedValue({ success: true, order: { _id: "order-9" } });

    renderCheckout();

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Jane Smith" },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+20 100 000 0000" },
    });
    fireEvent.change(screen.getByLabelText("Country"), {
      target: { value: "Egypt" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "Cairo" },
    });
    fireEvent.change(screen.getByLabelText("Street address"), {
      target: { value: "123 Nile Street" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Place order" }));

    await waitFor(() =>
      expect(createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: "cash",
          shippingAddress: expect.objectContaining({
            fullName: "Jane Smith",
            city: "Cairo",
          }),
        }),
        expect.any(AbortSignal),
      ),
    );

    await waitFor(() => expect(clear).toHaveBeenCalled());
    expect(navigate).toHaveBeenCalledWith(
      "/order-success",
      expect.objectContaining({
        replace: true,
        state: { fromCheckout: true, orderId: "order-9" },
      }),
    );
  });
});
