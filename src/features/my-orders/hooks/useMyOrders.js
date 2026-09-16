import { useCallback, useEffect, useRef, useState } from "react";
import { getMyOrders } from "../api/ordersApi";

const LIMIT = 10;

export default function useMyOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const controllerRef = useRef(null);

  const fetchOrders = useCallback(async (controller, page) => {
    try {
      const response = await getMyOrders({
        page,
        limit: LIMIT,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      setOrders(response.data.orders);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setStatus("success");
    } catch (err) {
      if (err.name === "AbortError" || controller.signal.aborted) return;

      setError(err);
      setStatus(
        err.response?.status === 401 ? "unauthorized" : "error",
      );
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        fetchOrders(controller, currentPage);
      }
    });

    return () => {
      controller.abort();
      controllerRef.current = null;
    };
  }, [fetchOrders, currentPage]);

  const refetch = useCallback(() => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus("loading");
    setError(null);

    return fetchOrders(controller, currentPage);
  }, [fetchOrders, currentPage]);

  const goToPage = useCallback(
    (page) => {
      if (page < 1 || page > totalPages || page === currentPage) return;

      setCurrentPage(page);
    },
    [currentPage, totalPages],
  );

  return {
    orders,
    status,
    error,
    refetch,
    currentPage,
    totalPages,
    goToPage,
  };
}
