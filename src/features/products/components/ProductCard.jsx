import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  CircleCheck,
  CircleX,
  TriangleAlert,
  Heart,
  LoaderCircle,
  PackageOpen,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";
import { useTranslation } from "react-i18next";
import useCart from "@/hooks/useCart";
import Stars from "@/features/products/components/ProductRating";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProductCard({ product, viewMode = "grid" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const images = product.images?.filter((image) => image?.url) ?? [];
  const mainImage = images[0]?.url;

  const productName = product.name || t("shop.untitledProduct");

  const hasDiscount =
    product.discountPrice != null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const hasBrand = product.brand;

  const displayPrice = product.discountPrice || product.price;

  const salePercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  // The catalog API exposes no rating fields yet, so only surface a rating
  // row when the product actually carries one — never a fabricated "0.0 (0)".
  const rating = Number(product.averageRating) || 0;
  const reviewsCount = Number(product.numReviews) || 0;
  const hasRating = rating > 0;

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      await addItem(product);
      toast.success(t("cart.added", { name: productName }));
    } catch {
      toast.error(t("cart.addFailed"));
    } finally {
      setIsAdding(false);
    }
  };

  const stockStatusClass =
    isOutOfStock
      ? "text-[var(--color-error)]"
      : product.stock < 5
        ? "text-[var(--color-warning)]"
        : "text-[var(--color-success)]";

  const renderWishlist = (className) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={className}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled
            aria-label={t("shop.addToWishlist")}
            className="cursor-not-allowed bg-[var(--color-surface)]/80 opacity-60 hover:bg-[var(--color-surface)]"
          >
            <Heart aria-hidden="true" />
          </Button>
        </span>
      </TooltipTrigger>

      <TooltipContent side="top">
        <p className="text-xs">{t("shop.comingSoon")}</p>
      </TooltipContent>
    </Tooltip>
  );

  if (viewMode === "list") {
    return (
      <div className="isolate flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-card p-3 shadow-[var(--shadow-md)] sm:gap-5 sm:p-4">
        {/* Small fixed-size thumbnail (not the 4:3 grid image) */}
        <div className="relative shrink-0">
          <div className="size-16 overflow-hidden rounded-lg bg-[var(--color-surface-secondary)] sm:size-20 sm:rounded-xl">
            {mainImage ? (
              <img
                src={mainImage}
                alt={productName}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-secondary)]">
                <PackageOpen
                  className="size-5 text-[var(--color-text-disabled)]"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          {hasBrand && (
            <Badge
              variant="outline"
              className="absolute -bottom-2 start-1 z-30 border-transparent bg-[var(--color-info)] px-1.5 text-[10px] text-[var(--color-on-error)]"
            >
              {product.brand}
            </Badge>
          )}

          {renderWishlist("absolute end-1 top-1 z-40")}
        </div>

        {/* Product information — main horizontal space */}
        <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
          <p className="hidden truncate font-mono text-[10px] tracking-wide text-[var(--color-text-secondary)] uppercase sm:block">
            {product.category} {t("shop.separator")} {product.subcategory}
          </p>
          <h3
            className="truncate font-display text-sm font-semibold text-[var(--color-text-primary)] sm:text-lg"
            title={productName}
          >
            {productName}
          </h3>

          {hasRating && (
            <div className="flex items-center gap-1.5">
              <Stars
                value={rating}
                label={t("shop.productRatingLabel", { rating, reviewsCount })}
              />
              <span className="text-xs text-[var(--color-text-secondary)]">
                {rating.toFixed(1)}
                <span className="text-[var(--color-text-disabled)]">
                  {" "}
                  ({formatNumber(reviewsCount)})
                </span>
              </span>
            </div>
          )}

          <p
            className={`flex items-center gap-1 text-xs ${stockStatusClass}`}
          >
            {product.stock > 0 && product.stock < 5 ? (
              <>
                <TriangleAlert className="size-3.5" aria-hidden="true" />
                {t("shop.runningLow", { count: product.stock })}
              </>
            ) : product.stock === 0 ? (
              <>
                <CircleX className="size-3.5" aria-hidden="true" />
                {t("shop.outOfStock")}
              </>
            ) : (
              <>
                <CircleCheck className="size-3.5" aria-hidden="true" />
                {t("shop.inStock")}
              </>
            )}
          </p>
        </div>

        {/* Price / metadata + action — right side, mirrors left in RTL */}
        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:gap-2">
          <div className="flex flex-wrap items-baseline justify-end gap-1.5 sm:gap-2">
            <p className="font-display text-base font-bold text-[var(--color-text-primary)] sm:text-xl">
              {formatCurrency(displayPrice)}
            </p>

            {hasDiscount && (
              <p className="hidden text-xs text-[var(--color-text-secondary)] line-through sm:block">
                {formatCurrency(product.price)}
              </p>
            )}

            {hasDiscount && (
              <Badge
                variant="outline"
                className="hidden border-transparent bg-[var(--color-error)] px-1.5 text-[10px] text-[var(--color-on-error)] sm:inline-flex"
              >
                {salePercentage} {t("shop.off")}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-secondary)]"
              onClick={handleAddToCart}
              disabled={isAdding || isOutOfStock}
              aria-label={
                isOutOfStock ? t("shop.outOfStock") : t("shop.addToCart")
              }
            >
              {isAdding ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <ShoppingCart className="size-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {isOutOfStock ? t("shop.outOfStock") : t("shop.addToCart")}
              </span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              aria-label={t("shop.viewDetails", { name: productName })}
              onClick={() => navigate(`/products/${product._id}`)}
            >
              <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("shop.details")}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="isolate h-full gap-4 overflow-hidden border-[var(--color-border)] py-0 shadow-[var(--shadow-md)]">
      <div className="relative m-4 aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-surface-secondary)]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={productName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-secondary)]">
            <PackageOpen
              className="size-10 text-[var(--color-text-disabled)]"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Brand */}
        {hasBrand && (
          <Badge
            variant="outline"
            className="absolute start-3 top-3 z-30 border-transparent bg-[var(--color-info)] px-2.5 text-[var(--color-on-error)]"
          >
            {product.brand}
          </Badge>
        )}

        {/* Wishlist — disabled until the real wishlist API exists. A heart
            that toggles locally but never persists would mislead users. */}
        {renderWishlist("absolute end-3 top-3 z-40")}
      </div>

      <CardContent className="flex flex-1 flex-col gap-1.5 px-5 pb-5">
        <div>
          <p className="font-mono text-[11px] tracking-wide text-[var(--color-text-secondary)] uppercase">
            {product.category} {t("shop.separator")} {product.subcategory}
          </p>
          <h3
            className="mt-1 truncate font-display text-lg font-semibold text-[var(--color-text-primary)]"
            title={productName}
          >
            {productName}
          </h3>

          {hasRating && (
            <div className="mt-1.5 flex items-center gap-2">
              <Stars
                value={rating}
                label={t("shop.productRatingLabel", { rating, reviewsCount })}
              />
              <span className="text-sm text-[var(--color-text-secondary)]">
                {rating.toFixed(1)}{" "}
                <span className="text-[var(--color-text-disabled)]">
                  ({formatNumber(reviewsCount)})
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
            {formatCurrency(displayPrice)}
          </p>

          {hasDiscount && (
            <p className="text-sm text-[var(--color-text-secondary)] line-through">
              {formatCurrency(product.price)}
            </p>
          )}

          {hasDiscount && (
            <Badge
              variant="outline"
              className="border-transparent bg-[var(--color-error)] text-[var(--color-on-error)]"
            >
              {salePercentage} {t("shop.off")}
            </Badge>
          )}
        </div>

        <p
          className={`flex items-center gap-1.5 text-sm min-h-5 ${stockStatusClass}`}
        >
          {product.stock > 0 && product.stock < 5 ? (
            <>
              <TriangleAlert className="size-4" aria-hidden="true" />
              {t("shop.runningLow", { count: product.stock })}
            </>
          ) : product.stock === 0 ? (
            <>
              <CircleX className="size-4" aria-hidden="true" />
              {t("shop.outOfStock")}
            </>
          ) : (
            <>
              <CircleCheck className="size-4" aria-hidden="true" />
              {t("shop.inStock")}
            </>
          )}
        </p>

        <div className="mt-auto flex gap-2 pt-2">
          <Button
            className="flex-1 bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-secondary)]"
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            aria-label={
              isOutOfStock ? t("shop.outOfStock") : t("shop.addToCart")
            }
          >
            {isAdding ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ShoppingCart aria-hidden="true" />
            )}
            {isOutOfStock ? t("shop.outOfStock") : t("shop.addToCart")}
          </Button>
          <Button
            variant="outline"
            aria-label={t("shop.viewDetails", { name: productName })}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            {t("shop.details")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
