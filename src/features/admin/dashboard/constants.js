export const STATUS_PRESENTATION = {
  pending: {
    labelKey: "dashboard.statusLabels.pending",
    pill: "bg-(--color-warning-bg) text-(--color-warning)",
    badgeVariant: "secondary",
  },
  processing: {
    labelKey: "dashboard.statusLabels.processing",
    pill: "bg-(--color-info-bg) text-(--color-info)",
    badgeVariant: "secondary",
  },
  confirmed: {
    labelKey: "dashboard.statusLabels.confirmed",
    pill: "bg-(--color-accent) text-(--color-on-accent)",
    badgeVariant: "default",
  },
  shipped: {
    labelKey: "dashboard.statusLabels.shipped",
    pill: "bg-(--color-info-bg) text-(--color-info)",
    badgeVariant: "secondary",
  },
  delivered: {
    labelKey: "dashboard.statusLabels.delivered",
    pill: "bg-(--color-success-bg) text-(--color-success)",
    badgeVariant: "default",
  },
  cancelled: {
    labelKey: "dashboard.statusLabels.cancelled",
    pill: "bg-(--color-error-bg) text-(--color-error)",
    badgeVariant: "destructive",
  },
  returned: {
    labelKey: "dashboard.statusLabels.returned",
    pill: "bg-(--color-surface-secondary) text-(--color-text-secondary)",
    badgeVariant: "secondary",
  },
};

export const STATUS_PILL_FALLBACK =
  "bg-(--color-surface-secondary) text-(--color-text-secondary)";

export const STATUS_BADGE_FALLBACK = "secondary";