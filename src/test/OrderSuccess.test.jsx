import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import OrderSuccess from "@/pages/OrderSuccess";

function renderAt(entry) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/" element={<div>home-redirect</div>} />
        <Route path="/my-orders" element={<div>my-orders-page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("OrderSuccess", () => {
  it("redirects home when opened without checkout state", () => {
    renderAt("/order-success");

    expect(screen.getByText("home-redirect")).toBeInTheDocument();
  });

  it("renders the confirmation with the order reference", () => {
    renderAt({
      pathname: "/order-success",
      state: { fromCheckout: true, orderId: "order-123" },
    });

    expect(screen.getByText("Order confirmed")).toBeInTheDocument();
    expect(screen.getByText(/order-123/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My orders" })).toHaveAttribute(
      "href",
      "/my-orders",
    );
  });

  it("hides the reference when the order id is missing", () => {
    renderAt({ pathname: "/order-success", state: { fromCheckout: true } });

    expect(screen.getByText("Order confirmed")).toBeInTheDocument();
    expect(screen.queryByText(/Order reference/)).not.toBeInTheDocument();
  });
});
