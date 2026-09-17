

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { updateOrderStatus } from "@/features/admin/orders/orders.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";

const ORDER_CURRENCY = "USD";

function Row({ label, value, last }) {
  return (
    <div
      className={`flex justify-between text-xs ${
        last ? "" : "border-b border-[var(--color-border)] pb-2.5 pt-0.5"
      }`}
    >
      <span className="text-[var(--color-text-secondary)]">{label}</span>

      <span className="max-w-[220px] text-right font-medium text-[var(--color-text-primary)]">
        {value || "—"}
      </span>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div
      className="space-y-3 rounded-xl border p-4 shadow-sm"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      {title && (
        <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {title}
        </p>
      )}

      {children}
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: "delivered", label: "orders.status.delivered" },
  { value: "shipped", label: "orders.status.shipped" },
  { value: "confirmed", label: "orders.status.confirmed" },
  { value: "processing", label: "orders.status.processing" },
  { value: "cancelled", label: "orders.status.cancelled" },
];

function OrderForm({ order, setOrders }) {
  const { t } = useTranslation();

  const [status, setStatus] = useState(order.status || "processing");
  const [note, setNote] = useState(order.adminNote || "");
  const [isSaving, setIsSaving] = useState(false);

  const address = order.shippingAddress || {};

  const handleSave = async () => {
    if (!status) {
      toast.error(t("orders.sheet.selectStatusError"));
      return;
    }

    setIsSaving(true);

    try {
      await updateOrderStatus(order._id, {
        status,
        adminNote: note,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status, adminNote: note } : o,
        ),
      );

      toast.success(t("orders.sheet.saveSuccess"));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || t("orders.sheet.saveError"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Payment Method & Status */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        <span className="text-xs font-semibold capitalize text-[var(--color-text-secondary)]">
          {order.paymentMethod
            ? t(`orders.filters.method.${order.paymentMethod.toLowerCase()}`, {
                defaultValue: order.paymentMethod,
              })
            : "—"}
        </span>

        <Badge
          variant="outline"
          className="rounded-full border-transparent px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: "var(--color-warning-bg)",
            color: "var(--color-warning)",
          }}
        >
          {t(`orders.paymentStatus.${order.paymentStatus || "pending"}`, {
            defaultValue: order.paymentStatus || "pending",
          })}
        </Badge>
      </div>

      {/* Customer Information */}
      <InfoCard title={t("orders.sheet.customerInformation")}>
        <div className="space-y-2">
          <Row label={t("orders.sheet.customer")} value={address.fullName} />
          <Row label={t("orders.sheet.phone")} value={address.phone} />
          <Row label={t("orders.sheet.country")} value={address.country} />
          <Row label={t("orders.sheet.city")} value={address.city} />
          <Row label={t("orders.sheet.address")} value={address.address} />
          <Row
            label={t("orders.sheet.postalCode")}
            value={address.postalCode}
            last
          />
        </div>
      </InfoCard>

      {/* Order Information */}
      <InfoCard title={t("orders.sheet.orderInformation")}>
        <div className="space-y-2">
          <Row
            label={t("orders.sheet.placed")}
            value={formatDisplayDate(order.createdAt)}
          />
          <Row
            label={t("orders.sheet.transactionId")}
            value={order.transactionId}
          />
          <Row
            label={t("orders.sheet.paidAt")}
            value={formatDisplayDate(order.paidAt)}
            last
          />
        </div>
      </InfoCard>

      {/* Items */}
      <div className="space-y-3">
        <p className="px-0.5 text-xs font-semibold text-[var(--color-text-secondary)]">
          {t("orders.sheet.items")}
        </p>

        <div className="space-y-2">
          {order.items?.length ? (
            order.items.map((item, i) => {
              const price = Number(item?.price) || 0;
              const qty = Number(item?.quantity) || 0;

              return (
                <div
                  key={item?.product || i}
                  className="flex items-center justify-between rounded-xl border p-3 shadow-sm"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item?.image || "/placeholder.png"}
                      alt={item?.name || t("orders.sheet.product")}
                      className="size-12 rounded-lg border border-[var(--color-border)] object-cover"
                    />

                    <div>
                      <p className="line-clamp-1 text-xs font-semibold text-[var(--color-text-primary)]">
                        {item?.name || t("orders.sheet.product")}
                      </p>

                      <p className="text-[11px] text-[var(--color-text-secondary)]">
                        × {qty} • {formatCurrency(price, ORDER_CURRENCY)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(price * qty, ORDER_CURRENCY)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-[var(--color-border)] p-4 text-center text-xs text-[var(--color-text-secondary)]">
              {t("orders.sheet.noItems")}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div
          className="space-y-2 rounded-xl border p-4 text-xs shadow-sm"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <Row
            label={t("orders.sheet.subtotal")}
            value={formatCurrency(order.subtotal, ORDER_CURRENCY)}
            last
          />
          <Row
            label={t("orders.sheet.shipping")}
            value={formatCurrency(order.shippingFee, ORDER_CURRENCY)}
            last
          />
          <Row
            label={t("orders.sheet.tax")}
            value={formatCurrency(order.tax, ORDER_CURRENCY)}
            last
          />
          <Row
            label={t("orders.sheet.discount")}
            value={formatCurrency(order.discount, ORDER_CURRENCY)}
          />

          <div className="mt-2 flex justify-between border-t border-[var(--color-border)] pt-2 text-sm font-bold">
            <span className="text-[var(--color-text-primary)]">
              {t("orders.sheet.total")}
            </span>
            <span className="text-[var(--color-text-primary)]">
              {formatCurrency(order.totalPrice, ORDER_CURRENCY)}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Note */}
      {order.customerNote && (
        <InfoCard title={t("orders.sheet.customerNote")}>
          <p className="text-xs leading-5 text-[var(--color-text-primary)]">
            {order.customerNote}
          </p>
        </InfoCard>
      )}

      {/* Update Status */}
      <InfoCard title={t("orders.sheet.updateStatus")}>
        <div className="space-y-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-full border-[var(--color-border)] bg-[var(--color-background)] text-xs">
              <SelectValue placeholder={t("orders.sheet.selectStatus")} />
            </SelectTrigger>

            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("orders.sheet.adminNotePlaceholder")}
            className="min-h-[80px] resize-none border-[var(--color-border)] bg-[var(--color-background)] text-xs"
          />

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-9 w-full text-xs font-semibold"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
            }}
          >
            {isSaving ? t("orders.sheet.saving") : t("orders.sheet.save")}
          </Button>
        </div>
      </InfoCard>
    </div>
  );
}

