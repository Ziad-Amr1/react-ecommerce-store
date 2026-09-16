import { CartSearchInput } from "@/components/ui/carts/CartSearchInput";
import { CART_STATUS_OPTIONS, CART_SORT_OPTIONS } from "@/lib/cart-helpers";

const selectClasses =
  "rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring";

export function CartFiltersBar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <CartSearchInput value={query} onChange={onQueryChange} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={selectClasses}
          aria-label="Filter by status"
        >
          {CART_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className={selectClasses}
          aria-label="Sort carts"
        >
          {CART_SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
