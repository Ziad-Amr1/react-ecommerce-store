

import { useState } from "react";
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

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "—";

const money = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// small row used inside the info cards below
function Row({ label, value, last }) {
  return (
    <div
      className={`flex justify-between text-xs ${
        last ? "" : "border-b border-[var(--color-border)] pb-2"
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
      className="space-y-3 rounded-lg border p-4"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
        {title}
      </p>
      {children}
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: "delivered", label: "Delivered" },
  { value: "shipped", label: "Shipped" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "cancelled", label: "Cancelled" },
];

// the actual editable form - keyed by order id from the parent so it
// resets itself whenever a different order is selected
function OrderForm({ order, setOrders }) {
  const [status, setStatus] = useState(order.status || "processing");
  const [note, setNote] = useState(order.adminNote || "");
  const [isSaving, setIsSaving] = useState(false);
  const address = order.shippingAddress || {};

  const handleSave = async () => {
    if (!status) {
      toast.error("Please select an order status.");
      return;
    }

    setIsSaving(true);
    try {
      await updateOrderStatus(order._id, { status, adminNote: note });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status, adminNote: note } : o,
        ),
      );
      toast.success("Order status updated successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update order status.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium capitalize text-[var(--color-text-secondary)]">
          {order.paymentMethod || "—"}
        </span>
        <Badge
          variant="outline"
          className="border-transparent px-2 py-1 text-xs font-semibold"
          style={{
            backgroundColor: "var(--color-warning-bg)",
            color: "var(--color-warning)",
          }}
        >
          {order.paymentStatus || "Pending"}
        </Badge>
      </div>

      <InfoCard title="Customer Information">
        <Row label="Customer" value={address.fullName} />
        <Row label="Phone" value={address.phone} />
        <Row label="Country" value={address.country} />
        <Row label="City" value={address.city} />
        <Row label="Address" value={address.address} />
        <Row label="Postal Code" value={address.postalCode} last />
      </InfoCard>

      <InfoCard title="Order Information">
        <Row label="Placed" value={formatDate(order.createdAt)} />
        <Row label="Transaction ID" value={order.transactionId} />
        <Row label="Paid At" value={formatDate(order.paidAt)} last />
      </InfoCard>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
          Items
        </p>

        <div className="space-y-2">
          {order.items?.length ? (
            order.items.map((item, i) => {
              const price = Number(item?.price) || 0;
              const qty = Number(item?.quantity) || 0;

              return (
                <div
                  key={item?.product || i}
                  className="flex items-center justify-between rounded-lg border p-3"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item?.image || "/placeholder.png"}
                      alt={item?.name || "Product"}
                      className="size-12 rounded-md border border-[var(--color-border)] object-cover"
                    />
                    <div>
                      <p className="line-clamp-1 text-xs font-semibold text-[var(--color-text-primary)]">
                        {item?.name || "Product"}
                      </p>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">
                        × {qty} • {price.toFixed(2)} EGP
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">
                    {money(price * qty)} EGP
                  </span>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-[var(--color-border)] p-4 text-center text-xs text-[var(--color-text-secondary)]">
              No items found.
            </div>
          )}
        </div>

        <div
          className="space-y-2 rounded-lg border p-4 text-xs"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <Row label="Subtotal" value={`${money(order.subtotal)} EGP`} last />
          <Row
            label="Shipping"
            value={`${money(order.shippingFee)} EGP`}
            last
          />
          <Row label="Tax" value={`${money(order.tax)} EGP`} last />
          <Row label="Discount" value={`${money(order.discount)} EGP`} />
          <div className="flex justify-between pt-1 text-sm font-bold">
            <span className="text-[var(--color-text-primary)]">Total</span>
            <span className="text-[var(--color-text-primary)]">
              {money(order.totalPrice)} EGP
            </span>
          </div>
        </div>
      </div>

      {order.customerNote && (
        <InfoCard title="Customer Note">
          <p className="text-xs leading-5 text-[var(--color-text-primary)]">
            {order.customerNote}
          </p>
        </InfoCard>
      )}

      <InfoCard title="Update Status">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full border-[var(--color-border)] bg-[var(--color-background)] text-xs">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add an admin note..."
          className="min-h-[80px] resize-none border-[var(--color-border)] bg-[var(--color-background)] text-xs"
        />

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full text-xs font-semibold"
          style={{ backgroundColor: "var(--color-primary)", color: "white" }}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
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
  if (!selectedOrder) return null;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent
        side="right"
        className="inset-x-0 bottom-0 top-auto flex h-[85vh] w-full flex-col gap-0 rounded-t-2xl border-t border-[var(--color-border)] bg-[var(--color-background)] p-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-w-md sm:rounded-none sm:border-t-0 sm:border-l"
      >
        {/* fixed header - stays put while the body below scrolls */}
        <SheetHeader className="shrink-0 space-y-2 border-b border-[var(--color-border)] p-6 pb-4 text-left">
          <p className="text-xs font-medium text-[var(--color-text-secondary)]">
            Order Details
          </p>
          <SheetTitle className="font-mono text-lg font-bold text-[var(--color-text-primary)]">
            #{selectedOrder._id ? selectedOrder._id.slice(0, 8) : "N/A"}
          </SheetTitle>
          <div className="flex items-center gap-2">
            {renderStatusBadge(selectedOrder.status)}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {/* key resets the form's internal state whenever a new order is picked */}
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