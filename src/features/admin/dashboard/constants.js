export const STATUS_BADGE_CLASS_FALLBACK =
  "border-(--color-text-secondary)/30 bg-(--color-text-secondary)/15 text-(--color-text-secondary)";

export const STATUS_FILL_FALLBACK = "var(--color-text-secondary)";

export const STATUS_PRESENTATION = {
  pending: {
    labelKey: "dashboard.statusLabels.pending",
    fill: "var(--color-warning)",
    badgeClass:
      "border-(--color-warning)/30 bg-(--color-warning)/15 text-(--color-warning)",
  },
  processing: {
    labelKey: "dashboard.statusLabels.processing",
    fill: "var(--color-info)",
    badgeClass:
      "border-(--color-info)/30 bg-(--color-info)/15 text-(--color-info)",
  },
  confirmed: {
    labelKey: "dashboard.statusLabels.confirmed",
    fill: "var(--color-primary)",
    badgeClass:
      "border-(--color-primary)/30 bg-(--color-primary)/15 text-(--color-primary)",
  },
  shipped: {
    labelKey: "dashboard.statusLabels.shipped",
    fill: "var(--color-supporting)",
    badgeClass:
      "border-(--color-supporting)/30 bg-(--color-supporting)/15 text-(--color-supporting)",
  },
  delivered: {
    labelKey: "dashboard.statusLabels.delivered",
    fill: "var(--color-success)",
    badgeClass:
      "border-(--color-success)/30 bg-(--color-success)/15 text-(--color-success)",
  },
  cancelled: {
    labelKey: "dashboard.statusLabels.cancelled",
    fill: "var(--color-error)",
    badgeClass:
      "border-(--color-error)/30 bg-(--color-error)/15 text-(--color-error)",
  },
  returned: {
    labelKey: "dashboard.statusLabels.returned",
    fill: STATUS_FILL_FALLBACK,
    badgeClass: STATUS_BADGE_CLASS_FALLBACK,
  },
};