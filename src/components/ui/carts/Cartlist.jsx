import { useRef } from "react";
import { CartMobileCard } from "@/components/ui/carts/CartMobileCard";
import { CartTabletRow } from "@/components/ui/carts/CartTabletRow";
import { CartDesktopRow } from "@/components/ui/carts/CartDesktopRow";
import { CartsEmptyState } from "@/components/ui/carts/CartsEmptyState";

export function CartList({ carts = [], expandedId, onToggleExpanded, onOpenDetails }) {
  const containerRef = useRef(null);

  // Roving focus across rows: Up/Down move one row, Home/End jump to the
  // first/last row. Only one breakpoint's markup is actually visible at a
  // time (the others are `display: none`), so we filter to visible rows
  // via offsetParent before moving focus.
  const handleKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;

    const rows = Array.from(
      containerRef.current?.querySelectorAll("[data-cart-row]") ?? []
    ).filter((el) => el.offsetParent !== null);

    if (rows.length === 0) return;

    const currentIndex = rows.indexOf(document.activeElement);
    let nextIndex = currentIndex === -1 ? 0 : currentIndex;

    if (e.key === "ArrowDown") nextIndex = Math.min(currentIndex + 1, rows.length - 1);
    if (e.key === "ArrowUp") nextIndex = Math.max(currentIndex - 1, 0);
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = rows.length - 1;

    e.preventDefault();
    rows[nextIndex]?.focus();
  };

  if (carts.length === 0) {
    return <CartsEmptyState />;
  }

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      {/* Mobile: stacked cards (below sm) */}
      <div className="divide-y sm:hidden">
        {carts.map((cart) => (
          <CartMobileCard
            key={cart.id}
            cart={cart}
            isExpanded={expandedId === cart.id}
            onToggle={() => onToggleExpanded(cart.id)}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>

      {/* Tablet: compact cards (sm to md) */}
      <div className="hidden divide-y sm:block md:hidden">
        {carts.map((cart) => (
          <CartTabletRow
            key={cart.id}
            cart={cart}
            isExpanded={expandedId === cart.id}
            onToggle={() => onToggleExpanded(cart.id)}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>

      {/* Desktop: table (md and up) */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Cart</th>
              <th className="px-4 py-3 text-left font-semibold">Items</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Total</th>
              <th className="px-4 py-3 text-left font-semibold">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <CartDesktopRow
                key={cart.id}
                cart={cart}
                isExpanded={expandedId === cart.id}
                onToggle={() => onToggleExpanded(cart.id)}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
