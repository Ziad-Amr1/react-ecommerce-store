import { useTranslation } from "react-i18next";
import { lazy, Suspense, useRef, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  STATUS_PRESENTATION,
  STATUS_FILL_FALLBACK,
  STATUS_BAR_CLASS_FALLBACK,
} from "@/features/admin/dashboard/constants";
import { formatNumber } from "@/utils/formatNumber";

const OrderStatusDonut = lazy(() => import("./OrderStatusDonut"));

export default function OrderStatus({ ordersByStatus = [], totalOrders = 0 }) {
  const { t, i18n } = useTranslation();
  const chartRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  const handleSliceEnter = (index, event) => {
    setActiveIndex(index);

    const rect = chartRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleSliceLeave = () => {
    setActiveIndex(null);
    setTooltipPos(null);
  };

  // Fall back to the sum of counts so bars/percent stay proportional
  // even if the total prop is missing or zero.
  const total =
    totalOrders > 0
      ? totalOrders
      : ordersByStatus.reduce((sum, item) => sum + item.count, 0);

  const percentFormatter = new Intl.NumberFormat(i18n.language, {
    style: "percent",
    maximumFractionDigits: 0,
  });

  const items = ordersByStatus
    .map((item) => {
      // hasOwn avoids prototype-chain hits ("__proto__", "constructor")
      const presentation = Object.hasOwn(STATUS_PRESENTATION, item._id)
        ? STATUS_PRESENTATION[item._id]
        : undefined;

      const percent = total > 0 ? Math.min(100, (item.count / total) * 100) : 0;

      return {
        id: item._id,
        label: presentation ? t(presentation.labelKey) : item._id,
        count: item.count,
        percent,
        percentLabel: percentFormatter.format(percent / 100),
        fill: presentation?.fill ?? STATUS_FILL_FALLBACK,
        barClass: presentation?.barClass ?? STATUS_BAR_CLASS_FALLBACK,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("dashboard.orderStatus")}</CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-(--color-text-secondary)">
            {t("dashboard.noStatusData")}
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            <div ref={chartRef} className="relative h-52">
              {/* The list below is the accessible representation of this
                  chart, so the chart itself is decorative.
                  NB: size-full is required — Suspense renders no DOM node,
                  and ResponsiveContainer needs a sized parent. */}
              <div aria-hidden="true" className="size-full">
                <Suspense
                  fallback={<Skeleton className="size-full rounded-full" />}
                >
                  <OrderStatusDonut
                    items={items}
                    activeIndex={activeIndex}
                    onSliceEnter={handleSliceEnter}
                    onSliceLeave={handleSliceLeave}
                  />
                </Suspense>
              </div>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="font-display text-2xl font-bold tabular-nums">
                  {formatNumber(total, i18n.language)}
                </span>

                <span className="text-xs text-(--color-text-secondary)">
                  {t("dashboard.totalOrders")}
                </span>
              </div>

              {activeIndex !== null && tooltipPos !== null && (
                <div
                  className="pointer-events-none absolute z-30 rounded-lg border border-(--color-border) bg-(--color-surface-secondary) px-3 py-2 text-xs shadow-(--shadow-md)"
                  style={{
                    left: tooltipPos.x,
                    top: tooltipPos.y,
                    transform: "translate(-50%, -120%)",
                  }}
                >
                  <p className="font-semibold text-(--color-text-primary)">
                    {items[activeIndex].label}
                  </p>

                  <p className="mt-0.5 text-(--color-text-secondary)">
                    {formatNumber(items[activeIndex].count, i18n.language)} ·{" "}
                    {formatNumber(
                      Math.round(items[activeIndex].percent),
                      i18n.language,
                    )}
                    %
                  </p>
                </div>
              )}
            </div>

            <ul className="space-y-4">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className={`space-y-1.5 transition-opacity ${
                    activeIndex === null || index === activeIndex
                      ? "opacity-100"
                      : "opacity-45"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.fill }}
                        aria-hidden="true"
                      />

                      <span className="truncate text-sm">{item.label}</span>
                    </span>

                    <span className="flex shrink-0 items-baseline gap-2">
                      <span className="text-sm font-semibold tabular-nums font-display">
                        {formatNumber(item.count, i18n.language)}
                      </span>

                      <span className="text-xs tabular-nums text-(--color-text-secondary) font-display">
                        {item.percentLabel}
                      </span>
                    </span>
                  </div>

                  {/* TODO: move this rule into the Progress component so
                      RTL support isn't every caller's job. Verify it matches
                      how your Progress positions its indicator. */}
                  <div className="rtl:-scale-x-100">
                    <Progress
                      value={item.percent}
                      className={item.barClass}
                      aria-hidden="true"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
