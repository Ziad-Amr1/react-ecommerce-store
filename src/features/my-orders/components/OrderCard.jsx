import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "@/features/admin/orders/components/OrderStatusBadge";
import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";

export default function OrderCard({ order }) {
  const { t, i18n } = useTranslation();
  const placedOn = formatDisplayDate(order.createdAt, i18n.language);

  return (
    <Card className="border-(--color-border) bg-(--color-surface)">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="truncate font-mono text-xs text-(--color-text-secondary)">
              #{order._id}
            </p>

            <p className="font-display text-lg font-semibold text-(--color-text-primary)">
              {formatCurrency(order.totalPrice, ORDER_CURRENCY)}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={order.status} />

              {placedOn && (
                <span className="text-xs text-(--color-text-secondary)">
                  {t("myOrders.placedOn", { date: placedOn })}
                </span>
              )}
            </div>
          </div>

          <Button asChild variant="outline" className="w-fit gap-2">
            <Link to={`/my-orders/${order._id}`}>
              {t("myOrders.viewDetails")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
