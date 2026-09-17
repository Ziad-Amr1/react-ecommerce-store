import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const PAYMENT_STYLES = {
  paid: {
    className: "border-transparent bg-(--color-success-bg) text-(--color-success)",
    dot: "bg-(--color-success)",
    labelKey: "orders.paymentStatus.paid",
  },
  pending: {
    className: "border-transparent bg-(--color-warning-bg) text-(--color-warning)",
    dot: "bg-(--color-warning)",
    labelKey: "orders.paymentStatus.pending",
  },
  failed: {
    className: "border-transparent bg-(--color-error-bg) text-(--color-error)",
    dot: "bg-(--color-error)",
    labelKey: "orders.paymentStatus.failed",
  },
  refunded: {
    className: "border-transparent bg-(--color-info-bg) text-(--color-info)",
    dot: "bg-(--color-info)",
    labelKey: "orders.paymentStatus.refunded",
  },
};

export default function PaymentStatusBadge({ status }) {
  const { t } = useTranslation();
  const currentStatus = String(status ?? "").toLowerCase();
  const style = PAYMENT_STYLES[currentStatus];

  if (!style) {
    return (
      <Badge
        variant="outline"
        className="border-transparent bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
      >
        <span className="ms-1.5 size-1.5 rounded-full bg-muted-foreground" />
        {status
          ? t(`orders.paymentStatus.${currentStatus}`, { defaultValue: status })
          : t("orders.paymentStatus.unknown")}
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