const OrderDetailsSheet = ({
  selectedOrder,
  isDrawerOpen,
  setIsDrawerOpen,
  setOrders,
  renderStatusBadge,
}) => {
  const { t } = useTranslation();

  if (!selectedOrder) return null;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent
        side="right"
        className="inset-x-0 bottom-0 top-auto flex h-[85vh] w-full flex-col gap-0 rounded-t-2xl border-t border-[var(--color-border)] bg-[var(--color-background)] p-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-w-md sm:rounded-none sm:border-t-0 sm:border-l [&>button]:top-8 [&>button]:right-6"
      >
        <div className="pb-1 pt-3 sm:hidden">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[var(--color-border)]" />
        </div>

        <SheetHeader className="shrink-0 space-y-1 border-b border-[var(--color-border)] px-6 pb-4 pt-5 text-left">
          <p className="text-xs font-medium text-[var(--color-text-secondary)]">
            {t("orders.sheet.title")}
          </p>

          <SheetTitle className="font-mono text-lg font-bold text-[var(--color-text-primary)]">
            #{selectedOrder._id ? selectedOrder._id.slice(0, 8) : "N/A"}
          </SheetTitle>

          {renderStatusBadge && (
            <div className="flex items-center gap-2 pt-1">
              {renderStatusBadge(selectedOrder.status)}
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <OrderForm
            key={selectedOrder._id}
            order={selectedOrder}
            setOrders={setOrders}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;