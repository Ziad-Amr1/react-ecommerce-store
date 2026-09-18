import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pluralize } from "@/features/cart/cartUtils";

export default function CartHeader({ itemCount, hasItems, onClearClick }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold text-(--color-text-primary)">
          {t("cart.title", "Your cart")}
        </h1>

        <p className="text-sm text-(--color-text-muted)">
          {t("cart.subtitle", "Review your items and proceed to checkout")}
        </p>
      </div>

      {hasItems && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-(--color-text-muted)">
            {t("cart.itemsCount", 
            {
              count: itemCount,
              defaultValue: pluralize(itemCount, "item"),
            }
            )}
          </span>

          <Button
            type="button"
            variant="outline"
            onClick={onClearClick}
            className="gap-2 rounded-xl border-(--color-border) text-sm font-medium text-(--color-text-secondary) hover:bg-(--color-error-bg) hover:text-(--color-error)"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            {t("cart.clearTitle", "Clear Cart")}
          </Button>
        </div>
      )}
    </div>
  );
}
