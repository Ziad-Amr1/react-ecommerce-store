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
} from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();

  const { dashboard, loading, error, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="w-full space-y-6" aria-busy="true" role="status">
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden border-t-4 border-t-[var(--color-accent)]"
            >
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>

              <CardContent className="flex items-end justify-between">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="size-14 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboard) {
    return <div>{t("dashboard.noData")}</div>;
  }

  const cardList = [
    {
      id: 1,
      cardTitle: t("dashboard.totalOrders"),
      cardDescription: t("dashboard.totalOrdersDescription"),
      cardNumber: dashboard.orders.total,
      cardIcon: ShoppingBag,
    },
    {
      id: 2,
      cardTitle: t("dashboard.pendingOrders"),
      cardDescription: t("dashboard.pendingOrderDescription"),
      cardNumber: dashboard.orders.pending,
      cardIcon: Package,
    },
    {
      id: 3,
      cardTitle: t("dashboard.totalRevenue"),
      cardDescription: t("dashboard.totalRevenueDescription"),
      cardNumber: dashboard.revenue.total,
      cardIcon: DollarSign,
    },
    {
      id: 4,
      cardTitle: t("dashboard.thisMonth"),
      cardDescription: t("dashboard.thisMonthDescription"),
      cardNumber: dashboard.revenue.thisMonth,
      cardIcon: Clock,
    },
    {
      id: 5,
      cardTitle: t("dashboard.topProduct"),
      cardDescription: t("dashboard.topProductDescription", {
        count: dashboard.topProducts[0]?.totalSold ?? 0,
      }),
      cardNumber: dashboard.topProducts[0]?.name || t("dashboard.noProducts"),
      cardIcon: CircleCheck,
    },
    {
      id: 6,
      cardTitle: t("dashboard.totalUsers"),
      cardDescription: t("dashboard.totalUsersDescription"),
      cardNumber: dashboard.totalCustomers,
      cardIcon: Users,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <span className="text-lg text-(--color-text-primary)">
            {t("dashboard.adminOverview")}
          </span>

          <CardTitle>{t("dashboard.commerceHealth")}</CardTitle>

          <CardDescription>
            {t("dashboard.commerceHealthDescription")}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardList.map((card) => {
          const Icon = card.cardIcon;

          return (
            <Card
              key={card.id}
              className="overflow-hidden border-t-4 border-t-[var(--color-accent)]"
            >
              <CardHeader>
                <CardTitle>{card.cardTitle}</CardTitle>

                <CardDescription>{card.cardDescription}</CardDescription>
              </CardHeader>

              <CardContent className="flex items-end justify-between">
                <h2 className="text-2xl font-bold">{card.cardNumber}</h2>

                <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
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
