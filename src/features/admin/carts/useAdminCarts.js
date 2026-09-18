import { useCallback, useState } from "react";
import useAdminServerTable from "@/features/admin/components/useAdminServerTable";
import { getCarts } from "./carts.service";
import { CARTS_LIMIT } from "./constants";

// Normalize the axios response into the shared controller's row shape so the
// controller stays free of the carts API's response envelope.
const mapResponse = (response) => ({
  rows: response?.data?.carts ?? [],
  total: response?.data?.total ?? 0,
  totalPages: response?.data?.totalPages ?? 1,
});

export default function useAdminCarts() {
  const [selectedCart, setSelectedCart] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const table = useAdminServerTable({
    fetchData: ({ page, signal }) =>
      getCarts({ page, limit: CARTS_LIMIT, signal }),
    mapResponse,
    pageSize: CARTS_LIMIT,
  });

  const handleOpenDetails = useCallback((cart) => {
    setSelectedCart(cart);
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  return {
    carts: table.rows,
    totalCarts: table.total,
    totalPages: table.totalPages,
    currentPage: table.currentPage,
    isLoading: table.isLoading,
    isFetching: table.isFetching,
    loadError: table.error,
    selectedCart,
    isDetailsOpen,
    handlePageChange: (page) => table.handlePageChange(page),
    handleOpenDetails,
    handleCloseDetails,
    retry: () => table.retry(),
  };
}
