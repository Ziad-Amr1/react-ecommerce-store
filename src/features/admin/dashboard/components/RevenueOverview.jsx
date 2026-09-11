import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

const RevenueTrend = lazy(() => import("./RevenueTrend"));

const CURRENCY = "USD";

function formatGrowthPercent(value, locale) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(Math.abs(value));

  if (value > 0) return `+${formatted}%`;
  if (value < 0) return `-${formatted}%`;
  return "0%";
}

export default function RevenueOverview({ revenue, dailyRevenue }) {
  const { t, i18n } = useTranslation();

  const growthValue = revenue?.growthPercent;
  const growthIsNumber =
    typeof growthValue === "number" && Number.isFinite(growthValue);
  const growthPositive = growthIsNumber && growthValue > 0;
  const growthNegative = growthIsNumber && growthValue < 0;

  const GrowthIcon = growthNegative
    ? TrendingDown
    : growthPositive
      ? TrendingUp
      : Minus;

  const growthClass = growthPositive
    ? "text-(--color-success)"
    : growthNegative
      ? "text-(--color-error)"
      : "text-(--color-text-primary)";

  return (
    <Card>
      <CardHeader className="gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-text-secondary)">
          {t("dashboard.totalRevenue")}
        </span>

        <p className="font-display text-3xl font-bold leading-tight tabular-nums wrap-break-word lg:text-5xl">
          {formatCurrency(revenue?.total, CURRENCY, i18n.language)}
        </p>

        <CardDescription className="max-w-2xl">
          {t("dashboard.totalRevenueDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-(--color-text-secondary)">
              {t("dashboard.thisMonthRevenue")}
            </dt>

            <dd className="mt-1 font-display text-2xl font-bold tabular-nums">
              {formatCurrency(revenue?.thisMonth, CURRENCY, i18n.language)}
            </dd>

            <p className="mt-0.5 text-xs leading-5 text-(--color-text-secondary)">
              {t("dashboard.thisMonthRevenueDescription")}
            </p>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-(--color-text-secondary)">
              {t("dashboard.revenueGrowth")}
            </dt>

            <dd
              className={`mt-1 flex items-center gap-1.5 font-display text-2xl font-bold tabular-nums ${growthClass}`}
            >
              <GrowthIcon className="size-5" aria-hidden="true" />
              {formatGrowthPercent(growthValue, i18n.language) ?? "—"}
            </dd>

            <p className="mt-0.5 text-xs leading-5 text-(--color-text-secondary)">
              {t("dashboard.revenueGrowthDescription")}
            </p>
          </div>
        </dl>

        <div className="border-t border-(--color-border)" aria-hidden="true" />

        <Suspense
          fallback={<Skeleton className="h-56 w-full sm:h-64" />}
        >
          <RevenueTrend dailyRevenue={dailyRevenue} />
        </Suspense>
      </CardContent>
    </Card>
  );
}