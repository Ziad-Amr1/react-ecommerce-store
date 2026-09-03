import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDashboard } from "@/features/admin/dashboard/DashboardContext";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

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
  }, []);

  if (loading) {
    return <div>{t("dashboard.loading")}</div>;
  }

  if (error) {
    return <div>{t("dashboard.error")}</div>;
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
      cardNumber: dashboard.topProducts[0]?.name || "No products",
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
    <div className="p-6 w-full space-y-6">
      {/* Intro Card */}
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardList.map((card) => {
          const Icon = card.cardIcon;

          return (
            <Card key={card.id}>
              <CardHeader>
                <CardTitle>{card.cardTitle}</CardTitle>

                <CardDescription>{card.cardDescription}</CardDescription>
              </CardHeader>

              <CardContent className="flex items-end justify-between">
                <h2 className="text-2xl font-bold">{card.cardNumber}</h2>

                <Badge className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <Icon size={28} />
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
