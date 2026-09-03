import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDashboard from "@/features/admin/dashboard/useDashboard";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  Clock,
  CircleCheck,
  TriangleAlert,
  Inbox,
} from "lucide-react";

const CURRENCY = "USD";

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden border-t-4 border-t-(--color-accent)"
            >
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>

              <CardContent className="flex items-end justify-between gap-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="size-14 shrink-0 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex w-full items-start gap-3 rounded-lg border border-(--color-error) bg-(--color-error-bg) p-4"
      >
        <TriangleAlert
          className="mt-0.5 size-5 shrink-0 text-(--color-error)"
          aria-hidden="true"
        />

        <p className="text-sm font-medium leading-5 text-(--color-error)">
          {error}
        </p>
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

  const numberFormatter = new Intl.NumberFormat(i18n.language);

  const currencyFormatter = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: CURRENCY,
  });

  // Passes pre-formatted or non-numeric values through untouched
  // instead of rendering "NaN".
  const formatNumber = (value) =>
    typeof value === "number" && Number.isFinite(value)
      ? numberFormatter.format(value)
      : value;

  const formatCurrency = (value) =>
    typeof value === "number" && Number.isFinite(value)
      ? currencyFormatter.format(value)
      : value;

  const cardList = [
    {
      id: 1,
      cardTitle: t("dashboard.totalOrders"),
      cardDescription: t("dashboard.totalOrdersDescription"),
      cardNumber: formatNumber(dashboard.orders.total),
      cardIcon: ShoppingBag,
      borderClass: "border-t-primary",
      iconClass: "bg-primary text-primary-foreground",
    },
    {
      id: 2,
      cardTitle: t("dashboard.pendingOrders"),
      cardDescription: t("dashboard.pendingOrderDescription"),
      cardNumber: formatNumber(dashboard.orders.pending),
      cardIcon: Package,
      borderClass: "border-t-secondary",
      iconClass: "bg-(--color-surface-secondary) text-(--color-secondary)",
    },
    {
      id: 3,
      cardTitle: t("dashboard.totalRevenue"),
      cardDescription: t("dashboard.totalRevenueDescription"),
      cardNumber: formatCurrency(dashboard.revenue.total),
      cardIcon: DollarSign,
      borderClass: "border-t-(--color-supporting)",
      iconClass: "bg-(--color-supporting) text-(--color-primary)",
    },
    {
      id: 4,
      cardTitle: t("dashboard.thisMonth"),
      cardDescription: t("dashboard.thisMonthDescription"),
      cardNumber: formatCurrency(dashboard.revenue.thisMonth),
      cardIcon: Clock,
      borderClass: "border-t-(--color-warning)",
      iconClass: "bg-(--color-warning-bg) text-(--color-warning)",
    },
    {
      id: 5,
      cardTitle: t("dashboard.topProduct"),
      cardDescription: t("dashboard.topProductDescription", {
        count: dashboard.topProducts[0]?.totalSold ?? 0,
      }),
      cardNumber: dashboard.topProducts[0]?.name || t("dashboard.noProducts"),
      cardIcon: CircleCheck,
      borderClass: "border-t-(--color-info)",
      iconClass: "bg-(--color-info-bg) text-(--color-info)",
    },
    {
      id: 6,
      cardTitle: t("dashboard.totalUsers"),
      cardDescription: t("dashboard.totalUsersDescription"),
      cardNumber: formatNumber(dashboard.totalCustomers),
      cardIcon: Users,
      borderClass: "border-t-(--color-success)",
      iconClass: "bg-(--color-success-bg) text-(--color-success)",
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cardList.map((card) => {
          const Icon = card.cardIcon;

          return (
            <Card
              key={card.id}
              className={`overflow-hidden border-t-4 shadow-sm ${card.borderClass}`}
            >
              <CardHeader>
                <CardTitle className="font-display">
                  {card.cardTitle}
                </CardTitle>

                <CardDescription>{card.cardDescription}</CardDescription>
              </CardHeader>

              <CardContent className="flex items-end justify-between gap-4">
                <h2 className="font-display wrap-break-word text-2xl font-bold tabular-nums">
                  {card.cardNumber}
                </h2>

                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  <Icon className="size-8" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
