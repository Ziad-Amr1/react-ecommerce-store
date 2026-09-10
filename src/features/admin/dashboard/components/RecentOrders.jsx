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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import {
  STATUS_PRESENTATION,
  STATUS_BADGE_CLASS_FALLBACK,
} from "@/features/admin/dashboard/constants";

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
          <TooltipProvider delayDuration={0}>
            <Table density="default">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dashboard.orderId")}</TableHead>
                  <TableHead>{t("dashboard.customer")}</TableHead>
                  <TableHead className="text-end">
                    {t("dashboard.total")}
                  </TableHead>
                  <TableHead>{t("dashboard.status")}</TableHead>
                  <TableHead>{t("dashboard.date")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono font-medium whitespace-nowrap">
                      #{order._id.slice(-6)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {order.shippingAddress?.fullName ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              tabIndex={0}
                              className="block max-w-56 truncate rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)"
                            >
                              {order.shippingAddress.fullName}
                            </span>
                          </TooltipTrigger>

                          <TooltipContent side="top" align="start">
                            {order.shippingAddress.fullName}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-end tabular-nums">
                      {order.totalPrice == null
                        ? "—"
                        : formatCurrency(
                            order.totalPrice,
                            "USD",
                            i18n.language,
                          )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={
                          STATUS_PRESENTATION[order.status]?.badgeClass ||
                          STATUS_BADGE_CLASS_FALLBACK
                        }
                      >
                        {STATUS_PRESENTATION[order.status]
                          ? t(
                              STATUS_PRESENTATION[order.status].labelKey,
                            )
                          : order.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDisplayDate(order.createdAt) ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
}