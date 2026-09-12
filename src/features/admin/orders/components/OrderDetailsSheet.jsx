import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import { ORDER_CURRENCY, ORDER_STATUSES } from "../constants";
import { updateOrderStatus } from "../orders.service";
import OrderStatusBadge from "./OrderStatusBadge";

function Money({ value, locale }) {
  const amount =
    typeof value === "number" ? value : Number(value || 0);
  return formatCurrency(amount, ORDER_CURRENCY, locale);
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border pb-2 text-xs last:border-b-0 last:pb-0">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-end font-medium text-foreground">{value}</span>
    </div>
  );
}

function OrderDetailsContent({ order, onClose, onSaved }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en-US";

  const [updatedStatus, setUpdatedStatus] = useState(order.status || "processing");
  const [note, setNote] = useState(order.adminNote || "");
  const [isSaving, setIsSaving] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSaveChanges = async () => {
    if (!updatedStatus) {
      toast.error(t("orders.sheet.selectStatusError"));
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsSaving(true);

    try {
      await updateOrderStatus(
        order._id,
        { status: updatedStatus, adminNote: note },
        controller.signal,
      );

      onSaved(order._id, { status: updatedStatus, adminNote: note });
      toast.success(t("orders.sheet.saveSuccess"));
      onClose();
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }
      toast.error(t("orders.sheet.saveError"));
    } finally {
      if (!controller.signal.aborted) {
        setIsSaving(false);
      }
    }
  };

  const address = order.shippingAddress || {};
  const items = order.items || [];

  return (
    <div className="space-y-6">
      <SheetHeader className="border-b border-border pb-4">
        <p className="text-xs font-medium text-muted-foreground">
          {t("orders.sheet.title")}
        </p>
        <SheetTitle className="font-mono text-lg font-bold">
          #{order._id ? order._id.slice(0, 8) : t("orders.notAvailable")}
        </SheetTitle>
      </SheetHeader>

      <div className="flex flex-wrap items-center gap-2">
        <OrderStatusBadge status={order.status} />
        <Badge
          variant="outline"
          className="border-transparent bg-warning-bg px-2 py-1 text-xs font-semibold text-warning"
        >
          {order.paymentStatus
            ? t(`orders.paymentStatus.${order.paymentStatus.toLowerCase()}`, {
                defaultValue: order.paymentStatus,
              })
            : t("orders.notAvailable")}
        </Badge>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground">
          {t("orders.sheet.customerInformation")}
        </p>
        <DetailRow label={t("orders.sheet.customer")} value={address.fullName || t("orders.notAvailable")} />
        <DetailRow label={t("orders.sheet.phone")} value={address.phone || t("orders.notAvailable")} />
        <DetailRow label={t("orders.sheet.country")} value={address.country || t("orders.notAvailable")} />
        <DetailRow label={t("orders.sheet.city")} value={address.city || t("orders.notAvailable")} />
        <DetailRow label={t("orders.sheet.address")} value={address.address || t("orders.notAvailable")} />
        <DetailRow label={t("orders.sheet.postalCode")} value={address.postalCode || t("orders.notAvailable")} />
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground">
          {t("orders.sheet.orderInformation")}
        </p>
        <DetailRow
          label={t("orders.sheet.placed")}
          value={formatDisplayDate(order.createdAt) || t("orders.notAvailable")}
        />
        <DetailRow
          label={t("orders.sheet.transactionId")}
          value={order.transactionId || t("orders.notAvailable")}
        />
        <DetailRow
          label={t("orders.sheet.paidAt")}
          value={formatDisplayDate(order.paidAt) || t("orders.notAvailable")}
        />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground">
          {t("orders.sheet.items")}
        </p>

        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, index) => {
              const price = Number(item?.price) || 0;
              const quantity = Number(item?.quantity) || 0;

              return (
                <div
                  key={item?.product || index}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item?.name || t("orders.sheet.product")}
                        className="size-12 shrink-0 rounded-md border border-border object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                        <Package className="size-5" aria-hidden="true" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {item?.name || t("orders.sheet.product")}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {"\u00D7"} {quantity} {"\u2022"}{" "}
                        <Money value={price} locale={locale} />
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-bold tabular-nums text-foreground">
                    <Money value={price * quantity} locale={locale} />
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-border p-4 text-center text-xs text-muted-foreground">
            {t("orders.sheet.noItems")}
          </div>
        )}

        <div className="space-y-2 rounded-lg border border-border bg-card p-4">
          {[
            { label: t("orders.sheet.subtotal"), value: order.subtotal },
            { label: t("orders.sheet.shipping"), value: order.shippingFee },
            { label: t("orders.sheet.tax"), value: order.tax },
            { label: t("orders.sheet.discount"), value: order.discount },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="tabular-nums font-semibold text-foreground">
                <Money value={row.value} locale={locale} />
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
            <span className="text-foreground">{t("orders.sheet.total")}</span>
            <span className="tabular-nums text-foreground">
              <Money value={order.totalPrice} locale={locale} />
            </span>
          </div>
        </div>
      </div>

      {order.customerNote && (
        <div className="space-y-2 rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("orders.sheet.customerNote")}
          </p>
          <p className="text-xs leading-5 text-foreground">{order.customerNote}</p>
        </div>
      )}

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground">
          {t("orders.sheet.updateStatus")}
        </p>

        <Select value={updatedStatus} onValueChange={setUpdatedStatus}>
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder={t("orders.sheet.selectStatus")} />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`orders.status.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={t("orders.sheet.adminNotePlaceholder")}
          className="min-h-20 resize-none text-xs"
        />

        <Button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="w-full text-xs font-semibold"
        >
          {isSaving ? t("orders.sheet.saving") : t("orders.sheet.save")}
        </Button>
      </div>
    </div>
  );
}

export default function OrderDetailsSheet({
  selectedOrder,
  isOpen,
  onClose,
  onSaved,
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {selectedOrder && (
          <OrderDetailsContent
            key={selectedOrder._id}
            order={selectedOrder}
            onClose={onClose}
            onSaved={onSaved}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}