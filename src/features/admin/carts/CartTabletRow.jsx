import { ChevronDown } from "lucide-react";
import { CartAvatar } from "@/features/admin/carts/CartAvatar";
import { CartStatusBadge } from "@/features/admin/carts/CartStatusBadge";
import { CartItemsBreakdown } from "@/features/admin/carts/CartItemsBreakdown";
import { cartItemCount, cartTotal, formatCurrency } from "@/utils/cart-helpers";

const ROW_ITEM_LIMIT = 2;

export function CartTabletRow({ cart, isExpanded, onToggle, onOpenDetails }) {
  const total = cartTotal(cart.items);
  const itemCount = cartItemCount(cart.items);

  return (
    <div>
      <button
        onClick={onToggle}
        data-cart-row
        aria-expanded={isExpanded}
        className={`flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
          isExpanded ? "bg-muted/40" : ""
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <CartAvatar name={cart.customer} />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-medium">{cart.customer}</div>
            <div className="truncate text-xs text-muted-foreground">
              {cart.email} · {cart.id}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <CartStatusBadge status={cart.status} />
          <span className="text-xs text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="w-24 text-right font-display font-bold tabular-nums">
            {formatCurrency(total)} EGP
          </span>
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? "rotate-180 text-foreground" : ""
            }`}
          />
        </div>
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-200 ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 bg-muted/30 px-4 py-3 pl-16">
            <CartItemsBreakdown items={cart.items} limit={ROW_ITEM_LIMIT} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(cart);
              }}
              className="text-xs font-medium text-primary hover:underline"
            >
              More details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
