import { useTranslation } from "react-i18next";
import { Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PromoCodeCard({
  promoCode,
  setPromoCode,
  isApplyingPromo,
  isRemovingCoupon,
  coupon,
  discount,
  money,
  onApply,
  onRemoveCoupon,
}) {
  const { t } = useTranslation();

  return (
    <Card className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-(--color-text-primary)">
        <Tag className="size-4" aria-hidden="true" />
        {t("cart.havePromo", "Have a promo code?")}
      </div>

      <form onSubmit={onApply} className="flex gap-2">
        <label htmlFor="promo-code" className="sr-only">
          {t("cart.promoPlaceholder", "Promo code")}
        </label>

        <input
          id="promo-code"
          type="text"
          placeholder={t("cart.promoPlaceholder", "Enter promo code")}
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          disabled={isApplyingPromo}
          className="min-w-0 flex-1 rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2.5 text-sm text-(--color-text-primary) placeholder:text-(--color-text-disabled) focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-focus-ring)/20 disabled:opacity-60"
        />

        <Button
          type="submit"
          variant="outline"
          disabled={!promoCode.trim() || isApplyingPromo}
          className="shrink-0 rounded-xl border-(--color-border) bg-(--color-surface) px-4 text-sm font-medium text-(--color-text-primary) hover:bg-(--color-surface-secondary)"
        >
          {isApplyingPromo
            ? t("cart.applying", "Applying...")
            : t("cart.apply", "Apply")}
        </Button>
      </form>

      {coupon && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-(--color-success-bg) px-3 py-2 text-sm text-(--color-success)">
          <div className="flex items-center gap-2">
            <Tag className="size-4" aria-hidden="true" />

            <span className="font-semibold">{coupon}</span>

            {discount > 0 && (
              <span className="text-xs text-(--color-success)/80">
                (-{money(discount)})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onRemoveCoupon}
            disabled={isRemovingCoupon}
            aria-label={t("cart.removeCoupon", "Remove coupon")}
            className="flex size-7 items-center justify-center rounded-md text-(--color-text-disabled) transition-colors hover:bg-(--color-surface) hover:text-(--color-text-secondary) disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </Card>
  );
}
