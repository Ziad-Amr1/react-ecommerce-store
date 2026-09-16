import { Package } from "lucide-react";
import { formatCurrency } from "@/lib/cart-helpers";

export function CartItemsBreakdown({ items, limit }) {
  const visibleItems = limit ? items.slice(0, limit) : items;
  const remaining = limit ? items.length - visibleItems.length : 0;

  return (
    <div className="space-y-2">
      {visibleItems.map((item) => (
        <div key={item.name} className="flex items-center justify-between text-sm">
          <span className="flex min-w-0 items-center gap-2">
            <Package className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{item.name}</span>
            <span className="shrink-0 text-muted-foreground">× {item.quantity}</span>
          </span>
          <span className="shrink-0 tabular-nums text-muted-foreground">
            {formatCurrency(item.price * item.quantity)} EGP
          </span>
        </div>
      ))}

      {remaining > 0 && (
        <p className="text-xs text-muted-foreground">
          +{remaining} more {remaining === 1 ? "item" : "items"} — see More details
        </p>
      )}
    </div>
  );
}
