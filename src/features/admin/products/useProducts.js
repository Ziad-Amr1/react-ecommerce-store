import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useAdminServerTable from "@/features/admin/components/useAdminServerTable";
import { PAGE_SIZE } from "./constants";
import { deleteProduct, getProducts } from "@/services/product.service";

const EMPTY_FILTERS = {
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  sort: "",
};

// Map the controller's query state onto the products API's flat query params.
function buildParams({ search, filters, page, limit }) {
  const params = { page, limit };

  if (search) {
    params.search = search;
  }
  if (filters.category) {
    params.category = filters.category;
  }
  if (filters.brand) {
    params.brand = filters.brand;
  }
  if (filters.minPrice) {
    params.minPrice = filters.minPrice;
  }
  if (filters.maxPrice) {
    params.maxPrice = filters.maxPrice;
  }
  if (filters.sort) {
    params.sort = filters.sort;
  }

  return params;
}

export default function useProducts() {
  const { t } = useTranslation();

  const [showFilters, setShowFilters] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const table = useAdminServerTable({
    fetchData: ({ search, filters, page, limit, signal }) =>
      getProducts(buildParams({ search, filters, page, limit }), signal),
    mapResponse: (data) => ({
      rows: data?.products ?? [],
      total: data?.total ?? 0,
      totalPages: data?.totalPages ?? 1,
    }),
    pageSize: PAGE_SIZE,
    initialFilters: EMPTY_FILTERS,
  });

  const handleSelectSearchResult = (productName) => {
    table.selectSearch(productName);
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

      if (table.rows.length === 1 && table.currentPage > 1) {
        table.handlePageChange(table.currentPage - 1);
      } else {
        table.reload();
      }
    } catch {
      toast.error(t("products.deleteFailed"));
    } finally {
      setDeletingProductId(null);
    }
  };

  const hasActiveQuery =
    table.appliedSearch !== "" ||
    Object.values(table.appliedFilters).some((value) => value !== "");

  return {
    products: table.rows,
    isLoading: table.isLoading,
    isFetching: table.isFetching,
    error: table.error,
    search: table.search,
    appliedSearch: table.appliedSearch,
    filters: table.filters,
    setFilters: table.setFilters,
    showFilters,
    setShowFilters,
    currentPage: table.currentPage,
    totalPages: table.totalPages,
    productToDelete,
    setProductToDelete,
    deletingProductId,
    hasActiveQuery,
    handleSearchChange: table.handleSearchChange,
    handleSelectSearchResult,
    handleApplyFilters: table.applyFilters,
    handlePageChange: table.handlePageChange,
    clearFilters: table.clearFilters,
    clearQuery: table.clearQuery,
    retry: table.retry,
    handleDelete,
  };
}