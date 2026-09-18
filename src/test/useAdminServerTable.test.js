import { describe, it, expect, vi, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useAdminServerTable from "../features/admin/components/useAdminServerTable";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function setupHook({ mapResponse, ...overrides } = {}) {
  const fetchData = vi.fn();
  const deferreds = [];
  fetchData.mockImplementation((params) => {
    const d = deferred();
    d.params = params;
    deferreds.push(d);
    return d.promise;
  });

  const hook = renderHook(() =>
    useAdminServerTable({
      fetchData,
      pageSize: 10,
      mapResponse,
      ...overrides,
    }),
  );

  return { fetchData, deferreds, hook };
}

// The controller kicks off its initial fetch asynchronously (microtask), so a
// test must flush microtasks before inspecting or resolving the first request.
const flush = () => act(async () => {});

describe("useAdminServerTable", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the first page on mount and exposes mapped rows/metadata", async () => {
    const { fetchData, deferreds, hook } = setupHook({
      mapResponse: (payload) => ({
        rows: payload?.data?.items ?? [],
        total: payload?.data?.total ?? 0,
        totalPages: payload?.data?.totalPages ?? 1,
      }),
    });

    await flush();

    expect(fetchData).toHaveBeenCalledTimes(1);
    expect(fetchData).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10, filters: {} }),
    );

    await act(async () => {
      deferreds[0].resolve({
        data: { items: [{ id: "a" }, { id: "b" }], total: 22, totalPages: 3 },
      });
    });

    expect(hook.result.current.isFetching).toBe(false);
    expect(hook.result.current.rows).toEqual([{ id: "a" }, { id: "b" }]);
    expect(hook.result.current.total).toBe(22);
    expect(hook.result.current.totalPages).toBe(3);
  });

  it("distinguishes a blocking first load from background refetches", async () => {
    const { deferreds, hook } = setupHook();

    expect(hook.result.current.isLoading).toBe(true);

    await flush();

    await act(async () => {
      deferreds[0].resolve({ rows: [{ id: "a" }], total: 1, totalPages: 1 });
    });

    expect(hook.result.current.isLoading).toBe(false);

    await act(async () => {
      hook.result.current.reload();
    });

    expect(hook.result.current.isFetching).toBe(true);
    expect(hook.result.current.isLoading).toBe(false);
  });

  it("refetches on page change with the new page number", async () => {
    const { fetchData, deferreds, hook } = setupHook();

    await flush();

    await act(async () => {
      deferreds[0].resolve({ rows: [{ id: "a" }], total: 20, totalPages: 2 });
    });

    await act(async () => {
      hook.result.current.handlePageChange(2);
    });

    expect(fetchData).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2, limit: 10 }),
    );
  });

  it("debounces search commits and resets to page 1", async () => {
    vi.useFakeTimers();
    const { fetchData, deferreds, hook } = setupHook();

    await flush();

    await act(async () => {
      deferreds[0].resolve({ rows: [], total: 0, totalPages: 1 });
    });

    await act(async () => {
      hook.result.current.handlePageChange(2);
    });

    act(() => {
      hook.result.current.handleSearchChange("ip");
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(hook.result.current.appliedSearch).toBe("");

    act(() => {
      vi.advanceTimersByTime(250);
    });
    await flush();

    expect(hook.result.current.appliedSearch).toBe("ip");
    expect(hook.result.current.currentPage).toBe(1);
    expect(fetchData).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, search: "ip" }),
    );

    vi.useRealTimers();
    await act(async () => {
      deferreds[2].resolve({ rows: [], total: 0, totalPages: 1 });
    });
  });

  it("commits a search selection immediately, bypassing the debounce", async () => {
    vi.useFakeTimers();
    const { fetchData, deferreds, hook } = setupHook();

    await act(async () => {
      hook.result.current.selectSearch("iphone");
    });

    expect(hook.result.current.search).toBe("iphone");
    expect(hook.result.current.appliedSearch).toBe("iphone");
    expect(hook.result.current.currentPage).toBe(1);
    expect(fetchData).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, search: "iphone" }),
    );

    await act(async () => {
      deferreds[0].resolve({ rows: [], total: 0, totalPages: 1 });
    });
    vi.useRealTimers();
  });

  it("clears the search query and resets the page", async () => {
    vi.useFakeTimers();
    const { fetchData, deferreds, hook } = setupHook();

    await act(async () => {
      hook.result.current.selectSearch("iphone");
    });

    await act(async () => {
      deferreds[0].resolve({ rows: [], total: 0, totalPages: 1 });
    });

    await act(async () => {
      hook.result.current.clearQuery();
    });

    expect(hook.result.current.search).toBe("");
    expect(hook.result.current.appliedSearch).toBe("");
    expect(hook.result.current.currentPage).toBe(1);
    expect(fetchData).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, search: undefined }),
    );

    vi.useRealTimers();
  });

  it("sorts: toggles direction on the same key and resets the page", async () => {
    const { fetchData, deferreds, hook } = setupHook();

    await flush();

    await act(async () => {
      deferreds[0].resolve({ rows: [], total: 0, totalPages: 2 });
    });

    await act(async () => {
      hook.result.current.handlePageChange(2);
    });

    await act(async () => {
      hook.result.current.handleSort("date");
    });
    expect(hook.result.current.sortKey).toBe("date");
    expect(hook.result.current.sortDirection).toBe("asc");
    expect(hook.result.current.currentPage).toBe(1);

    await act(async () => {
      hook.result.current.handleSort("date");
    });
    expect(hook.result.current.sortDirection).toBe("desc");
    expect(hook.result.current.currentPage).toBe(1);

    await act(async () => {
      hook.result.current.handleSort("status");
    });
    expect(hook.result.current.sortKey).toBe("status");
    expect(hook.result.current.sortDirection).toBe("asc");

    expect(fetchData).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, sortKey: "status", sortDirection: "asc" }),
    );
  });

  it("commits draft filters only when applied and resets the page", async () => {
    const { fetchData, deferreds, hook } = setupHook({
      initialFilters: { category: "", brand: "" },
    });

    await flush();

    await act(async () => {
      deferreds[0].resolve({ rows: [], total: 0, totalPages: 2 });
    });

    await act(async () => {
      hook.result.current.handlePageChange(2);
    });

    await act(async () => {
      hook.result.current.setFilters({ category: "audio", brand: "" });
    });
    await flush();
    expect(fetchData).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: { category: "", brand: "" } }),
    );

    await act(async () => {
      hook.result.current.applyFilters();
    });
    expect(hook.result.current.appliedFilters).toEqual({ category: "audio", brand: "" });
    expect(hook.result.current.currentPage).toBe(1);
    expect(fetchData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        filters: { category: "audio", brand: "" },
      }),
    );
  });

  it("applies a single filter change immediately", async () => {
    const { fetchData, deferreds, hook } = setupHook({
      initialFilters: { status: "all", payment: "all" },
    });

    await flush();

    await act(async () => {
      deferreds[0].resolve({ rows: [], total: 0, totalPages: 1 });
    });

    await act(async () => {
      hook.result.current.changeFilter("status", "delivered");
    });

    expect(hook.result.current.filters.status).toBe("delivered");
    expect(hook.result.current.appliedFilters).toEqual({
      status: "delivered",
      payment: "all",
    });
    expect(hook.result.current.currentPage).toBe(1);
    expect(fetchData).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: { status: "delivered", payment: "all" } }),
    );
  });

  it("cancels the previous request and ignores stale responses", async () => {
    const { deferreds, hook } = setupHook();

    await flush();

    await act(async () => {
      hook.result.current.handlePageChange(2);
    });

    expect(deferreds[0].params.signal.aborted).toBe(true);

    await act(async () => {
      deferreds[1].resolve({ rows: [{ id: "current" }], total: 5, totalPages: 2 });
    });

    expect(hook.result.current.currentPage).toBe(2);
    expect(hook.result.current.rows).toEqual([{ id: "current" }]);
    expect(hook.result.current.total).toBe(5);

    await act(async () => {
      deferreds[0].resolve({ rows: [{ id: "stale" }], total: 99, totalPages: 9 });
    });

    expect(hook.result.current.rows).toEqual([{ id: "current" }]);
    expect(hook.result.current.total).toBe(5);
  });

  it("exposes errors and recovers via retry", async () => {
    const { deferreds, hook } = setupHook();

    await flush();

    await act(async () => {
      deferreds[0].reject(new Error("boom"));
    });

    expect(hook.result.current.error).toBeInstanceOf(Error);
    expect(hook.result.current.isFetching).toBe(false);

    await act(async () => {
      hook.result.current.retry();
    });

    await act(async () => {
      deferreds[1].resolve({ rows: [{ id: "a" }], total: 1, totalPages: 1 });
    });

    expect(hook.result.current.error).toBeNull();
    expect(hook.result.current.rows).toEqual([{ id: "a" }]);
  });

  it("reloads data without clearing the error path", async () => {
    const { fetchData, deferreds, hook } = setupHook();

    await flush();

    await act(async () => {
      deferreds[0].resolve({ rows: [{ id: "a" }], total: 1, totalPages: 1 });
    });

    await act(async () => {
      hook.result.current.reload();
    });

    expect(fetchData).toHaveBeenCalledTimes(2);
  });

  it("updates a row optimistically by id", async () => {
    const { deferreds, hook } = setupHook();

    await flush();

    await act(async () => {
      deferreds[0].resolve({
        rows: [{ _id: "1", status: "pending" }],
        total: 1,
        totalPages: 1,
      });
    });

    act(() => {
      hook.result.current.updateRowById("1", { status: "delivered" });
    });

    expect(hook.result.current.rows[0]).toMatchObject({
      _id: "1",
      status: "delivered",
    });
  });
});