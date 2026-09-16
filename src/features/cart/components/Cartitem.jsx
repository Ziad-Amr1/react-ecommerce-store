import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Heart,
  Minus,
  PackageOpen,
  Plus,
  Trash2,
  TriangleAlert,
} from "lucide-react";

export default function CartItem({
  item,
  isUpdating,
  money,
  onQuantityChange,
  onSaveForLater,
  onRemove,
}) {
  const { t } = useTranslation();

  const variantParts = [item.color, item.size, item.capacity].filter(Boolean);

  const { inStock, ceiling, canIncrease, atMaxAvailable, overStockLimit } =
    item;

  return (
    <li className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap sm:items-center">
        {/* Product Image */}
        <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-secondary)">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PackageOpen
                className="size-5 text-(--color-text-disabled)"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="min-w-0 flex-1">
          <Link
            to={`/products/${item.id}`}
            className="line-clamp-2 text-sm font-medium text-(--color-text-primary) hover:underline"
          >
            {item.name}
          </Link>

          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span
              className={`size-1.5 rounded-full ${
                inStock ? "bg-(--color-success)" : "bg-(--color-error)"
              }`}
              aria-hidden="true"
            />

            <span
              className={
                inStock ? "text-(--color-success)" : "text-(--color-error)"
              }
            >
              {inStock
                ? t("cart.inStock", "In stock")
                : t("cart.outOfStock", "Out of stock")}
            </span>
          </div>

          {variantParts.length > 0 && (
            <p className="mt-0.5 text-xs text-(--color-text-muted)">
              {variantParts.join(" · ")}
            </p>
          )}

          {overStockLimit && (
            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-(--color-warning)">
              <TriangleAlert className="size-3.5" aria-hidden="true" />

              {t("cart.overStockLimit", {
                stock: ceiling,
                defaultValue: `Only ${ceiling} left — please reduce the quantity`,
              })}
            </p>
          )}

          {atMaxAvailable && (
            <p className="mt-0.5 text-xs text-(--color-text-muted)">
              {t("cart.maxAvailableReached", "Max available quantity reached")}
            </p>
          )}

          <div className="mt-1.5 flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => onSaveForLater(item)}
              className="inline-flex items-center gap-1 text-(--color-text-muted) hover:text-(--color-text-primary) hover:underline"
            >
              <Heart className="size-3.5" aria-hidden="true" />
              {t("cart.saveForLater", "Save for later")}
            </button>

            <span className="text-(--color-border-strong)" aria-hidden="true">
              |
            </span>

            <button
              type="button"
              onClick={() => onRemove(item)}
              disabled={isUpdating}
              className="inline-flex items-center gap-1 text-(--color-text-muted) hover:text-(--color-error) hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              {t("cart.removeItem", "Remove")}
            </button>
          </div>
        </div>

        {/* Unit Price */}
        <div className="hidden w-20 text-center text-sm text-(--color-text-secondary) sm:block">
          {money(item.price)}
        </div>

        {/* Quantity */}
        <div className="order-3 flex w-full items-center justify-between sm:order-none sm:w-28 sm:justify-center">
          <div className="flex items-center rounded-lg border border-(--color-border) bg-(--color-surface)">
            <button
              type="button"
              onClick={() => onQuantityChange(item, item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              aria-label={t("cart.decreaseQuantity", "Decrease quantity")}
              className="flex size-9 items-center justify-center rounded-l-lg text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-secondary) hover:text-(--color-text-primary) disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </button>

            <span className="flex h-9 w-8 items-center justify-center text-sm font-medium tabular-nums text-(--color-text-primary)">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onQuantityChange(item, item.quantity + 1)}
              disabled={isUpdating || !canIncrease}
              aria-label={t("cart.increaseQuantity", "Increase quantity")}
              className="flex size-9 items-center justify-center rounded-r-lg text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-secondary) hover:text-(--color-text-primary) disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="text-sm font-semibold tabular-nums text-(--color-text-primary) sm:hidden">
            {money(item.price * item.quantity)}
          </div>
        </div>

        {/* Item Total */}
        <div className="hidden w-20 text-center text-sm font-semibold tabular-nums text-(--color-text-primary) sm:block">
          {money(item.price * item.quantity)}
        </div>
      </div>
    </li>
  );
}
