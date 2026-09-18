import { useCallback, useEffect, useRef, useState } from "react";

// Shared, domain-agnostic controller for server-side paged tables.
//
// It owns everything required to fetch a page of rows from an API:
//   - current page / page size
//   - debounced search + applied ("committed") search
//   - draft filters + applied filters (reset to page 1 when applied)
//   - sort key + sort direction
//   - request lifecycle (loading vs fetching), error handling, retry/reload
//   - request cancellation + stale-response protection
//
// It contains NO domain logic: the caller supplies `fetchData`, which maps the
// controller's query state ({ page, limit, search, sortKey, sortDirection,
// filters, signal }) onto its own API contract, and an optional `mapResponse`
// that normalizes the payload into { rows, total, totalPages }.
export default function useAdminServerTable({
  fetchData,
  pageSize,
  debounceMs = 300,
  initialFilters = {},
  initialSortKey = "",
  initialSortDirection = "asc",
  mapResponse = (payload) => payload,
}) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [filters, setFiltersState] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const [sortKey, setSortKey] = useState(initialSortKey);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const controllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const filtersRef = useRef(initialFilters);
  const sortKeyRef = useRef(initialSortKey);

  // A query is a "loading" cycle only while there is nothing on screen yet;
  // paginating/sorting/refreshing existing rows is a lighter "fetching" cycle.
  const isLoading = isFetching && rows.length === 0;

  const run = useCallback(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;
    const requestId = ++requestIdRef.current;

    setIsFetching(true);
    setError(null);

    Promise.resolve(
      fetchData({
        page: currentPage,
        limit: pageSize,
        search: appliedSearch || undefined,
        sortKey,
        sortDirection,
        filters: appliedFilters,
        signal: controller.signal,
      }),
    )
      .then((payload) => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }

        const result = mapResponse(payload);
        setRows(result?.rows ?? []);
        setTotal(result?.total ?? 0);
        setTotalPages(result?.totalPages ?? 1);
      })
      .catch((fetchError) => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }
        setError(fetchError);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }
        setIsFetching(false);
      });
  }, [
    appliedFilters,
    appliedSearch,
    currentPage,
    fetchData,
    mapResponse,
    pageSize,
    sortDirection,
    sortKey,
  ]);

  // `run` closes over the current query state, but it is recreated on every
  // render because callers pass `fetchData`/`mapResponse` as new closures. Key
  // the fetch effect off the query state itself (via a ref) instead of `run`,
  // so a render triggered by unrelated state never restarts the request.
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });

  useEffect(() => {
    // Kick off the fetch asynchronously. A synchronous `runRef.current()` here
    // would set state directly inside the effect, causing cascading renders;
    // scheduling it on the microtask queue sidesteps that while still firing
    // before the browser paints after mount.
    const kickoff = () => runRef.current();
    queueMicrotask(kickoff);

    return () => controllerRef.current?.abort();
  }, [
    appliedFilters,
    appliedSearch,
    currentPage,
    reloadKey,
    sortDirection,
    sortKey,
  ]);

  // Debounce the typed search term before committing it as a server search.
  // Committing always resets to page 1 so results start from the top.
  useEffect(() => {
    if (search === appliedSearch) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setAppliedSearch(search);
      setCurrentPage(1);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [appliedSearch, debounceMs, search]);

  const setFilters = useCallback((updater) => {
    setFiltersState((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      filtersRef.current = next;
      return next;
    });
  }, []);

  // Commit the draft filters (used by "Apply Filters" style UIs). Detached
  // from the draft so a button can apply the latest draft on click.
  const applyFilters = useCallback(() => {
    setAppliedFilters(filtersRef.current);
    setCurrentPage(1);
  }, []);

  // Apply a single filter immediately (used by Select-style UIs).
  const changeFilter = useCallback((key, value) => {
    const next = { ...filtersRef.current, [key]: value };
    filtersRef.current = next;
    setFiltersState(next);
    setAppliedFilters(next);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    filtersRef.current = initialFilters;
    setFiltersState(initialFilters);
    setAppliedFilters(initialFilters);
    setCurrentPage(1);
  }, [initialFilters]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  // Commit a search value immediately, skipping the debounce (used by
  // autocomplete selections).
  const selectSearch = useCallback((value) => {
    setSearch(value);
    setAppliedSearch(value);
    setCurrentPage(1);
  }, []);

  const clearQuery = useCallback(() => {
    setSearch("");
    setAppliedSearch("");
    setCurrentPage(1);
  }, []);

  // Optimistically merge changes into a row by its resource id (used after
  // server-side mutations so the current page reflects the source of truth).
  const updateRowById = useCallback((id, changes) => {
    setRows((current) =>
      current.map((row) =>
        row?._id === id ? { ...row, ...changes } : row,
      ),
    );
  }, []);

  const handleSort = useCallback((key) => {
    setCurrentPage(1);

    if (sortKeyRef.current === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      sortKeyRef.current = key;
      setSortKey(key);
      setSortDirection("asc");
    }
  }, []);

  const handlePageChange = useCallback((page) => {
    if (typeof page !== "number" || !Number.isFinite(page) || page < 1) {
      return;
    }
    setCurrentPage(page);
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  return {
    rows,
    total,
    totalPages,
    currentPage,
    pageSize,
    search,
    appliedSearch,
    filters,
    appliedFilters,
    sortKey,
    sortDirection,
    isFetching,
    isLoading,
    error,
    handleSearchChange,
    selectSearch,
    setFilters,
    applyFilters,
    changeFilter,
    clearFilters,
    clearQuery,
    handleSort,
    handlePageChange,
    retry,
    reload,
    updateRowById,
  };
}