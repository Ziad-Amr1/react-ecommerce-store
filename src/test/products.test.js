import { createElement } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor, render, screen, fireEvent } from "@testing-library/react";
import useProducts from "../features/admin/products/useProducts";
import ProductsTable from "../features/admin/products/components/ProductsTable";
import ProductImagePreview from "../features/admin/products/components/ProductImagePreview";
import { createProductFormData } from "../features/admin/products/utils/productFormData";
import { filterDuplicateFiles } from "../features/admin/products/utils/fileUtils";
import api from "@/api/axios";

vi.mock("@/api/axios", () => ({
  default: {
    get: vi.fn(() => new Promise(() => {})),
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useProducts - handleSearchChange", () => {
  it("should update search value", () => {
    const { result } = renderHook(() => useProducts());

    act(() => {
      result.current.handleSearchChange("iphone");
    });

    expect(result.current.search).toBe("iphone");
  });
});

describe("useProducts - handleSelectSearchResult", () => {
  it("should update search value and current page", () => {
    const { result } = renderHook(() => useProducts());

    act(() => {
      result.current.handleSelectSearchResult("iphone");
    });

    expect(result.current.search).toBe("iphone");
    expect(result.current.appliedSearch).toBe(result.current.search);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.isFetching).toBeTruthy();
  });
});

describe("useProducts - handlePageChange", () => {
  it("should update current page and set fetching state", () => {
    const { result } = renderHook(() => useProducts());

    act(() => {
      result.current.handlePageChange(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.isFetching).toBeTruthy();
  });
});

describe("useProducts - total count fallback", () => {
  it("should derive a total from the current product list when API total is missing", async () => {
    api.get.mockImplementation(() =>
      Promise.resolve({
        data: {
          products: [{ _id: "a" }, { _id: "b" }, { _id: "c" }],
          totalPages: 1,
        },
      }),
    );

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.totalProducts).toBe(3);
    });
  });
});

describe("ProductsTable - product row click", () => {
  it("should open the details drawer when a product row is clicked", () => {
    const onView = vi.fn();

    render(
      createElement(ProductsTable, {
        products: [{ _id: "prod-1", name: "Test Product", category: "Home", brand: "Brand", price: 120, stock: 7, images: [{ url: "" }] }],
        isLoading: false,
        isFetching: false,
        deletingProductId: null,
        hasActiveQuery: false,
        sortKey: "",
        sortDirection: "asc",
        onSort: () => {},
        currentPage: 1,
        totalPages: 1,
        onPageChange: () => {},
        onProductClick: onView,
        onView,
        onEdit: () => {},
        onDelete: () => {},
        onClearQuery: () => {},
      }),
    );

    fireEvent.click(screen.getByText("Test Product"));

    expect(onView).toHaveBeenCalledWith("prod-1");
  });
});

describe("ProductImagePreview - image preview", () => {
  it("should render a preview only when a valid file is provided", async () => {
    const file = new File(["image-content"], "preview.png", { type: "image/png" });
    const createObjectURL = vi.fn(() => "blob:preview");
    const revokeObjectURL = vi.fn();

    globalThis.URL.createObjectURL = createObjectURL;
    globalThis.URL.revokeObjectURL = revokeObjectURL;

    const { rerender, container } = render(
      createElement(ProductImagePreview, { file, alt: "New product image" }),
    );

    await waitFor(() => {
      expect(container.querySelector("img")).toHaveAttribute("src");
      expect(container.querySelector("img").getAttribute("src")).toMatch(/^data:|^blob:/);
    });

    rerender(createElement(ProductImagePreview, { file: null, alt: "New product image" }));

    await waitFor(() => {
      expect(container.querySelector("img")).toBeNull();
    });
  });
});

describe("filterDuplicateFiles - duplicate image handling", () => {
  it("should ignore images that are already selected", () => {
    const existing = [new File(["a"], "headphones.png", { type: "image/png", lastModified: 111 })];
    const selected = [
      new File(["a"], "headphones.png", { type: "image/png", lastModified: 111 }),
      new File(["b"], "camera.png", { type: "image/png", lastModified: 222 }),
    ];

    expect(filterDuplicateFiles(selected, existing)).toHaveLength(1);
    expect(filterDuplicateFiles(selected, existing)[0].name).toBe("camera.png");
  });
});

describe("createProductFormData - tags serialization", () => {
  it("should send tags and deleted images as arrays, not JSON strings", () => {
    const formData = createProductFormData(
      {
        name: "Laptop",
        shortDescription: "Great laptop",
        description: "Excellent quality",
        price: "1200",
        stock: "10",
        discountPrice: "1100",
        sku: "SKU-1",
        category: "Electronics",
        subcategory: "Computers",
        brand: "Apple",
        tags: ["new", "featured"],
      },
      [new File(["a"], "first.png", { type: "image/png" })],
      ["image-1", "image-2"],
    );

    expect(formData.getAll("tags")).toEqual(["new", "featured"]);
    expect(formData.getAll("deletedImages")).toEqual(["image-1", "image-2"]);
  });
});
