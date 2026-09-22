import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getProducts } from "@/services/product.service";
import {
  readCatalogCache,
  writeCatalogCache,
  isCatalogStale,
  CATALOG_TTL_MS,
} from "./catalogCache";

const CATALOG_PAGE_SIZE = 1000;

// Fetch the whole catalog once (one request when it fits one page, otherwise
// page through the rest). The result is cached in localStorage and reused to
// power the filter sidebar: true category/brand/subcategory counts, the price
// slider ceiling, and instant client-side subcategory results.
async function fetchFullCatalog(signal) {
  const first = await getProducts({ limit: CATALOG_PAGE_SIZE }, signal);
  const products = Array.isArray(first.products) ? [...first.products] : [];
  const total = Number(first.totalProducts);

  if (Number.isFinite(total) && products.length < total) {
    const lastPage = Math.ceil(total / CATALOG_PAGE_SIZE);
    for (let page = 2; page <= lastPage; page += 1) {
      if (signal?.aborted) {
        break;
      }
      const data = await getProducts({ page, limit: CATALOG_PAGE_SIZE }, signal);
      products.push(...(Array.isArray(data.products) ? data.products : []));
    }
  }

  return products;
}

export default function useProductCatalog() {
  const [products, setProducts] = useState(() => readCatalogCache()?.products ?? []);
  const [isLoading, setIsLoading] = useState(() => {
    const cached = readCatalogCache();
    return !cached?.products?.length;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(
    () => readCatalogCache()?.fetchedAt ?? null,
  );

  const refreshingRef = useRef(false);

  const applyCatalog = useCallback((next) => {
    writeCatalogCache(next);
    setProducts(next);
    setLastUpdatedAt(Date.now());
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    if (refreshingRef.current) {
      return;
    }
    refreshingRef.current = true;
    setIsRefreshing(true);
    try {
      const next = await fetchFullCatalog();
      applyCatalog(next);
    } catch (err) {
      setError(err);
    } finally {
      refreshingRef.current = false;
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [applyCatalog]);

  // Seed from the cache when present, then re-fetch in the background when the
  // cache is absent or stale so the page never blocks on the network.
  useEffect(() => {
    const cached = readCatalogCache();
    let cancelled = false;

    if (cached && !isCatalogStale(cached)) {
      // Fresh cache: nothing to fetch unless it expires while this page is open.
      return () => {
        cancelled = true;
      };
    }

    let controller;
    const run = async () => {
      controller = new AbortController();
      if (cached?.products?.length) {
        setIsRefreshing(true);
      }
      try {
        const next = await fetchFullCatalog(controller.signal);
        if (!cancelled) {
          applyCatalog(next);
        }
      } catch (err) {
        if (!cancelled && !products.length) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };
    run();

    return () => {
      cancelled = true;
      controller?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Update it after some time": while this page stays open, sweep for an
  // expired cache once a minute and refresh in the background when one is found.
  useEffect(() => {
    const id = setInterval(() => {
      if (isCatalogStale(readCatalogCache()) && !refreshingRef.current) {
        refresh();
      }
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  const maxPrice = useMemo(() => {
    if (!products.length) {
      return 0;
    }
    return Math.max(...products.map((p) => Number(p.price) || 0));
  }, [products]);

  return {
    products,
    isLoading,
    isRefreshing,
    error,
    lastUpdatedAt,
    maxPrice,
    refresh,
    ttlMs: CATALOG_TTL_MS,
  };
}