
import  { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OrdersFilters from '@/features/orders/components/OrdersFilters'
import OrdersHeader from '@/features/orders/components/OrdersHeader'
 import OrdersTableBody from '@/features/orders/components/OrdersTableBody'
  import OrdersTableHeader from '@/features/orders/components/OrdersTableHeader'
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

import api from "@/api/axios";

import { Badge } from "@/components/ui/badge";

import { Card } from "@/components/ui/card";


import OrderDetailsSheet from "@/features/orders/components/OrderDetailsSheet";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

import OrdersPagination from "../features/orders/components/OrdersPagination";

import {
  TooltipProvider,
} from "@/components/ui/tooltip";



import OrdersTableSkeleton from "../features/orders/components/OrdersTableSkeleton";

const LIMIT = 15;
const DEBOUNCE_DELAY = 500;

export default function OrdersTable() {
  const { t } = useTranslation();

  // Orders
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  // Loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filters
  const [status, setStatus] = useState("all-statuses");
  const [payment, setPayment] = useState("all-payments");
  const [method, setMethod] = useState("all-methods");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Order details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Open order details
  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // Get orders from API
  useEffect(() => {
    const controller = new AbortController();

    const getOrders = async () => {
      setLoading(true);
      setError("");

      try {
        let sortBy;

        if (sortKey === "date") {
          sortBy = "createdAt";
        } else if (sortKey === "total") {
          sortBy = "totalPrice";
        } else if (sortKey === "status") {
          sortBy = "status";
        } else if (sortKey === "customer") {
          sortBy = "shippingAddress.fullName";
        } else if (sortKey === "paymentStatus") {
          sortBy = "paymentStatus";
        }

        const response = await api.get("/orders/admin", {
          params: {
            page: currentPage,
            limit: LIMIT,
            search: debouncedSearch || undefined,

            status: status !== "all-statuses" ? status : undefined,

            paymentStatus:
              payment !== "all-payments" ? payment : undefined,

            sortBy: sortBy,

            sortDir: sortKey ? sortDirection : undefined,
          },

          signal: controller.signal,
        });

        const data = response.data;

        setOrders(data.orders || []);
        setTotalOrders(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (
          err.name === "CanceledError" ||
          err.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(err);
        setError(t("orders.loadError"));
      } finally {
        // Don't change loading state if this request was aborted.
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getOrders();

    return () => {
      controller.abort();
    };
  }, [
    currentPage,
    debouncedSearch,
    status,
    payment,
    sortKey,
    sortDirection,
    t,
  ]);

  // Handlers
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handlePaymentChange = (value) => {
    setPayment(value);
    setCurrentPage(1);
  };

  const handleMethodChange = (value) => {
    setMethod(value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setCurrentPage(1);

    if (sortKey === key) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc",
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key) => {
    const isActive = sortKey === key;

    if (!isActive) {
      return (
        <ArrowUpDown className="ms-1.5 inline size-3.5 text-gray-400 opacity-40 transition-opacity group-hover:opacity-100" />
      );
    }

    if (sortDirection === "asc") {
      return (
        <ArrowUp className="ms-1.5 inline size-3.5 font-bold text-[var(--color-primary)]" />
      );
    }

    return (
      <ArrowDown className="ms-1.5 inline size-3.5 font-bold text-[var(--color-primary)]" />
    );
  };

  // Status badge logic
  const renderStatusBadge = (statusValue) => {
    const currentStatus = statusValue?.toLowerCase();

    if (currentStatus === "delivered") {
      return (
        <Badge
          variant="outline"
          className="border-transparent px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: "var(--color-success-bg)",
            color: "var(--color-success)",
          }}
        >
          <span
            className="mr-1.5 size-1.5 rounded-full"
            style={{
              backgroundColor: "var(--color-success)",
            }}
          />
          {t("orders.status.delivered")}
        </Badge>
      );
    }

    if (
      currentStatus === "shipped" ||
      currentStatus === "confirmed"
    ) {
      return (
        <Badge
          variant="outline"
          className="border-transparent px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: "var(--color-info-bg)",
            color: "var(--color-info)",
          }}
        >
          <span
            className="mr-1.5 size-1.5 rounded-full"
            style={{
              backgroundColor: "var(--color-info)",
            }}
          />

          {t(`orders.status.${currentStatus}`, {
            defaultValue: currentStatus,
          })}
        </Badge>
      );
    }

    if (
      currentStatus === "processing" ||
      currentStatus === "pending"
    ) {
      return (
        <Badge
          variant="outline"
          className="border-transparent px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-primary)",
          }}
        >
          <span
            className="mr-1.5 size-1.5 rounded-full"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
          />

          {t(`orders.status.${currentStatus}`, {
            defaultValue: currentStatus,
          })}
        </Badge>
      );
    }

    if (currentStatus === "cancelled") {
      return (
        <Badge
          variant="outline"
          className="border-transparent px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: "var(--color-error-bg)",
            color: "var(--color-error)",
          }}
        >
          <span
            className="mr-1.5 size-1.5 rounded-full"
            style={{
              backgroundColor: "var(--color-error)",
            }}
          />

          {t("orders.status.cancelled")}
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="border-transparent px-2.5 py-1 text-xs font-semibold"
        style={{
          backgroundColor: "var(--color-surface-secondary)",
          color: "var(--color-text-secondary)",
        }}
      >
        <span
          className="mr-1.5 size-1.5 rounded-full"
          style={{
            backgroundColor: "var(--color-text-secondary)",
          }}
        />

        {statusValue
          ? t(`orders.status.${statusValue.toLowerCase()}`, {
              defaultValue: statusValue,
            })
          : t("orders.status.unknown")}
      </Badge>
    );
  };

  // Payment Status Badge
 
  return (
    <div
      className="min-h-screen p-8 font-sans"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text-primary)",
      }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}

        <OrdersHeader totalOrders={totalOrders} />

        {/* Search and Filters */}

        <OrdersFilters
          search={search}
          status={status}
          payment={payment}
          method={method}
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          onPaymentChange={handlePaymentChange}
          onMethodChange={handleMethodChange}
        />

        {/* Table */}
        <TooltipProvider>
          <Card className="overflow-hidden border-[var(--color-border)] bg-[var(--color-surface)] p-0 shadow-[var(--shadow-sm)]">
            {/* Loading */}
            {loading && (
              <div className="overflow-x-auto">
                <Table>
                  {/* table header */}
                  <TableHeader>
                    <TableRow className="bg-[var(--color-surface-secondary)]">
                      <TableHead>{t("orders.columns.order")}</TableHead>

                      <TableHead>{t("orders.columns.customer")}</TableHead>

                      <TableHead>{t("orders.columns.date")}</TableHead>

                      <TableHead>{t("orders.columns.status")}</TableHead>

                      <TableHead>{t("orders.columns.paymentStatus")}</TableHead>

                      <TableHead>{t("orders.columns.paymentMethod")}</TableHead>

                      <TableHead>{t("orders.columns.total")}</TableHead>
                    </TableRow>
                  </TableHeader>

                

                  <OrdersTableSkeleton />
                </Table>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="py-12 text-center text-sm text-[var(--color-error)]">
                {error}
              </div>
            )}

            {/* No Orders */}
            {!loading && !error && orders.length === 0 && (
              <div className="py-12 text-center text-sm text-[var(--color-text-secondary)]">
                {t("orders.noOrdersFound")}
              </div>
            )}

            {/* Orders */}
            {!loading && !error && orders.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <Table>
                  
                    <OrdersTableHeader
                      onSort={handleSort}
                      getSortIcon={getSortIcon}
                      sortKey={sortKey}
                    />

                    {/* Body */}
                    <OrdersTableBody
                      orders={orders}
                      onRowClick={handleRowClick}
                      renderStatusBadge={renderStatusBadge}
                    />
                  </Table>
                </div>

                {/* Pagination */}
                <OrdersPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </Card>
        </TooltipProvider>
      </div>

      <OrderDetailsSheet
        selectedOrder={selectedOrder}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        setOrders={setOrders}
        renderStatusBadge={renderStatusBadge}
      />
    </div>
  );
}
