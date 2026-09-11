import { useTranslation } from "react-i18next";
import useDashboard from "@/features/admin/dashboard/useDashboard";

import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/features/admin/dashboard/components/StatCard";
import RevenueOverview from "@/features/admin/dashboard/components/RevenueOverview";
import OrderStatus from "@/features/admin/dashboard/components/OrderStatus";
import TopProducts from "@/features/admin/dashboard/components/TopProducts";
import RecentOrders from "@/features/admin/dashboard/components/RecentOrders";
import DashboardSkeleton from "@/features/admin/dashboard/components/DashboardSkeleton";
import { formatNumber } from "@/utils/formatNumber";

import { ShoppingBag, Package, Users, TriangleAlert, Inbox } from "lucide-react";

function resolveErrorMessage(error, t) {
  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  if (error && typeof error.key === "string") {
    return t(error.key);
  }

  return t("dashboard.loadError");
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { dashboard, loading, error, fetchDashboard } = useDashboard();

  if (loading && !dashboard) return <DashboardSkeleton />;

  if (error) {
    const message = resolveErrorMessage(error, t);

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
            {message}
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

  const kpis = [
    {
      id: "orders",
      title: t("dashboard.totalOrders"),
      description: t("dashboard.totalOrdersDescription"),
      value: formatNumber(dashboard.orders.total, i18n.language),
      icon: ShoppingBag,
    },
    {
      id: "pending",
      title: t("dashboard.pendingOrders"),
      description: t("dashboard.pendingOrderDescription"),
      value: formatNumber(dashboard.orders.pending, i18n.language),
      icon: Package,
    },
    {
      id: "users",
      title: t("dashboard.totalUsers"),
      description: t("dashboard.totalUsersDescription"),
      value: formatNumber(dashboard.totalCustomers, i18n.language),
      icon: Users,
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RevenueOverview
            revenue={dashboard.revenue}
            dailyRevenue={dashboard.dailyRevenue}
          />
        </div>

        <section
          className="lg:col-span-4"
          aria-labelledby="operational-heading"
        >
          <h2 id="operational-heading" className="sr-only">
            {t("dashboard.adminOverview")}
          </h2>

          <ul className="flex flex-col gap-4 lg:h-full lg:justify-between">
            {kpis.map((kpi) => (
              <li key={kpi.id}>
                <StatCard
                  title={kpi.title}
                  description={kpi.description}
                  value={kpi.value}
                  icon={kpi.icon}
                />
              </li>
            ))}
          </ul>
        </section>
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