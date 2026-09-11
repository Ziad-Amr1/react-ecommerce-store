

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

import api from "@/api/axios";

const OrderDetailsSheet = ({
  selectedOrder,
  isDrawerOpen,
  setIsDrawerOpen,
  setOrders,
  renderStatusBadge,
}) => {
  const [prevOrderId, setPrevOrderId] = useState(selectedOrder?._id);
  const [updatedStatus, setUpdatedStatus] = useState(
    selectedOrder?.status || "processing",
  );
  const [note, setNote] = useState(selectedOrder?.adminNote || "");
  const [isSaving, setIsSaving] = useState(false);

  if (selectedOrder && selectedOrder._id !== prevOrderId) {
    setPrevOrderId(selectedOrder._id);
    setUpdatedStatus(selectedOrder.status || "processing");
    setNote(selectedOrder.adminNote || "");
  }

  // Save order changes
  const handleSaveChanges = async () => {
    if (!selectedOrder) return;

    if (!updatedStatus) {
      toast.error("Please select an order status.");
      return;
    }

    setIsSaving(true);

    try {
      await api.patch(`/orders/admin/${selectedOrder._id}/status`, {
        status: updatedStatus,
        adminNote: note,
      });

      // Update order in table
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                status: updatedStatus,
                adminNote: note,
              }
            : order,
        ),
      );

      toast.success("Order status updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-background)] p-6 sm:max-w-md"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Header */}
            <SheetHeader className="border-b border-[var(--color-border)] pb-4">
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                Order Details
              </p>

              <SheetTitle className="font-mono text-lg font-bold text-[var(--color-text-primary)]">
                #{selectedOrder._id ? selectedOrder._id.slice(0, 8) : "N/A"}
              </SheetTitle>
            </SheetHeader>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {renderStatusBadge(selectedOrder.status)}

                <Badge
                  variant="outline"
                  className="border-transparent px-2 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--color-warning-bg)",
                    color: "var(--color-warning)",
                  }}
                >
                  {selectedOrder.paymentStatus || "Pending"}
                </Badge>
              </div>

              <span className="text-xs font-medium capitalize text-[var(--color-text-secondary)]">
                {selectedOrder.paymentMethod || "—"}
              </span>
            </div>

            {/* Customer Information */}
            <div
              className="space-y-3 rounded-lg border p-4"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Customer Information
              </p>

              <div className="flex justify-between border-b border-[var(--color-border)] pb-2 text-xs">
                <span className="text-[var(--color-text-secondary)]">
                  Customer
                </span>

                <span className="font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.shippingAddress?.fullName || "—"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[var(--color-border)] pb-2 text-xs">
                <span className="text-[var(--color-text-secondary)]">
                  Phone
                </span>

                <span className="font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.shippingAddress?.phone || "—"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[var(--color-border)] pb-2 text-xs">
                <span className="text-[var(--color-text-secondary)]">
                  Country
                </span>

                <span className="font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.shippingAddress?.country || "—"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[var(--color-border)] pb-2 text-xs">
                <span className="text-[var(--color-text-secondary)]">City</span>

                <span className="font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.shippingAddress?.city || "—"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[var(--color-border)] pb-2 text-xs">
                <span className="text-[var(--color-text-secondary)]">
                  Address
                </span>

                <span className="max-w-[220px] text-right font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.shippingAddress?.address || "—"}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-text-secondary)]">
                  Postal Code
                </span>

                <span className="font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.shippingAddress?.postalCode || "—"}
                </span>
              </div>
            </div>

            {/* Order Information */}
            <div
              className="space-y-3 rounded-lg border p-4"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Order Information
              </p>

              <div className="flex justify-between border-b border-[var(--color-border)] pb-2 text-xs">
                <span className="text-[var(--color-text-secondary)]">
                  Placed
                </span>

                <span className="font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.createdAt
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(selectedOrder.createdAt))
                    : "—"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[var(--color-border)] pb-2 text-xs">
                <span className="text-[var(--color-text-secondary)]">
                  Transaction ID
                </span>

                <span className="max-w-[180px] truncate font-mono font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.transactionId || "—"}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-text-secondary)]">
                  Paid At
                </span>

                <span className="font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.paidAt
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(selectedOrder.paidAt))
                    : "—"}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Items
              </p>

              <div className="space-y-2">
                {selectedOrder.items?.length > 0 ? (
                  selectedOrder.items.map((item, index) => {
                    const price = Number(item?.price) || 0;
                    const quantity = Number(item?.quantity) || 0;

                    return (
                      <div
                        key={item?.product || index}
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
                              × {quantity} • {price.toFixed(2)} EGP
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[var(--color-text-primary)]">
                          {(price * quantity).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          EGP
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

              {/* Order Summary */}
              <div
                className="space-y-2 rounded-lg border p-4 text-xs"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">
                    Subtotal
                  </span>

                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {Number(selectedOrder.subtotal || 0).toFixed(2)} EGP
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">
                    Shipping
                  </span>

                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {Number(selectedOrder.shippingFee || 0).toFixed(2)} EGP
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">
                    Tax
                  </span>

                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {Number(selectedOrder.tax || 0).toFixed(2)} EGP
                  </span>
                </div>

                <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-text-secondary)]">
                    Discount
                  </span>

                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {Number(selectedOrder.discount || 0).toFixed(2)} EGP
                  </span>
                </div>

                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span className="text-[var(--color-text-primary)]">
                    Total
                  </span>

                  <span className="text-[var(--color-text-primary)]">
                    {Number(selectedOrder.totalPrice || 0).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}{" "}
                    EGP
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Note */}
            {selectedOrder.customerNote && (
              <div
                className="space-y-2 rounded-lg border p-4"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Customer Note
                </p>

                <p className="text-xs leading-5 text-[var(--color-text-primary)]">
                  {selectedOrder.customerNote}
                </p>
              </div>
            )}

            {/* Update Status */}
            <div
              className="space-y-3 rounded-lg border p-4"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Update Status
              </p>

              <Select value={updatedStatus} onValueChange={setUpdatedStatus}>
                <SelectTrigger className="w-full border-[var(--color-border)] bg-[var(--color-background)] text-xs">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add an admin note..."
                className="min-h-[80px] resize-none border-[var(--color-border)] bg-[var(--color-background)] text-xs"
              />

              <Button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="w-full text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                }}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;