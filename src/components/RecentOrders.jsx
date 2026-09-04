import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusVariants = {
  pending: "secondary",
  processing: "secondary",
  confirmed: "default",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
  returned: "secondary",
};
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
export default function RecentOrders({ orders = [] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("dashboard.recentOrders", "Recent Orders")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-3 py-3 font-medium">Order ID</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b last:border-0">
                  <td className="px-3 py-4 font-medium">
                    #{order._id.slice(-6)}
                  </td>

                  <td className="px-3 py-4">
                    {order.shippingAddress?.fullName || "Unknown"}
                  </td>

                  <td className="px-3 py-4">
                    {formatCurrency(order.totalPrice || 0)}
                  </td>

                  <td className="px-3 py-4">
                    <Badge variant={statusVariants[order.status] || "secondary"}>
                      {order.status}
                    </Badge>
                  </td>

                  <td className="px-3 py-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}