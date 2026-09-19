import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";

export default function OrderCard({ order }){
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Order #{order._id}</p>
            <p className="font-semibold">{formatCurrency(order.totalPrice, ORDER_CURRENCY)}</p>
            <OrderStatusBadge status={order.status} />
          </div>

          <Button asChild variant="outline">
            <Link to={`/profile/orders/${order._id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 