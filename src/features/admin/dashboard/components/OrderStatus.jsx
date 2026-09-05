import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_KEYS = {
  pending: "dashboard.statusLabels.pending",
  processing: "dashboard.statusLabels.processing",
  confirmed: "dashboard.statusLabels.confirmed",
  shipped: "dashboard.statusLabels.shipped",
  delivered: "dashboard.statusLabels.delivered",
  cancelled: "dashboard.statusLabels.cancelled",
  returned: "dashboard.statusLabels.returned",
};

const statusStyles = {
  pending: "bg-(--color-warning-bg) text-(--color-warning)",
  processing: "bg-(--color-info-bg) text-(--color-info)",
  confirmed: "bg-(--color-accent) text-(--color-on-accent)",
  shipped: "bg-(--color-info-bg) text-(--color-info)",
  delivered: "bg-(--color-success-bg) text-(--color-success)",
  cancelled: "bg-(--color-error-bg) text-(--color-error)",
  returned: "bg-(--color-surface-secondary) text-(--color-text-secondary)",
};

const FALLBACK_STATUS_STYLE =
  "bg-(--color-surface-secondary) text-(--color-text-secondary)";

export default function OrderStatus({ ordersByStatus = [], totalOrders = 0 }) {
  const { t } = useTranslation();

  if (ordersByStatus.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t("dashboard.orderStatus")}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-(--color-text-secondary)">
            {t("dashboard.noStatusData")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("dashboard.orderStatus")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {ordersByStatus.map((item) => {
          const percentage =
            totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;

          const status = item._id;

          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[status] || FALLBACK_STATUS_STYLE
                  }`}
                >
                  {STATUS_KEYS[status] ? t(STATUS_KEYS[status]) : status}
                </span>

                <span className="text-sm font-semibold tabular-nums">
                  {item.count}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {t("dashboard.ofOrders", { count: Math.round(percentage) })}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}