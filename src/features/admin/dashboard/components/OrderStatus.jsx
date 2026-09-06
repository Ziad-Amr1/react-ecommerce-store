import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  STATUS_PRESENTATION,
  STATUS_PILL_FALLBACK,
} from "@/features/admin/dashboard/constants";

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
          const presentation = STATUS_PRESENTATION[status];

          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    presentation?.pill || STATUS_PILL_FALLBACK
                  }`}
                >
                  {presentation ? t(presentation.labelKey) : status}
                </span>

                <span className="text-sm font-semibold tabular-nums">
                  {item.count}
                </span>
              </div>

              <div className="rtl:-scale-x-100">
                <Progress value={percentage} />
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