import { useTranslation } from "react-i18next";
import { ChevronDown, Heart, PackageOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function SavedForLater({
  savedItems,
  isOpen,
  onOpenChange,
  money,
  onMoveToCart,
}) {
  const { t } = useTranslation();

  if (savedItems.length === 0) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="border-t border-(--color-border)"
    >
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-sm font-medium text-(--color-text-primary) sm:px-5"
        >
          <span className="inline-flex items-center gap-2">
            <Heart className="size-4" aria-hidden="true" />

            {t("cart.savedForLaterCount", {
              count: savedItems.length,
              defaultValue: `Saved for later (${savedItems.length})`,
            })}
          </span>

          <ChevronDown
            className={`size-4 shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <ul className="divide-y divide-(--color-border) border-t border-(--color-border)">
          {savedItems.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-4 sm:px-5">
              <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-secondary)">
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

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-(--color-text-primary)">
                  {item.name}
                </p>

                <p className="mt-0.5 text-xs text-(--color-text-muted)">
                  {money(item.price)}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onMoveToCart(item)}
                className="shrink-0 rounded-lg text-xs"
              >
                {t("cart.moveToCart", "Move to cart")}
              </Button>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
