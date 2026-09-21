import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Clock, Eye, RefreshCw, Search, ShoppingBag, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/utils/formatNumber";
import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import useOrders from "@/features/admin/orders/useOrders";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/features/admin/orders/constants";
import OrderStatusBadge from "@/features/admin/orders/components/OrderStatusBadge";
import PaymentStatusBadge from "@/features/admin/orders/components/PaymentStatusBadge";
import OrdersTableSkeleton from "@/features/admin/orders/components/OrdersTableSkeleton";
import OrderDetailsSheet from "@/features/admin/orders/components/OrderDetailsSheet";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import AdminErrorState from "@/features/admin/components/AdminErrorState";
import AdminTableFooter from "@/features/admin/components/AdminTableFooter";
import RowActionsMenu from "@/features/admin/components/RowActionsMenu";
import SortableTableHeader from "@/features/admin/components/SortableTableHeader";
import StatCard from "@/features/admin/dashboard/components/StatCard";

export default function Orders() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en-US";

  const {
    orders,
    totalOrders,
    totalPages,
    currentPage,
    isFetching,
    loadError,
    search,
    status,
    payment,
    sortKey,
    sortDirection,
    selectedOrder,
    isDetailsOpen,
    handleStatusChange,
    handlePaymentChange,
    handleSearchChange,
    handleSort,
    handlePageChange,
    handleOpenDetails,
    handleCloseDetails,
    updateOrder,
    retry,
  } = useOrders();

  const pendingCount = useMemo(
    () => orders.filter((o) => o?.status === "pending").length,
    [orders],
  );
  const activeCount = useMemo(
    () =>
      orders.filter((o) =>
        ["processing", "confirmed", "shipped"].includes(o?.status),
      ).length,
    [orders],
  );
  const deliveredCount = useMemo(
    () => orders.filter((o) => o?.status === "delivered").length,
    [orders],
  );

  const kpis = [
    {
      id: "total",
      title: t("orders.kpis.totalOrders", { defaultValue: "Total Orders" }),
      description: t("orders.kpis.totalOrdersDesc", { defaultValue: "All recorded purchases" }),
      value: formatNumber(totalOrders, locale),
      icon: ShoppingBag,
    },
    {
      id: "pending",
      title: t("orders.kpis.pendingOrders", { defaultValue: "Pending Orders" }),
      description: t("orders.kpis.pendingOrdersDesc", { defaultValue: "Awaiting fulfillment" }),
      value: formatNumber(pendingCount, locale),
      icon: Clock,
    },
    {
      id: "active",
      title: t("orders.kpis.activeOrders", { defaultValue: "Processing / Active" }),
      description: t("orders.kpis.activeOrdersDesc", { defaultValue: "In-transit & active processing" }),
      value: formatNumber(activeCount, locale),
      icon: Truck,
    },
    {
      id: "delivered",
      title: t("orders.kpis.deliveredOrders", { defaultValue: "Delivered" }),
      description: t("orders.kpis.deliveredOrdersDesc", { defaultValue: "Successfully completed" }),
      value: formatNumber(deliveredCount, locale),
      icon: CheckCircle2,
    },
  ];

  const columns = [
    {
      key: "order",
      label: t("orders.columns.order"),
      sortable: true,
      sortKey: "order",
    },
    {
      key: "customer",
      label: t("orders.columns.customer"),
      sortable: true,
      sortKey: "customer",
    },
    {
      key: "date",
      label: t("orders.columns.date"),
      sortable: true,
      sortKey: "date",
    },
    {
      key: "status",
      label: t("orders.columns.status"),
      sortable: true,
      sortKey: "status",
    },
    {
      key: "paymentMethod",
      label: t("orders.columns.paymentMethod"),
      sortable: true,
      sortKey: "paymentMethod",
    },
    {
      key: "paymentStatus",
      label: t("orders.columns.paymentStatus"),
      sortable: true,
      sortKey: "paymentStatus",
    },
    {
      key: "total",
      label: t("orders.columns.total"),
      sortable: true,
      sortKey: "total",
      align: "end",
    },
    { key: "actions", label: t("orders.columns.actions"), align: "end" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker={t("orders.subtitle", { defaultValue: "Fulfillment & Operations" })}
        title={t("orders.title")}
        description={t("orders.description", { defaultValue: "Track and manage customer purchases, payment statuses, and fulfillment workflows." })}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            title={kpi.title}
            description={kpi.description}
            value={kpi.value}
            icon={kpi.icon}
            className="gap-0 py-4"
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={t("orders.searchPlaceholder", {
              defaultValue: "Search by customer or order ID...",
            })}
            aria-label={t("orders.searchPlaceholder", {
              defaultValue: "Search by customer or order ID...",
            })}
            className="ps-9 bg-card text-foreground"
          />
          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleSearchChange("")}
              aria-label={t("orders.clearSearch", { defaultValue: "Clear search" })}
              className="absolute end-1.5 top-1/2 size-7 -translate-y-1/2"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        <div className="w-full sm:w-48">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("orders.filters.status.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("orders.filters.status.all")}
              </SelectItem>
              {ORDER_STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(`orders.filters.status.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-48">
          <Select value={payment} onValueChange={handlePaymentChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("orders.filters.payment.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("orders.filters.payment.all")}
              </SelectItem>
              {PAYMENT_STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(`orders.filters.payment.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="gap-0 overflow-hidden shadow-sm py-0">
        {loadError && !isFetching ? (
          <AdminErrorState
            title={t("orders.loadErrorTitle")}
            hint={t("orders.loadErrorHint")}
            onRetry={retry}
            retryLabel={t("orders.retry")}
          />
        ) : (
          <CardContent className="p-0">
            <Table edgePadding>
              <SortableTableHeader
                columns={columns}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              {isFetching ? (
                <OrdersTableSkeleton />
              ) : (
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        {t("orders.noOrdersFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order, index) => {
                      const name = order?.shippingAddress?.fullName || "";
                      const orderId = order?._id || "";

                      return (
                        <TableRow
                          key={orderId || index}
                          className="group cursor-pointer transition-colors hover:bg-muted/50"
                        >
                          <TableCell
                            className="cursor-pointer font-mono text-sm font-medium text-foreground"
                            onClick={() => handleOpenDetails(order)}
                          >
                            #{orderId ? orderId.slice(0, 8) : t("orders.notAvailable")}
                          </TableCell>

                          <TableCell
                            className="cursor-pointer"
                            onClick={() => handleOpenDetails(order)}
                          >
                            {name ? (
                              <span
                                className="block max-w-40 truncate text-muted-foreground"
                                title={name}
                              >
                                {name}
                              </span>
                            ) : (
                              t("orders.notAvailable")
                            )}
                          </TableCell>

                          <TableCell
                            className="cursor-pointer whitespace-nowrap tabular-nums text-muted-foreground"
                            onClick={() => handleOpenDetails(order)}
                          >
                            {formatDisplayDate(order?.createdAt, i18n.language) ||
                              t("orders.notAvailable")}
                          </TableCell>

                          <TableCell
                            className="cursor-pointer"
                            onClick={() => handleOpenDetails(order)}
                          >
                            <OrderStatusBadge status={order?.status} />
                          </TableCell>

                          <TableCell
                            className="cursor-pointer text-muted-foreground"
                            onClick={() => handleOpenDetails(order)}
                          >
                            {order?.paymentMethod
                              ? t(
                                  `orders.paymentMethods.${order.paymentMethod.toLowerCase()}`,
                                  { defaultValue: order.paymentMethod },
                                )
                              : t("orders.notAvailable")}
                          </TableCell>

                          <TableCell
                            className="cursor-pointer"
                            onClick={() => handleOpenDetails(order)}
                          >
                            <PaymentStatusBadge status={order?.paymentStatus} />
                          </TableCell>

                          <TableCell
                            className="cursor-pointer text-end font-bold tabular-nums text-foreground"
                            onClick={() => handleOpenDetails(order)}
                          >
                            {formatCurrency(order?.totalPrice, ORDER_CURRENCY, locale)}
                          </TableCell>

                          <TableCell className="whitespace-nowrap text-end">
                            <RowActionsMenu
                              disabled={isFetching}
                              ariaLabel={t("orders.columns.actions")}
                              onTriggerClick={(event) => event.stopPropagation()}
                              onCloseAutoFocus={(event) => event.preventDefault()}
                              items={[
                                {
                                  icon: <Eye className="size-4" aria-hidden="true" />,
                                  label: t("orders.viewOrder", { defaultValue: "View details" }),
                                  onClick: () => handleOpenDetails(order),
                                },
                                {
                                  icon: <RefreshCw className="size-4" aria-hidden="true" />,
                                  label: t("orders.changeStatus", { defaultValue: "Change status" }),
                                  onClick: () => handleOpenDetails(order),
                                },
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              )}
            </Table>

            {!isFetching && orders.length > 0 && (
              <AdminTableFooter
                currentPage={currentPage}
                totalPages={totalPages}
                loading={isFetching}
                onPageChange={handlePageChange}
                labelPrefix="orders.pagination"
              />
            )}
          </CardContent>
        )}
      </Card>

      <OrderDetailsSheet
        selectedOrder={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onSaved={updateOrder}
      />
    </div>
  );
}