import { useCallback, useEffect, useRef, useState } from "react";
import { getOrders } from "./orders.service";
import { ORDERS_LIMIT, SORT_COLUMNS } from "./constants";

const ALL = "all";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [status, setStatus] = useState(ALL);
  const [payment, setPayment] = useState(ALL);

  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const controllerRef = useRef(null);

  const fetchOrders = useCallback(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    getOrders({
      page: currentPage,
      limit: ORDERS_LIMIT,
      status: status === ALL ? undefined : status,
      paymentStatus: payment === ALL ? undefined : payment,
      sortBy: sortKey ? SORT_COLUMNS[sortKey] : undefined,
      sortDir: sortKey ? sortDirection : undefined,
      signal: controller.signal,
    })
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }

        const data = response.data;
        setOrders(data?.orders || []);
        setTotalOrders(data?.total || 0);
        setTotalPages(data?.totalPages || 1);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setLoadError(error);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
  }, [currentPage, payment, sortDirection, sortKey, status]);

  useEffect(() => {
    fetchOrders();

    return () => controllerRef.current?.abort();
  }, [fetchOrders, reloadKey]);

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handlePaymentChange = (value) => {
    setPayment(value);
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handleSort = (key) => {
    setCurrentPage(1);
    setIsLoading(true);
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
  };

  const handleOpenDetails = useCallback((order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  const updateOrder = useCallback((orderId, changes) => {
    setOrders((current) =>
      current.map((order) =>
        order._id === orderId ? { ...order, ...changes } : order,
      ),
    );
  }, []);

  const retry = () => {
    setLoadError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  return {
    orders,
    totalOrders,
    totalPages,
    currentPage,
    isLoading,
    loadError,
    status,
    payment,
    sortKey,
    sortDirection,
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