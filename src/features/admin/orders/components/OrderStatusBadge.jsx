import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { ORDER_STATUS_PRESENTATION } from "../constants";

export default function OrderStatusBadge({ status }) {
  const { t } = useTranslation();
  const currentStatus = String(status ?? "").toLowerCase();
  const style = ORDER_STATUS_PRESENTATION[currentStatus];

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
      className={`border-transparent px-2.5 py-1 text-xs font-semibold ${style.badgeClass}`}
    >
      <span className={`ms-1.5 size-1.5 rounded-full ${style.dot}`} />
      {t(style.labelKey)}
    </Badge>
  );
}