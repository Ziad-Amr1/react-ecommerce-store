export const ORDERS_LIMIT = 15;
export { ORDER_CURRENCY } from "@/utils/formatCurrency";
export const ORDER_STATUSES = [
  "pending",
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];
export const PAYMENT_STATUSES = ["paid", "pending", "failed", "refunded"];

export const ORDER_STATUS_PRESENTATION = {
  pending: {
    labelKey: "orders.status.pending",
    badgeClass:
      "border-transparent bg-(--color-warning-bg) text-(--color-warning)",
    dot: "bg-(--color-warning)",
    fill: "var(--color-warning)",
    barClass: "[&_[data-slot=progress-indicator]]:bg-(--color-warning)",
  },
  processing: {
    labelKey: "orders.status.processing",
    badgeClass: "border-transparent bg-(--color-info-bg) text-(--color-info)",
    dot: "bg-(--color-info)",
    fill: "var(--color-info)",
    barClass: "[&_[data-slot=progress-indicator]]:bg-(--color-info)",
  },
  confirmed: {
    labelKey: "orders.status.confirmed",
    badgeClass:
      "border-transparent bg-(--color-surface-secondary) text-(--color-text-secondary)",
    dot: "bg-(--color-text-secondary)",
    fill: "var(--color-text-secondary)",
    barClass:
      "[&_[data-slot=progress-indicator]]:bg-(--color-text-secondary)",
  },
  shipped: {
    labelKey: "orders.status.shipped",
    badgeClass:
      "border-transparent bg-(--color-primary) text-(--color-on-primary)",
    dot: "bg-(--color-primary)",
    fill: "var(--color-primary)",
    barClass: "[&_[data-slot=progress-indicator]]:bg-(--color-primary)",
  },
  delivered: {
    labelKey: "orders.status.delivered",
    badgeClass:
      "border-transparent bg-(--color-success-bg) text-(--color-success)",
    dot: "bg-(--color-success)",
    fill: "var(--color-success)",
    barClass: "[&_[data-slot=progress-indicator]]:bg-(--color-success)",
  },
  cancelled: {
    labelKey: "orders.status.cancelled",
    badgeClass: "border-transparent bg-(--color-error-bg) text-(--color-error)",
    dot: "bg-(--color-error)",
    fill: "var(--color-error)",
    barClass: "[&_[data-slot=progress-indicator]]:bg-(--color-error)",
  },
  returned: {
    labelKey: "orders.status.returned",
    badgeClass:
      "border-transparent bg-(--color-surface-secondary) text-(--color-text-disabled)",
    dot: "bg-(--color-text-disabled)",
    fill: "var(--color-text-disabled)",
    barClass:
      "[&_[data-slot=progress-indicator]]:bg-(--color-text-disabled)",
  },
};

export const ORDER_STATUS_BADGE_FALLBACK =
  "border-transparent bg-muted text-muted-foreground";
export const ORDER_STATUS_DOT_FALLBACK = "bg-muted-foreground";
export const ORDER_STATUS_FILL_FALLBACK = "var(--color-text-secondary)";
export const ORDER_STATUS_BAR_FALLBACK =
  "[&_[data-slot=progress-indicator]]:bg-(--color-text-secondary)";
export const SORT_COLUMNS = {
  order: "_id",
  customer: "shippingAddress.fullName",
  date: "createdAt",
  status: "status",
  paymentMethod: "paymentMethod",
  paymentStatus: "paymentStatus",
  total: "totalPrice",
};