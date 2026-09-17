import { Package, Tag, Clock, Mail, Hash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CartAvatar } from "@/features/admin/carts/CartAvatar";
import { CartStatusBadge } from "@/features/admin/carts/CartStatusBadge";
import { cartItemCount, cartTotal, formatCurrency } from "@/utils/cart-helpers";

export function CartDetailsSidebar({ cart, open, onOpenChange }) {
  if (!cart) return null;

  const total = cartTotal(cart.items);
  const itemCount = cartItemCount(cart.items);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <CartAvatar name={cart.customer} />
            <span>{cart.customer}</span>
          </SheetTitle>
          <SheetDescription>Full details for this cart.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Summary */}
          <div className="flex items-center justify-between">
            <CartStatusBadge status={cart.status} />
            <span className="font-display text-xl font-bold tabular-nums">
              {formatCurrency(total)} EGP
            </span>
          </div>

          {/* Meta */}
          <div className="space-y-2 rounded-lg border p-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="size-3.5 shrink-0" />
              <span className="font-mono text-xs">{cart.id}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-3.5 shrink-0" />
              <span className="truncate">{cart.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-3.5 shrink-0" />
              <span>Updated {cart.updatedAt}</span>
            </div>
            {cart.coupon && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="size-3.5 shrink-0" />
                <span>Coupon applied: {cart.coupon}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Items ({itemCount})
            </h3>
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Package className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{item.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatCurrency(item.price)} EGP × {item.quantity}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums font-medium">
                    {formatCurrency(item.price * item.quantity)} EGP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t pt-4 text-sm font-semibold">
            <span>Total</span>
            <span className="font-display text-base tabular-nums">
              {formatCurrency(total)} EGP
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
