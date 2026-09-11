import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import { formatNumber } from "@/utils/formatNumber";

const CURRENCY = "USD";

function toChartData(dailyRevenue) {
  if (!Array.isArray(dailyRevenue)) {
    return [];
  }

  const rows = [];

  dailyRevenue.forEach((item, index) => {
    const revenue = Number(item?.revenue);
    if (!Number.isFinite(revenue) || revenue < 0) {
      return;
    }

    const orders = item?.orders == null ? null : Number(item.orders);
    if (orders != null && !Number.isFinite(orders)) {
      return;
    }

    const dateKey = item?._id;
    const date = dateKey == null ? null : new Date(dateKey);
    const valid = date != null && !Number.isNaN(date.getTime());

    rows.push({
      key: valid ? String(dateKey) : `item-${index}`,
      time: valid ? date.getTime() : null,
      label: valid ? dateKey : String(dateKey ?? index),
      labelFull: null,
      revenue,
      orders,
    });
  });

  if (rows.every((row) => row.time != null)) {
    rows.sort((a, b) => a.time - b.time);
  }

  return rows;
}

function RevenueTrendTooltip({ active, payload }) {
  const { t, i18n } = useTranslation();

  if (!active || !Array.isArray(payload) || payload.length === 0) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="pointer-events-none rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-xs shadow-(--shadow-md)">
      <p className="text-(--color-text-secondary)">{point.labelFull}</p>

      <p className="mt-1 text-sm font-semibold tabular-nums text-(--color-text-primary)">
        {formatCurrency(point.revenue, CURRENCY, i18n.language)}
      </p>

      {point.orders != null && (
        <p className="mt-0.5 tabular-nums text-(--color-text-secondary)">
          {formatNumber(point.orders, i18n.language)} ·{" "}
          {t("dashboard.totalOrders")}
        </p>
      )}
    </div>
  );
}

export default function RevenueTrend({ dailyRevenue }) {
  const { t, i18n } = useTranslation();

  const raw = toChartData(dailyRevenue);

  const chartData = raw.map((row) => {
    const fullLabel =
      row.time != null
        ? (formatDisplayDate(new Date(row.time)) ?? row.label)
        : row.label;

    let shortLabel = row.label;
    if (row.time != null) {
      const formatter = new Intl.DateTimeFormat(i18n.language, {
        month: "short",
        day: "numeric",
      });
      shortLabel = formatter.format(new Date(row.time));
    }

    return { ...row, label: shortLabel, labelFull: fullLabel };
  });

  if (chartData.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-(--color-text-secondary)">
        {t("dashboard.noData")}
      </p>
    );
  }

  const compactCurrency = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: CURRENCY,
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return (
    <div className="space-y-3">
      <div dir="ltr" className="h-56 w-full sm:h-64" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--color-border)"
              strokeOpacity={0.6}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
              minTickGap={24}
              dy={6}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
              tickFormatter={(value) => compactCurrency.format(value)}
              width={48}
            />

            <Tooltip
              content={<RevenueTrendTooltip />}
              cursor={{
                stroke: "var(--color-border-strong)",
                strokeWidth: 1,
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              name={t("dashboard.totalRevenue")}
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="var(--color-primary)"
              fillOpacity={0.08}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="sr-only">
        <p>{t("dashboard.totalRevenueDescription")}</p>

        <ul>
          {chartData.map((point) => (
            <li key={point.key}>
              {point.labelFull}:{" "}
              {formatCurrency(point.revenue, CURRENCY, i18n.language)}
              {point.orders != null
                ? ` (${formatNumber(point.orders, i18n.language)} ${t(
                    "dashboard.totalOrders",
                  )})`
                : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}