import { useTranslation } from "react-i18next";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Package,
  TriangleAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/utils/formatNumber";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import useOrders from "@/features/admin/orders/useOrders";
import {
  ORDER_CURRENCY,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/features/admin/orders/constants";
import OrderStatusBadge from "@/features/admin/orders/components/OrderStatusBadge";
import OrdersPagination from "@/features/admin/orders/components/OrdersPagination";
import OrdersTableSkeleton from "@/features/admin/orders/components/OrdersTableSkeleton";
import OrderDetailsSheet from "@/features/admin/orders/components/OrderDetailsSheet";

export default function Orders() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en-US";

  const {
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
  } = useOrders();

  const getSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="ms-1 inline size-3.5 opacity-40" aria-hidden="true" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ms-1 inline size-3.5" aria-hidden="true" />
    ) : (
      <ArrowDown className="ms-1 inline size-3.5" aria-hidden="true" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("orders.subtitle")}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            {t("orders.title")}
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardContent className="flex items-center gap-2.5 px-4 py-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Package className="size-4 text-primary" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-bold tabular-nums text-foreground">
                {formatNumber(totalOrders, locale)}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {t("orders.totalOrders")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
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

        <div className="relative min-w-64 flex-1">
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

      <Card className="overflow-hidden shadow-sm">
        {loadError && !isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-error-bg">
              <TriangleAlert className="size-7 text-error" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              {t("orders.loadErrorTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("orders.loadErrorHint")}</p>
            <Button className="mt-2" onClick={retry}>
              {t("orders.retry")}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
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
                  <TableHead>{t("orders.columns.paymentStatus")}</TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("total")}
                  >
                    {t("orders.columns.total")}
                    {getSortIcon("total")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              {isLoading ? (
                <OrdersTableSkeleton />
              ) : (
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
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
                          onClick={() => handleOpenDetails(order)}
                          className="cursor-pointer transition-colors hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-sm font-medium text-foreground">
                            #{orderId ? orderId.slice(0, 8) : t("orders.notAvailable")}
                          </TableCell>

                          <TableCell>
                            {name ? (
                              <span className="block max-w-40 truncate text-muted-foreground" title={name}>
                                {name}
                              </span>
                            ) : (
                              t("orders.notAvailable")
                            )}
                          </TableCell>

                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatDisplayDate(order?.createdAt) || t("orders.notAvailable")}
                          </TableCell>

                          <TableCell>
                            <OrderStatusBadge status={order?.status} />
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-transparent bg-warning-bg px-2 py-0.5 text-[10px] font-bold text-warning"
                            >
                              {order?.paymentStatus
                                ? t(`orders.paymentStatus.${order.paymentStatus.toLowerCase()}`, {
                                    defaultValue: order.paymentStatus,
                                  })
                                : t("orders.notAvailable")}
                            </Badge>
                          </TableCell>

                          <TableCell className="font-display font-bold tabular-nums text-foreground">
                            {formatCurrency(order?.totalPrice, ORDER_CURRENCY, locale)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              )}
            </Table>

            {!isLoading && orders.length > 0 && (
              <OrdersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={handlePageChange}
              />
            )}
          </div>
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