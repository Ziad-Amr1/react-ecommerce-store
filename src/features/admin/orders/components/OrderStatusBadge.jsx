import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const STATUS_STYLES = {
  delivered: {
    className: "border-transparent bg-success-bg text-success",
    dot: "bg-success",
    labelKey: "orders.status.delivered",
  },
  shipped: {
    className: "border-transparent bg-info-bg text-info",
    dot: "bg-info",
    labelKey: "orders.status.shipped",
  },
  confirmed: {
    className: "border-transparent bg-info-bg text-info",
    dot: "bg-info",
    labelKey: "orders.status.confirmed",
  },
  processing: {
    className: "border-transparent bg-accent text-primary",
    dot: "bg-primary",
    labelKey: "orders.status.processing",
  },
  pending: {
    className: "border-transparent bg-accent text-primary",
    dot: "bg-primary",
    labelKey: "orders.status.pending",
  },
  cancelled: {
    className: "border-transparent bg-error-bg text-error",
    dot: "bg-error",
    labelKey: "orders.status.cancelled",
  },
};

export default function OrderStatusBadge({ status }) {
  const { t } = useTranslation();
  const currentStatus = String(status ?? "").toLowerCase();
  const style = STATUS_STYLES[currentStatus];

  if (!style) {
    return (
      <Badge
        variant="outline"
        className="border-transparent bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
      >
        <span className="ms-1.5 size-1.5 rounded-full bg-muted-foreground" />
        {status
          ? t(`orders.status.${currentStatus}`, { defaultValue: status })
          : t("orders.status.unknown")}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`border-transparent px-2.5 py-1 text-xs font-semibold ${style.className}`}
    >
      <span className={`ms-1.5 size-1.5 rounded-full ${style.dot}`} />
      {t(style.labelKey)}
    </Badge>
  );
}