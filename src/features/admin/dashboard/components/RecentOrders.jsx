import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";
import { STATUS_KEYS } from "@/features/admin/dashboard/constants";

const statusVariants = {
  pending: "secondary",
  processing: "secondary",
  confirmed: "default",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
  returned: "secondary",
};
export default function RecentOrders({ orders = [] }) {
  const { t, i18n } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.recentOrders")}</CardTitle>
      </CardHeader>

      <CardContent>
        {orders.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            {t("dashboard.noRecentOrders")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dashboard.orderId")}</TableHead>
                <TableHead>{t("dashboard.customer")}</TableHead>
                <TableHead>{t("dashboard.total")}</TableHead>
                <TableHead>{t("dashboard.status")}</TableHead>
                <TableHead>{t("dashboard.date")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    #{order._id.slice(-6)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {order.shippingAddress?.fullName ||
                      t("dashboard.unknownCustomer")}
                  </TableCell>

                  <TableCell className="whitespace-nowrap tabular-nums">
                    {formatCurrency(
                      order.totalPrice || 0,
                      "USD",
                      i18n.language,
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant={
                        statusVariants[order.status] || "secondary"
                      }
                    >
                      {STATUS_KEYS[order.status]
                        ? t(STATUS_KEYS[order.status])
                        : order.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(
                      i18n.language,
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}