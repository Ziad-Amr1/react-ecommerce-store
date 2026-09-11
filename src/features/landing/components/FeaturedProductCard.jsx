import { PackageOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";

const CURRENCY = "USD";

function discountPercent(product) {
  const price = Number(product.price);
  const discountPrice = Number(product.discountPrice);

  if (!(price > 0) || !(discountPrice > 0) || discountPrice >= price) {
    return null;
  }

  return Math.round(((price - discountPrice) / price) * 100);
}

export default function FeaturedProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const image = product.images?.[0]?.url;
  const discount = discountPercent(product);
  const price = Number(product.price) || 0;
  const currentPrice = Number(product.discountPrice) || price;

  return (
    <div className="select-none overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative aspect-square bg-muted">
        {image ? (
          <img
            src={image}
            alt={t("landing.featured.imageAlt", { name: product.name })}
            className="size-full object-contain p-4"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <PackageOpen className="size-10" aria-hidden="true" />
          </div>
        )}

        {discount !== null && (
          <Badge className="absolute end-2 top-2 bg-error tabular-nums text-on-error">
            {t("landing.featured.discountOff", { percent: discount })}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <h3 className="line-clamp-1 font-semibold text-foreground">
          {product.name || t("landing.featured.untitled")}
        </h3>

        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-display text-xl font-bold tabular-nums text-foreground">
            {formatCurrency(currentPrice, CURRENCY, i18n.language)}
          </span>

          {discount !== null && (
            <span className="text-sm tabular-nums text-muted-foreground line-through">
              {formatCurrency(price, CURRENCY, i18n.language)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}