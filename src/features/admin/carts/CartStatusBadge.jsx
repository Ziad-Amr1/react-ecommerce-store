import { Badge } from "@/components/ui/badge";
import { CART_STATUSES } from "@/utils/cart-helpers";

export function CartStatusBadge({ status }) {
  const config = CART_STATUSES[status] ?? {
    label: status ?? "Unknown",
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge variant="outline" className={`border-transparent ${config.className}`}>
      {config.label}
    </Badge>
  );
}
