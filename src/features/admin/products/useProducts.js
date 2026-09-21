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

// Map the controller's sortKey + sortDirection onto the products API's single
// `sort` query parameter. Columns without a real backend sort are omitted.
const SORT_COLUMNS = {
  name: "name",
  price: { asc: "price_asc", desc: "price_desc" },
};

function resolveSortParam(sortKey, sortDirection) {
  if (!sortKey) return undefined;
  const mapping = SORT_COLUMNS[sortKey];
  if (!mapping) return undefined;
  return typeof mapping === "string" ? mapping : mapping[sortDirection] ?? mapping.asc;
}

// Map the controller's query state onto the products API's flat query params.
function buildParams({ search, filters, page, limit, sortKey, sortDirection }) {
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

  const sortParam = resolveSortParam(sortKey, sortDirection);
  if (sortParam) {
    params.sort = sortParam;
  } else if (filters.sort) {
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
    fetchData: ({ search, filters, page, limit, sortKey, sortDirection, signal }) =>
      getProducts(buildParams({ search, filters, page, limit, sortKey, sortDirection }), signal),
    mapResponse: (data) => {
      const rows = data?.products ?? [];
      const total = Number.isFinite(Number(data?.total))
        ? Number(data.total)
        : Number.isFinite(Number(data?.totalProducts))
          ? Number(data.totalProducts)
          : rows.length;

      return {
        rows,
        total,
        totalPages: data?.totalPages ?? 1,
      };
    },
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
    totalProducts: table.total,
    isLoading: table.isLoading,
    isFetching: table.isFetching,
    error: table.error,
    search: table.search,
    appliedSearch: table.appliedSearch,
    filters: table.filters,
    setFilters: table.setFilters,
    sortKey: table.sortKey,
    sortDirection: table.sortDirection,
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
    handleSort: table.handleSort,
    handlePageChange: table.handlePageChange,
    clearFilters: table.clearFilters,
    clearQuery: table.clearQuery,
    retry: table.retry,
    handleDelete,
  };
}