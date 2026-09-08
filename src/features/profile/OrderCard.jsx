import { PackageCheck, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const statusClasses = {
  Delivered:
    "bg-(--color-secondary) text-(--color-primary) border-(--color-border)",

  Processing:
    "bg-(--color-surface) text-(--color-foreground) border-(--color-border)",

  Cancelled:
    "bg-(--color-secondary) text-(--color-destructive) border-(--color-border)",
};

const OrderCard = ({ order }) => {
  return (
    <Card className="border-(--color-border) bg-(--color-surface) shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Product Image */}
          <div className="h-20 w-full overflow-hidden rounded-lg border border-(--color-border) bg-(--color-background) sm:w-20">
            <img
              src={order.image}
              alt={order.productName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-(--color-foreground)">
                  {order.productName}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-(--color-muted)">
                  <span className="flex items-center gap-1.5">
                    <PackageCheck size={15} />
                    {order.id}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={15} />
                    {order.date}
                  </span>
                </div>
              </div>

              <Badge
                variant="outline"
                className={statusClasses[order.status]}
              >
                {order.status}
              </Badge>
            </div>
          </div>

          {/* Price */}
          <div className="sm:text-right">
            <p className="text-sm text-(--color-muted)">
              Total
            </p>

            <p className="mt-1 text-lg font-bold text-(--color-foreground)">
              {order.price}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
