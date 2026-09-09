
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // 1. استيراد Hook الترجمة

import { Search, ArrowUp, ArrowDown, ArrowUpDown, Package } from "lucide-react";

import api from "@/api/axios";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import { formatNumber } from "@/utils/formatNumber";

import OrderDetailsSheet from "@/features/orders/components/OrderDetailsSheet";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import OrdersPagination from "../features/orders/components/OrdersPagination";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import OrdersTableSkeleton from "../features/orders/components/OrdersTableSkeleton";

const LIMIT = 15;

export default function OrdersTable() {
  const { t, i18n } = useTranslation(); // 2. تفعيل التدويل

  // Orders
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  // Loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search
  const [search, setSearch] = useState("");

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

  // Get orders from API
  useEffect(() => {
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
        }

        const response = await api.get("/orders/admin", {
          params: {
            page: currentPage,
            limit: LIMIT,
            search: search || undefined,
            status: status !== "all-statuses" ? status : undefined,
            paymentStatus: payment !== "all-payments" ? payment : undefined,
            paymentMethod: method !== "all-methods" ? method : undefined,
            sortBy: sortBy,
            sortOrder: sortKey ? sortDirection : undefined,
          },
        });

        const data = response.data;
        setOrders(data.orders || []);
        setTotalOrders(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.log(err);
        setError(t("orders.loadError")); // 3. استخدام الترجمة للأخطاء
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [currentPage, search, status, payment, method, sortKey, sortDirection, t]);

  // Search
  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  // Filters
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

  // Sorting
  const handleSort = (key) => {
    setCurrentPage(1);

    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="ml-1 inline size-3.5 opacity-40" />;
    }

    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 inline size-3.5" />;
    }

    return <ArrowDown className="ml-1 inline size-3.5" />;
  };

  // Status badge مع الترجمة الديناميكية
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
            style={{ backgroundColor: "var(--color-success)" }}
          />
          {t("orders.status.delivered")}
        </Badge>
      );
    }

    if (currentStatus === "shipped" || currentStatus === "confirmed") {
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
            style={{ backgroundColor: "var(--color-info)" }}
          />
          {t(`orders.status.${currentStatus}`, { defaultValue: currentStatus })}
        </Badge>
      );
    }

    if (currentStatus === "processing" || currentStatus === "pending") {
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
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          {t(`orders.status.${currentStatus}`, { defaultValue: currentStatus })}
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
            style={{ backgroundColor: "var(--color-error)" }}
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
          style={{ backgroundColor: "var(--color-text-secondary)" }}
        />
        {statusValue
          ? t(`orders.status.${statusValue.toLowerCase()}`, {
              defaultValue: statusValue,
            })
          : t("orders.status.unknown")}
      </Badge>
    );
  };

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
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              {t("orders.subtitle")}
            </p>

            <h1 className="mt-1 font-display text-3xl font-bold text-[var(--color-text-primary)]">
              {t("orders.title")}
            </h1>
          </div>

          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] py-0 shadow-[var(--shadow-sm)]">
            <CardContent className="flex items-center gap-2.5 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                <Package className="h-4 w-4 text-[var(--color-primary)]" />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-display text-lg font-bold tabular-nums text-[var(--color-text-primary)]">
                  {/* {totalOrders} */}
                  {formatNumber(totalOrders, i18n.language || "en-US")}
                </span>

                <span className="text-[11px] text-[var(--color-text-secondary)]">
                  {t("orders.totalOrders")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />

            <Input
              type="search"
              value={search}
              onChange={handleSearch}
              placeholder={t("orders.searchPlaceholder")}
              className="border-[var(--color-border)] bg-[var(--color-surface)] pl-9 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
            />
          </div>

          {/* Status Filter */}
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] border-[var(--color-border)] bg-[var(--color-surface)]">
              <SelectValue
                placeholder={t("orders.filters.status.placeholder")}
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all-statuses">
                {t("orders.filters.status.all")}
              </SelectItem>
              <SelectItem value="delivered">
                {t("orders.filters.status.delivered")}
              </SelectItem>
              <SelectItem value="shipped">
                {t("orders.filters.status.shipped")}
              </SelectItem>
              <SelectItem value="confirmed">
                {t("orders.filters.status.confirmed")}
              </SelectItem>
              <SelectItem value="processing">
                {t("orders.filters.status.processing")}
              </SelectItem>
              <SelectItem value="cancelled">
                {t("orders.filters.status.cancelled")}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Filter */}
          <Select value={payment} onValueChange={handlePaymentChange}>
            <SelectTrigger className="w-[140px] border-[var(--color-border)] bg-[var(--color-surface)]">
              <SelectValue
                placeholder={t("orders.filters.payment.placeholder")}
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all-payments">
                {t("orders.filters.payment.all")}
              </SelectItem>
              <SelectItem value="pending">
                {t("orders.filters.payment.pending")}
              </SelectItem>
              <SelectItem value="paid">
                {t("orders.filters.payment.paid")}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Method Filter */}
          <Select value={method} onValueChange={handleMethodChange}>
            <SelectTrigger className="w-[140px] border-[var(--color-border)] bg-[var(--color-surface)]">
              <SelectValue
                placeholder={t("orders.filters.method.placeholder")}
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all-methods">
                {t("orders.filters.method.all")}
              </SelectItem>
              <SelectItem value="cash">
                {t("orders.filters.method.cash")}
              </SelectItem>
              <SelectItem value="card">
                {t("orders.filters.method.card")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <TooltipProvider>
          <Card className="overflow-hidden border-[var(--color-border)] bg-[var(--color-surface)] p-0 shadow-[var(--shadow-sm)]">
            {/* Loading */}
            {loading && (
              <div className="overflow-x-auto">
                <Table>
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

            {/* Empty */}
            {!loading && !error && orders.length === 0 && (
              <div className="py-12 text-center text-sm text-[var(--color-text-secondary)]">
                {t("orders.noOrdersFound")}
              </div>
            )}

            {/* Data */}
            {!loading && !error && orders.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[var(--color-surface-secondary)]">
                        <TableHead>{t("orders.columns.order")}</TableHead>

                        <TableHead>{t("orders.columns.customer")}</TableHead>

                        <TableHead
                          className="cursor-pointer select-none"
                          onClick={() => handleSort("date")}
                        >
                          {t("orders.columns.date")}
                          {getSortIcon("date")}
                        </TableHead>

                        <TableHead
                          className="cursor-pointer select-none"
                          onClick={() => handleSort("status")}
                        >
                          {t("orders.columns.status")}
                          {getSortIcon("status")}
                        </TableHead>

                        <TableHead>
                          {t("orders.columns.paymentStatus")}
                        </TableHead>

                        <TableHead>
                          {t("orders.columns.paymentMethod")}
                        </TableHead>

                        <TableHead
                          className="cursor-pointer select-none"
                          onClick={() => handleSort("total")}
                        >
                          {t("orders.columns.total")}
                          {getSortIcon("total")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {orders.map((order, index) => {
                        const name = order?.shippingAddress?.fullName || "—";
                        const orderId = order?._id || "";

                        let shortName = name;
                        if (name.length > 10) {
                          shortName = name.slice(0, 10) + "...";
                        }

                        return (
                          <TableRow
                            key={orderId || index}
                            onClick={() => handleRowClick(order)}
                            className="cursor-pointer transition-colors hover:bg-[var(--color-surface-secondary)]/50"
                          >
                            {/* Order ID */}
                            <TableCell className="font-mono text-sm font-medium">
                              #
                              {orderId
                                ? orderId.slice(0, 8)
                                : t("orders.notAvailable")}
                            </TableCell>

                            {/* Customer */}
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger>
                                  <span className="text-[var(--color-text-secondary)]">
                                    {shortName}
                                  </span>
                                </TooltipTrigger>

                                <TooltipContent>{name}</TooltipContent>
                              </Tooltip>
                            </TableCell>

                            {/* Date */}
                            <TableCell className="text-[var(--color-text-secondary)]">
                              {/* {order?.createdAt
                                ? new Intl.DateTimeFormat(
                                    i18n.language || "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  ).format(new Date(order.createdAt))
                                : "—"} */}
                              {formatDisplayDate(order?.createdAt) || "—"}
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              {renderStatusBadge(order?.status)}
                            </TableCell>

                            {/* Payment Status */}
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-transparent px-2 py-0.5 text-[10px] font-bold"
                                style={{
                                  backgroundColor: "var(--color-warning-bg)",
                                  color: "var(--color-warning)",
                                }}
                              >
                                {order?.paymentStatus || "—"}
                              </Badge>
                            </TableCell>

                            {/* Payment Method */}
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-transparent px-2 py-0.5 text-[10px] font-bold"
                                style={{
                                  backgroundColor:
                                    "var(--color-surface-secondary)",
                                  color: "var(--color-text-secondary)",
                                }}
                              >
                                {order?.paymentMethod || "—"}
                              </Badge>
                            </TableCell>

                            {/* Total */}
                            <TableCell className="font-display font-bold">
                              {/* {typeof order?.totalPrice === "number"
                                ? order.totalPrice.toLocaleString(
                                    i18n.language || "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    },
                                  )
                                : "0.00"}{" "}
                              {t("orders.currency")} */}
                              {formatCurrency(
                                order?.totalPrice,
                                "USD",
                                i18n.language || "en-US",
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
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

      {/* Order Details Sheet */}
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