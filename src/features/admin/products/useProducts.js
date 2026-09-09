import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { PAGE_SIZE } from "./constants";
import { deleteProduct, getProducts } from "./product.service";

const EMPTY_FILTERS = {
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  sort: "",
};

export default function useProducts() {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const controllerRef = useRef(null);

  // Debounce the typed search term before applying it as a server search.
  useEffect(() => {
    if (search === appliedSearch) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setAppliedSearch(search);
      setCurrentPage(1);
      setIsFetching(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, appliedSearch]);

  const fetchProducts = useCallback(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    const params = { page: currentPage, limit: PAGE_SIZE };
    if (appliedSearch) {
      params.search = appliedSearch;
    }
    if (appliedFilters.category) {
      params.category = appliedFilters.category;
    }
    if (appliedFilters.brand) {
      params.brand = appliedFilters.brand;
    }
    if (appliedFilters.minPrice) {
      params.minPrice = appliedFilters.minPrice;
    }
    if (appliedFilters.maxPrice) {
      params.maxPrice = appliedFilters.maxPrice;
    }
    if (appliedFilters.sort) {
      params.sort = appliedFilters.sort;
    }

    getProducts(params, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((fetchError) => {
        if (!controller.signal.aborted) {
          setError(fetchError);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsFetching(false);
        }
      });
  }, [currentPage, appliedSearch, appliedFilters]);

  useEffect(() => {
    fetchProducts();

    return () => controllerRef.current?.abort();
  }, [fetchProducts, reloadKey]);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleSelectSearchResult = (productName) => {
    setSearch(productName);
    setAppliedSearch(productName);
    setCurrentPage(1);
    setIsFetching(true);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setIsFetching(true);
  };

  const handlePageChange = (page) => {
    setIsFetching(true);
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setCurrentPage(1);
    setIsFetching(true);
  };

  const clearQuery = () => {
    setSearch("");
    setAppliedSearch("");
    setCurrentPage(1);
    setIsFetching(true);
  };

  const retry = () => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  const handleDelete = async () => {
    if (!productToDelete) {
      return;
    }

    setDeletingProductId(productToDelete._id);

    try {
      await deleteProduct(productToDelete._id);
      toast.success(t("products.deleted"));
      setProductToDelete(null);

      if (products.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        setReloadKey((key) => key + 1);
      }
    } catch {
      toast.error(t("products.deleteFailed"));
    } finally {
      setDeletingProductId(null);
    }
  };

  const hasActiveQuery =
    appliedSearch !== "" ||
    Object.values(appliedFilters).some((value) => value !== "");

  return {
    products,
    isLoading,
    isFetching,
    error,
    search,
    appliedSearch,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    currentPage,
    totalPages,
    productToDelete,
    setProductToDelete,
    deletingProductId,
    hasActiveQuery,
    handleSearchChange,
    handleSelectSearchResult,
    handleApplyFilters,
    handlePageChange,
    clearFilters,
    clearQuery,
    retry,
    handleDelete,
  };
}