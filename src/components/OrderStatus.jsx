import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  returned: "bg-gray-100 text-gray-700",
};

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export default function OrderStatus({ ordersByStatus = [], totalOrders = 0 }) {
  const { t } = useTranslation();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("dashboard.orderStatus", "Order Status")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {ordersByStatus.map((item) => {
          const percentage =
            totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;

          const status = item._id;

          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {statusLabels[status] || status}
                </span>

                <span className="text-sm font-semibold">
                  {item.count}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {percentage.toFixed(0)}% of orders
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}