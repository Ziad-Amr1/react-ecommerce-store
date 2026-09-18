
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChevronRight, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pluralize } from "@/features/cart/cartUtils";

export default function OrderSummaryCard({
  itemCount,
  subtotal,
  discount,
  total,
  hasBlockingStockIssue,
  money,
  items, 
  coupon, 
}) {
  const { t } = useTranslation();

  const blockedMessage = t(
    "cart.resolveStockIssues",
    "Resolve the stock issues above before checking out.",
  );

 
  const checkoutPayload = {
    items: (items || []).map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      lineTotal: item.price * item.quantity,
    })),
    pricing: {
      subtotal,
      discount,
      total,
    },
    coupon: coupon || null,
  };

  return (
    <Card className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-(--color-text-primary)">
          {t("cart.orderSummary", "Order summary")}
        </h2>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between text-(--color-text-muted)">
            <span>
              {t("cart.subtotalCount", {
                count: itemCount,
                defaultValue: `Subtotal (${pluralize(itemCount, "item")})`,
              })}
            </span>

            <span className="font-medium tabular-nums text-(--color-text-primary)">
              {money(subtotal)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between text-(--color-text-muted)">
              <span>{t("cart.discount", "Discount")}</span>

              <span className="font-medium tabular-nums text-(--color-success)">
                -{money(discount)}
              </span>
            </div>
          )}
        </div>

        <div className="h-px bg-(--color-border)" aria-hidden="true" />

        <div className="flex items-center justify-between text-base font-semibold text-(--color-text-primary)">
          <span>{t("cart.total", "Total")}</span>

          <span className="tabular-nums">{money(total)}</span>
        </div>

        {hasBlockingStockIssue && (
          <p className="flex items-center gap-1.5 text-xs text-(--color-warning)">
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {blockedMessage}
          </p>
        )}

        <Button
          asChild
          className={`w-full gap-2 rounded-xl bg-(--color-primary) py-6 text-sm font-medium text-(--color-on-primary) hover:bg-(--color-primary-hover) ${
            hasBlockingStockIssue ? "opacity-50" : ""
          }`}
        >
          <Link
            to="/checkout"
            state={checkoutPayload} 
            aria-disabled={hasBlockingStockIssue}
            onClick={(e) => {
              if (!hasBlockingStockIssue) return;

              e.preventDefault();
              toast.error(blockedMessage);
            }}
          >
            {t("cart.goCheckout", "Go to checkout")}

            <ChevronRight
              className="size-4 rtl:rotate-180"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>
    </Card>
  );
}