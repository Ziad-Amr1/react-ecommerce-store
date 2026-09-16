import { useTranslation } from "react-i18next";
import { Eye, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import OrdersTableSkeleton from "@/features/admin/orders/components/OrdersTableSkeleton";
import OrderDetailsSheet from "@/features/admin/orders/components/OrderDetailsSheet";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import AdminErrorState from "@/features/admin/components/AdminErrorState";
import AdminTableFooter from "@/features/admin/components/AdminTableFooter";
import RowActionsMenu from "@/features/admin/components/RowActionsMenu";
import SortableTableHeader from "@/features/admin/components/SortableTableHeader";

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

  const columns = [
    { key: "order", label: t("orders.columns.order") },
    { key: "customer", label: t("orders.columns.customer") },
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
    { key: "paymentStatus", label: t("orders.columns.paymentStatus") },
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
        kicker={t("orders.subtitle")}
        title={t("orders.title")}
        statistics={[
          {
            id: "total-orders",
            label: t("orders.totalOrders"),
            value: formatNumber(totalOrders, locale),
          },
        ]}
      />

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
        {loadError && !isFetching ? (
          <AdminErrorState
            title={t("orders.loadErrorTitle")}
            hint={t("orders.loadErrorHint")}
            onRetry={retry}
            retryLabel={t("orders.retry")}
          />
        ) : (
          <CardContent className="p-0">
            <Table>
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
                        colSpan={7}
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
                          className="cursor-pointer transition-colors hover:bg-muted/50"
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
                            className="cursor-pointer whitespace-nowrap text-muted-foreground"
                            onClick={() => handleOpenDetails(order)}
                          >
                            {formatDisplayDate(order?.createdAt) ||
                              t("orders.notAvailable")}
                          </TableCell>

                          <TableCell
                            className="cursor-pointer"
                            onClick={() => handleOpenDetails(order)}
                          >
                            <OrderStatusBadge status={order?.status} />
                          </TableCell>

                          <TableCell
                            className="cursor-pointer"
                            onClick={() => handleOpenDetails(order)}
                          >
                            <Badge
                              variant="outline"
                              className="border-transparent bg-warning-bg px-2 py-0.5 text-[10px] font-bold text-warning"
                            >
                              {order?.paymentStatus
                                ? t(
                                    `orders.paymentStatus.${order.paymentStatus.toLowerCase()}`,
                                    { defaultValue: order.paymentStatus },
                                  )
                                : t("orders.notAvailable")}
                            </Badge>
                          </TableCell>

                          <TableCell
                            className="cursor-pointer font-display font-bold tabular-nums text-foreground"
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