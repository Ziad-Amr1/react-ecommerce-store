import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminErrorState from "../features/admin/components/AdminErrorState";
import AdminTableEmptyState from "../features/admin/components/AdminTableEmptyState";
import ProductsTable from "../features/admin/products/components/ProductsTable";

const PRODUCTS = [
  {
    _id: "p1",
    name: "Wireless Headphones",
    category: "Electronics",
    brand: "TechNova",
    price: 1200,
    stock: 25,
    tags: ["audio"],
    images: [],
  },
];

describe("AdminErrorState", () => {
  it("renders the title, hint and a working retry button", () => {
    const onRetry = vi.fn();
    render(
      <AdminErrorState
        title="Load failed"
        hint="Please try again."
        onRetry={onRetry}
        retryLabel="Retry"
      />,
    );

    expect(screen.getByText("Load failed")).toBeInTheDocument();
    expect(screen.getByText("Please try again.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe("AdminTableEmptyState", () => {
  it("renders title and hint", () => {
    render(<AdminTableEmptyState title="Nothing here" hint="Try again later" />);

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Try again later")).toBeInTheDocument();
  });
});

describe("ProductsTable page states", () => {
  const baseProps = {
    products: [],
    isLoading: false,
    isFetching: false,
    deletingProductId: null,
    hasActiveQuery: false,
    currentPage: 1,
    totalPages: 1,
    onPageChange: vi.fn(),
    onView: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onClearQuery: vi.fn(),
  };

  it("renders a skeleton while loading", () => {
    const { container } = render(
      <ProductsTable {...baseProps} isLoading isFetching />,
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders the empty state without rows", () => {
    render(<ProductsTable {...baseProps} />);

    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("renders product rows and prices in EGP when populated", () => {
    render(<ProductsTable {...baseProps} products={PRODUCTS} />);

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("EGP 1,200.00")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).not.toHaveLength(0);
  });

  it("offers a clear-query action in the empty state when a query is active", () => {
    const onClearQuery = vi.fn();
    render(<ProductsTable {...baseProps} hasActiveQuery onClearQuery={onClearQuery} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear query" }));
    expect(onClearQuery).toHaveBeenCalledTimes(1);
  });
});