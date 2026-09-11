import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useProducts from "../features/admin/products/useProducts";

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
