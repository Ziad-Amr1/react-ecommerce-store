import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts } from "@/services/product.service";

const PAGE_LIMIT = 12;

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const controllerRef = useRef(null);

  // Server-side filtering: the /products endpoint already supports
  // page, limit, search, category, brand, minPrice, maxPrice and sort
  // (same contract the admin products list relies on).
  const fetchProducts = useCallback(async (page = 1, applied = {}) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const params = { page, limit: PAGE_LIMIT };

    if (applied.search) {
      params.search = applied.search;
    }
    if (applied.category && applied.category !== "All") {
      params.category = applied.category;
    }
    if (applied.minPrice !== "") {
      params.minPrice = applied.minPrice;
    }
    if (applied.maxPrice !== "") {
      params.maxPrice = applied.maxPrice;
    }
    if (applied.sortBy && applied.sortBy !== "Default") {
      params.sort = applied.sortBy;
    }

    try {
      setApiError(null);
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsPaginationLoading(true);
      }

      const data = await getProducts(params, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      setProducts(Array.isArray(data.products) ? data.products : []);
      setCurrentPage(page);
      setTotalPages(Number(data.totalPages) > 0 ? Number(data.totalPages) : 1);
      setTotalProducts(
        Number.isFinite(Number(data.totalProducts))
          ? Number(data.totalProducts)
          : null,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        setApiError(error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setIsPaginationLoading(false);
      }
    }
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    products,
    currentPage,
    totalPages,
    totalProducts,
    isLoading,
    isPaginationLoading,
    apiError,
    fetchProducts,
  };
};

export default useProducts;