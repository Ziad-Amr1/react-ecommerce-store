import { useTranslation } from "react-i18next";
import { lazy, Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  STATUS_PRESENTATION,
  STATUS_FILL_FALLBACK,
} from "@/features/admin/dashboard/constants";
import { formatNumber } from "@/utils/formatNumber";

const OrderStatusDonut = lazy(() => import("./OrderStatusDonut"));

export default function OrderStatus({ ordersByStatus = [] }) {
  const { t, i18n } = useTranslation();

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

  const total = ordersByStatus.reduce((sum, item) => sum + item.count, 0);

  const items = ordersByStatus
    .map((item) => {
      const presentation = STATUS_PRESENTATION[item._id];

      return {
        id: item._id,
        label: presentation ? t(presentation.labelKey) : item._id,
        count: item.count,
        percent: total > 0 ? (item.count / total) * 100 : 0,
        fill: presentation?.fill || STATUS_FILL_FALLBACK,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("dashboard.orderStatus")}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="relative h-52">
          <Suspense fallback={<Skeleton className="size-full rounded-full" />}>
            <OrderStatusDonut items={items} />
          </Suspense>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="font-display text-2xl font-bold tabular-nums">
              {formatNumber(total, i18n.language)}
            </span>

            <span className="text-xs text-(--color-text-secondary)">
              {t("dashboard.totalOrders")}
            </span>
          </div>
        </div>

        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill }}
                  aria-hidden="true"
                />

                <span className="truncate text-sm">{item.label}</span>
              </span>

              <span className="flex shrink-0 items-baseline gap-2">
                <span className="text-sm font-semibold tabular-nums">
                  {formatNumber(item.count, i18n.language)}
                </span>

                <span className="text-xs tabular-nums text-(--color-text-secondary)">
                  {formatNumber(Math.round(item.percent), i18n.language)}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}