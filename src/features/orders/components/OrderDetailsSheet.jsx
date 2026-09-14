
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
  { value: "delivered", label: "Delivered" },
  { value: "shipped", label: "Shipped" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "cancelled", label: "Cancelled" },
];

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
    <div className="space-y-5">
      {/* Payment Method & Status Badge Header */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        <span className="text-xs font-semibold capitalize text-[var(--color-text-secondary)]">
          {order.paymentMethod || "—"}
        </span>
        <Badge
          variant="outline"
          className="border-transparent px-2.5 py-1 text-xs font-semibold rounded-full"
          style={{
            backgroundColor: "var(--color-warning-bg)",
            color: "var(--color-warning)",
          }}
        >
          {order.paymentStatus || "Pending"}
        </Badge>
      </div>

      <InfoCard title="Customer Information">
        <div className="space-y-2">
          <Row label="Customer" value={address.fullName} />
          <Row label="Phone" value={address.phone} />
          <Row label="Country" value={address.country} />
          <Row label="City" value={address.city} />
          <Row label="Address" value={address.address} />
          <Row label="Postal Code" value={address.postalCode} last />
        </div>
      </InfoCard>

      <InfoCard title="Order Information">
        <div className="space-y-2">
          <Row label="Placed" value={formatDate(order.createdAt)} />
          <Row label="Transaction ID" value={order.transactionId} />
          <Row label="Paid At" value={formatDate(order.paidAt)} last />
        </div>
      </InfoCard>

      <div className="space-y-3">
        <p className="px-0.5 text-xs font-semibold text-[var(--color-text-secondary)]">
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
                  className="flex items-center justify-between rounded-xl border p-3 shadow-sm"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item?.image || "/placeholder.png"}
                      alt={item?.name || "Product"}
                      className="size-12 rounded-lg border border-[var(--color-border)] object-cover"
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
            <div className="rounded-xl border border-[var(--color-border)] p-4 text-center text-xs text-[var(--color-text-secondary)]">
              No items found.
            </div>
          )}
        </div>

        <div
          className="space-y-2 rounded-xl border p-4 text-xs shadow-sm"
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
          <div className="flex justify-between pt-2 text-sm font-bold border-t border-[var(--color-border)] mt-2">
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
        <div className="space-y-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full border-[var(--color-border)] bg-[var(--color-background)] text-xs h-9">
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
            className="w-full text-xs font-semibold h-9"
            style={{ backgroundColor: "var(--color-primary)", color: "white" }}
          >
            {isSaving ? "Saving..." : "Save changes"}
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
  if (!selectedOrder) return null;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent
        side="right"
        className="inset-x-0 bottom-0 top-auto flex h-[85vh] w-full flex-col gap-0 rounded-t-2xl border-t border-[var(--color-border)] bg-[var(--color-background)] p-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-w-md sm:rounded-none sm:border-t-0 sm:border-l [&>button]:top-8 [&>button]:right-6"
      >
        {/* Mobile Drag Handle */}
        <div className="pt-3 pb-1 sm:hidden">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[var(--color-border)]" />
        </div>

        {/* Header */}
        <SheetHeader className="shrink-0 space-y-1 border-b border-[var(--color-border)] px-6 pt-5 pb-4 text-left">
          <p className="text-xs font-medium text-[var(--color-text-secondary)]">
            Order Details
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

        {/* Main Content Area */}
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








