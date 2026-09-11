import { useTranslation } from "react-i18next";
import useDashboard from "@/features/admin/dashboard/useDashboard";

import {
  Card,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import StatCard from "@/features/admin/dashboard/components/StatCard";
import OrderStatus from "@/features/admin/dashboard/components/OrderStatus";
import TopProducts from "@/features/admin/dashboard/components/TopProducts";
import RecentOrders from "@/features/admin/dashboard/components/RecentOrders";
import DashboardSkeleton from "@/features/admin/dashboard/components/DashboardSkeleton";
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

  if (loading && !dashboard) return <DashboardSkeleton />;

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

          <h1 className="font-display text-2xl font-semibold leading-none">
            {t("dashboard.commerceHealth")}
          </h1>

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
