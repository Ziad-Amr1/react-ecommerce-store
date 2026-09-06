import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDashboard from "@/features/admin/dashboard/useDashboard";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/features/admin/dashboard/components/StatCard";
import OrderStatus from "@/features/admin/dashboard/components/OrderStatus";
import TopProducts from "@/features/admin/dashboard/components/TopProducts";
import RecentOrders from "@/features/admin/dashboard/components/RecentOrders";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";

import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  TriangleAlert,
  Inbox,
} from "lucide-react";

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

export default function Dashboard() {
  const { t, i18n } = useTranslation();

  const { dashboard, loading, error, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="w-full space-y-6" role="status" aria-busy="true">
        <span className="sr-only">{t("dashboard.loading")}</span>

        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-64 max-w-full" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden border-t-4 border-t-(--color-accent)"
            >
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>

              <CardContent className="flex items-end justify-between gap-3">
                <Skeleton className="h-8 w-14" />
                <Skeleton className="size-11 shrink-0 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>

            <CardContent>
              <Skeleton className="h-48 rounded-full" />
            </CardContent>
          </Card>

          <Card className="lg:col-span-7">
            <CardHeader>
              <Skeleton className="h-5 w-36" />
            </CardHeader>

            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Skeleton className="size-12 shrink-0 rounded-lg" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>

                  <Skeleton className="h-4 w-14" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex w-full flex-wrap items-center justify-between gap-4 rounded-lg border border-(--color-error) bg-(--color-error-bg) p-4"
      >
        <div className="flex items-start gap-3">
          <TriangleAlert
            className="mt-0.5 size-5 shrink-0 text-(--color-error)"
            aria-hidden="true"
          />

          <p className="text-sm font-medium leading-5 text-(--color-error)">
            {error}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 cursor-pointer"
          onClick={fetchDashboard}
        >
          {t("dashboard.retry")}
        </Button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) px-6 py-16 text-center shadow-sm">
        <Inbox
          className="size-10 text-(--color-text-disabled)"
          aria-hidden="true"
        />

        <p className="text-sm text-(--color-text-secondary)">
          {t("dashboard.noData")}
        </p>
      </div>
    );
  }

  const growthValue = dashboard.revenue.growthPercent;
  const growthLabel = formatGrowthPercent(growthValue, i18n.language) ?? "—";
  const growthIsNumber =
    typeof growthValue === "number" && Number.isFinite(growthValue);
  const growthPositive = growthIsNumber && growthValue > 0;
  const growthNegative = growthIsNumber && growthValue < 0;

  const cardList = [
    {
      id: 1,
      cardTitle: t("dashboard.totalOrders"),
      cardDescription: t("dashboard.totalOrdersDescription"),
      cardNumber: formatNumber(dashboard.orders.total, i18n.language),
      cardIcon: ShoppingBag,
      borderClass: "border-t-(--color-primary)",
      iconClass: "bg-(--color-primary) text-(--color-on-primary)",
    },
    {
      id: 2,
      cardTitle: t("dashboard.pendingOrders"),
      cardDescription: t("dashboard.pendingOrderDescription"),
      cardNumber: formatNumber(dashboard.orders.pending, i18n.language),
      cardIcon: Package,
      borderClass: "border-t-(--color-warning)",
      iconClass: "bg-(--color-warning-bg) text-(--color-warning)",
    },
    {
      id: 3,
      cardTitle: t("dashboard.totalRevenue"),
      cardDescription: t("dashboard.totalRevenueDescription"),
      cardNumber: formatCurrency(
        dashboard.revenue.total,
        CURRENCY,
        i18n.language,
      ),
      cardIcon: DollarSign,
      borderClass: "border-t-(--color-success)",
      iconClass: "bg-(--color-success-bg) text-(--color-success)",
    },
    {
      id: 4,
      cardTitle: t("dashboard.thisMonthRevenue"),
      cardDescription: t("dashboard.thisMonthRevenueDescription"),
      cardNumber: formatCurrency(
        dashboard.revenue.thisMonth,
        CURRENCY,
        i18n.language,
      ),
      cardIcon: CalendarDays,
      borderClass: "border-t-(--color-text-secondary)",
      iconClass: "bg-(--color-surface-secondary) text-(--color-text-secondary)",
    },
    {
      id: 5,
      cardTitle: t("dashboard.totalUsers"),
      cardDescription: t("dashboard.totalUsersDescription"),
      cardNumber: formatNumber(dashboard.totalCustomers, i18n.language),
      cardIcon: Users,
      borderClass: "border-t-(--color-info)",
      iconClass: "bg-(--color-info-bg) text-(--color-info)",
    },
    {
      id: 6,
      cardTitle: t("dashboard.revenueGrowth"),
      cardDescription: t("dashboard.revenueGrowthDescription"),
      cardNumber: growthLabel,
      cardIcon: growthNegative ? TrendingDown : TrendingUp,
      borderClass: growthPositive
        ? "border-t-(--color-success)"
        : growthNegative
          ? "border-t-(--color-error)"
          : "border-t-(--color-text-secondary)",
      iconClass: growthPositive
        ? "bg-(--color-success-bg) text-(--color-success)"
        : growthNegative
          ? "bg-(--color-error-bg) text-(--color-error)"
          : "bg-(--color-surface-secondary) text-(--color-text-secondary)",
    },
  ];

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-text-secondary)">
            {t("dashboard.adminOverview")}
          </span>

          <CardTitle className="font-display text-2xl">
            {t("dashboard.commerceHealth")}
          </CardTitle>

          <CardDescription className="max-w-3xl">
            {t("dashboard.commerceHealthDescription")}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cardList.map((card) => (
          <StatCard
            key={card.id}
            title={card.cardTitle}
            description={card.cardDescription}
            value={card.cardNumber}
            icon={card.cardIcon}
            borderClass={card.borderClass}
            iconClass={card.iconClass}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <OrderStatus
            ordersByStatus={dashboard.ordersByStatus}
            totalOrders={dashboard.orders.total}
          />
        </div>

        <div className="lg:col-span-7">
          <TopProducts products={dashboard.topProducts} />
        </div>
      </div>

      <RecentOrders orders={dashboard.recentOrders} />
    </div>
  );
}