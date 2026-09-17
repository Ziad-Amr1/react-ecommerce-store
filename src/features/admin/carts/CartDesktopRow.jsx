import { ChevronDown, Package } from "lucide-react";
import { CartAvatar } from "@/features/admin/carts/CartAvatar";
import { CartStatusBadge } from "@/features/admin/carts/CartStatusBadge";
import { CartItemsBreakdown } from "@/features/admin/carts/CartItemsBreakdown";

import {
  cartItemCount,
  cartTotal,
  formatCurrency,
} from "@/utils/cart-helpers";

const ROW_ITEM_LIMIT = 2;

export function CartDesktopRow({
  cart,
  isExpanded,
  onToggle,
  onOpenDetails,
}) {
  const total = cartTotal(cart.items);
  const itemCount = cartItemCount(cart.items);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <>
      <tr
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        data-cart-row
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`Toggle details for ${cart.customer}'s cart`}
        className={`cursor-pointer border-b transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
          isExpanded ? "bg-muted/40" : ""
        }`}
      >
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <CartAvatar name={cart.customer} />

            <div className="leading-tight">
              <div className="text-sm font-medium">
                {cart.customer}
              </div>

              <div className="text-xs text-muted-foreground">
                {cart.email}
              </div>
            </div>
          </div>
        </td>

        <td className="px-4 py-3.5">
          <span className="font-mono text-xs text-muted-foreground">
            {cart.id}
          </span>
        </td>

        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Package className="size-3.5" />

            {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"}
          </div>
        </td>

        <td className="px-4 py-3.5">
          <CartStatusBadge status={cart.status} />
        </td>

        <td className="px-4 py-3.5">
          <span className="font-display font-bold tabular-nums">
            {formatCurrency(total)} EGP
          </span>
        </td>

        <td className="px-4 py-3.5 text-sm text-muted-foreground">
          {cart.updatedAt}
        </td>

        <td className="px-4 py-3.5 text-right">
          <ChevronDown
            className={`ml-auto size-4 text-muted-foreground transition-transform duration-200 ${
              isExpanded
                ? "rotate-180 text-foreground"
                : ""
            }`}
          />
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-b bg-muted/30">
          <td
            colSpan={7}
            className="px-4 py-3 pl-16"
          >
            <div className="space-y-3">
              <CartItemsBreakdown
                items={cart.items}
                limit={ROW_ITEM_LIMIT}
              />

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
          </td>
        </tr>
      )}
    </>
  );
}