import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, CURRENCIES } from "@/utils/formatCurrency";
import { stockClass } from "./stockClass";

function discountPercent(product) {
  const price = Number(product.price);
  const discountPrice = Number(product.discountPrice);

  if (!(price > 0) || !(discountPrice > 0) || discountPrice >= price) {
    return null;
  }

  return Math.round(((price - discountPrice) / price) * 100);
}

export default function ProductDetailsInfo({ product }) {
  const { t, i18n } = useTranslation();
  const discount = discountPercent(product);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {product.name}
            </h2>

            {product.shortDescription && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {product.shortDescription}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Badge
              variant={product.isActive ? "outline" : "destructive"}
              className={
                product.isActive
                  ? "border-(--color-success)/40 bg-(--color-success-bg) px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-(--color-success)"
                  : "px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
              }
            >
              {t(product.isActive ? "products.active" : "products.inactive")}
            </Badge>

            {product.featured && (
              <Badge
                variant="secondary"
                className="border border-(--color-supporting)/60 bg-(--color-supporting)/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground"
              >
                {t("products.featured")}
              </Badge>
            )}
          </div>
        </div>

        <div className="border-b border-border py-5">
          <p className="text-sm text-muted-foreground">{t("products.fields.price")}</p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span className="font-display text-3xl font-bold tabular-nums text-foreground">
              {formatCurrency(
                product.discountPrice || product.price,
                CURRENCIES.EGP,
                i18n.language,
              )}
            </span>

            {discount !== null && (
              <>
                <span className="text-base tabular-nums text-muted-foreground line-through">
                  {formatCurrency(product.price, CURRENCIES.EGP, i18n.language)}
                </span>
                <span className="rounded-md bg-(--color-success-bg) px-2 py-1 text-xs font-semibold tabular-nums text-(--color-success)">
                  {t("products.discountOff", { percent: discount })}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-5 border-b border-border py-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">{t("products.fields.stock")}</p>
            <p
              className={`mt-1 text-lg font-semibold tabular-nums ${stockClass(product.stock)}`}
            >
              {product.stock == null
                ? "—"
                : t("products.stockUnits", { count: product.stock })}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t("products.fields.sku")}</p>
            <p className="mt-1 break-all font-mono text-lg font-semibold text-foreground">
              {product.sku || "—"}
            </p>
          </div>
        </div>

        <div className="grid gap-5 pt-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">{t("products.fields.category")}</p>
            <p className="mt-1 font-semibold text-foreground">
              {product.category || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              {t("products.fields.subcategory")}
            </p>
            <p className="mt-1 font-semibold text-foreground">
              {product.subcategory || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t("products.fields.brand")}</p>
            <p className="mt-1 font-semibold text-foreground">
              {product.brand || "—"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}