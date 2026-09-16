import { useCallback, useState } from "react";
import useAdminServerTable from "@/features/admin/components/useAdminServerTable";
import { getOrders } from "./orders.service";
import { ORDERS_LIMIT, SORT_COLUMNS } from "./constants";

const ALL = "all";

// Normalize the axios response into the shared controller's row shape so the
// controller stays free of the orders API's response envelope.
const mapResponse = (response) => ({
  rows: response?.data?.orders ?? [],
  total: response?.data?.total ?? 0,
  totalPages: response?.data?.totalPages ?? 1,
});

export default function useOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const table = useAdminServerTable({
    fetchData: ({ page, sortKey, sortDirection, filters, signal }) =>
      getOrders({
        page,
        limit: ORDERS_LIMIT,
        status: filters.status === ALL ? undefined : filters.status,
        paymentStatus: filters.payment === ALL ? undefined : filters.payment,
        sortBy: sortKey ? SORT_COLUMNS[sortKey] : undefined,
        sortDir: sortKey ? sortDirection : undefined,
        signal,
      }),
    mapResponse,
    pageSize: ORDERS_LIMIT,
    initialFilters: { status: ALL, payment: ALL },
  });

  const handleStatusChange = (value) => table.changeFilter("status", value);
  const handlePaymentChange = (value) => table.changeFilter("payment", value);
  const handleSort = (key) => table.handleSort(key);
  const handlePageChange = (page) => table.handlePageChange(page);
  const retry = () => table.retry();

  const handleOpenDetails = useCallback((order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  const { updateRowById } = table;

  const updateOrder = useCallback(
    (orderId, changes) => updateRowById(orderId, changes),
    [updateRowById],
  );

  return {
    orders: table.rows,
    totalOrders: table.total,
    totalPages: table.totalPages,
    currentPage: table.currentPage,
    isLoading: table.isLoading,
    isFetching: table.isFetching,
    loadError: table.error,
    status: table.filters.status,
    payment: table.filters.payment,
    sortKey: table.sortKey,
    sortDirection: table.sortDirection,
    selectedOrder,
    isDetailsOpen,
    handleStatusChange,
    handlePaymentChange,
    handleSort,
    handlePageChange,
    handleOpenDetails,
    handleCloseDetails,
    updateOrder,
    retry,
  };
}