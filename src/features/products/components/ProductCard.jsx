import { useState } from "react";
import { Link, useNavigate } from "react-router";
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
import useAuth from "@/hooks/useAuth";
import useWishlist from "@/hooks/useWishlist";
import Stars from "@/features/products/components/ProductRating";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProductCard({ product, viewMode = "grid" }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const images = product.images?.filter((image) => image?.url) ?? [];
  const mainImage = images[0]?.url;

  const productId = product._id || product.id;
  const productUrl = `/products/${productId}`;
  const isFavorite = productId ? isInWishlist(productId) : false;

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

  // The catalog API exposes rating fields as averageRating/numReviews, so only
  // surface a rating row when the product actually carries one — never a
  // fabricated "0.0 (0)".
  const rating = Number(product.averageRating) || 0;
  const reviewsCount = Number(product.numReviews) || 0;
  const hasRating = rating > 0;

  const isOutOfStock = product.stock === 0;
  const isRunningLow = product.stock > 0 && product.stock < 5;

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

  const handleWishlistToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isWishlistLoading || !productId) return;

    if (!isAuthenticated) {
      toast.info(t("wishlist.signInRequired"));
      return;
    }

    setIsWishlistLoading(true);

    try {
      if (isFavorite) {
        await removeFromWishlist(productId);
        toast.success(t("wishlist.removed"));
      } else {
        await addToWishlist(product);
        toast.success(t("wishlist.added"));
      }
    } catch {
      toast.error(t("wishlist.updateError"));
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const stockStatusClass =
    isOutOfStock
      ? "text-(--color-error)"
      : isRunningLow
        ? "text-(--color-warning)"
        : "text-(--color-success)";

  const renderWishlist = (className) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={className}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            aria-label={
              isFavorite
                ? t("wishlist.removeFromWishlist")
                : t("wishlist.addToWishlist")
            }
            aria-pressed={isFavorite}
            className={`bg-(--color-surface)/80 backdrop-blur-sm hover:bg-(--color-surface) ${
              isFavorite
                ? "text-(--color-error)"
                : "text-(--color-text-primary)"
            }`}
          >
            {isWishlistLoading ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Heart
                aria-hidden="true"
                className={isFavorite ? "fill-current" : ""}
              />
            )}
          </Button>
        </span>
      </TooltipTrigger>

      <TooltipContent side="top">
        <p className="text-xs">
          {isFavorite
            ? t("wishlist.removeFromWishlist")
            : t("wishlist.addToWishlist")}
        </p>
      </TooltipContent>
    </Tooltip>
  );

  const renderRating = () => (
    <div className="flex items-center gap-1.5">
      {hasRating ? (
        <>
          <Stars
            value={rating}
            label={t("shop.productRatingLabel", { rating, reviewsCount })}
          />
          <span className="text-xs tabular-nums text-(--color-text-secondary)">
            {rating.toFixed(1)}
            <span className="text-(--color-text-disabled)">
              {" "}
              ({formatNumber(reviewsCount, i18n.language)})
            </span>
          </span>
        </>
      ) : (
        <span className="text-xs text-(--color-text-muted)">
          {t("shop.noReviews")}
        </span>
      )}
    </div>
  );

  // Compact: the landing strip. Whole card is one hit target / one tab stop,
  // so the image is decorative (alt="") and the link carries the accessible
  // name — the name is read once, not twice.
  if (viewMode === "compact") {
    return (
      <div className="group isolate relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[transform,box-shadow] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md">
        <Link
          to={productUrl}
          aria-label={t("shop.viewDetails", { name: productName })}
          className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)"
        />

        <div className="pointer-events-none relative aspect-[4/3] overflow-hidden bg-(--color-surface-secondary)">
          {mainImage ? (
            <img
              src={mainImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-(--color-supporting-decorative)">
              <PackageOpen className="size-10" aria-hidden="true" />
            </div>
          )}

          {hasDiscount && (
            <Badge className="absolute start-3 top-3 z-30 border-transparent bg-(--color-error) px-2.5 text-xs tabular-nums text-(--color-on-error)">
              {salePercentage} {t("shop.off")}
            </Badge>
          )}

          {hasBrand && (
            <Badge
              variant="outline"
              className={`absolute start-3 z-30 border-transparent bg-(--color-info) px-2.5 text-(--color-on-error) ${hasDiscount ? "top-12" : "top-3"}`}
            >
              {product.brand}
            </Badge>
          )}
      </div>

        {renderWishlist("absolute end-2 top-2 z-20")}

        <div className="pointer-events-none flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
          <h3 className="line-clamp-2 min-h-[2.4rem] text-sm font-semibold leading-snug text-foreground sm:min-h-[2.75rem] sm:text-base">
            {productName}
          </h3>

          {renderRating()}

          <div className="mt-auto flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 pt-1 sm:gap-x-3">
            <span className="font-display text-base font-bold tabular-nums text-foreground sm:text-xl">
              {formatCurrency(displayPrice, undefined, i18n.language)}
            </span>

            {hasDiscount && (
              <span className="text-xs tabular-nums text-muted-foreground line-through sm:text-sm">
                {formatCurrency(product.price, undefined, i18n.language)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="isolate flex items-center gap-3 rounded-xl border border-(--color-border) bg-card p-3 shadow-(--shadow-md) sm:gap-5 sm:p-4">
        {/* Small fixed-size thumbnail (not the 4:3 grid image) */}
        <div className="relative shrink-0">
          <div className="size-16 overflow-hidden rounded-lg bg-(--color-surface-secondary) sm:size-20 sm:rounded-xl">
            {mainImage ? (
              <img
                src={mainImage}
                alt={productName}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-(--color-surface-secondary)">
                <PackageOpen
                  className="size-5 text-(--color-text-disabled)"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          {hasBrand && (
            <Badge
              variant="outline"
              className="absolute -bottom-2 start-1 z-30 border-transparent bg-(--color-info) px-1.5 text-[10px] text-(--color-on-error)"
            >
              {product.brand}
            </Badge>
          )}

          {renderWishlist("absolute end-1 top-1 z-40")}
        </div>

        {/* Product information — main horizontal space */}
        <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
          <p className="hidden truncate font-mono text-[10px] tracking-wide text-(--color-text-secondary) uppercase sm:block">
            {product.category} {t("shop.separator")} {product.subcategory}
          </p>
          <h3
            className="truncate font-display text-sm font-semibold text-(--color-text-primary) sm:text-lg"
            title={productName}
          >
            {productName}
          </h3>

          {renderRating()}

          <p
            className={`flex items-center gap-1 text-xs ${stockStatusClass}`}
          >
            {isRunningLow ? (
              <>
                <TriangleAlert className="size-3.5" aria-hidden="true" />
                {t("shop.runningLow", { count: product.stock })}
              </>
            ) : isOutOfStock ? (
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
            <p className="font-display text-base font-bold tabular-nums text-(--color-text-primary) sm:text-xl">
              {formatCurrency(displayPrice, undefined, i18n.language)}
            </p>

            {hasDiscount && (
              <p className="hidden text-xs tabular-nums text-(--color-text-secondary) line-through sm:block">
                {formatCurrency(product.price, undefined, i18n.language)}
              </p>
            )}

            {hasDiscount && (
              <Badge
                variant="outline"
                className="hidden border-transparent bg-(--color-error) px-1.5 text-[10px] tabular-nums text-(--color-on-error) sm:inline-flex"
              >
                {salePercentage} {t("shop.off")}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-(--color-primary) text-primary-foreground hover:bg-(--color-secondary)"
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
              onClick={() => navigate(productUrl)}
            >
              <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("shop.details")}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid: shop, wishlist, and related products. Whole card is one hit target,
  // so the image is decorative and the link carries the accessible name.
  return (
    <Card className="group isolate relative flex h-full flex-col gap-4 overflow-hidden border-(--color-border) py-0 shadow-(--shadow-md) transition-[transform,box-shadow] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md">
      <Link
        to={productUrl}
        aria-label={t("shop.viewDetails", { name: productName })}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)"
      />

      <div className="pointer-events-none relative m-4 aspect-[4/3] overflow-hidden rounded-xl bg-(--color-surface-secondary)">
        {mainImage ? (
          <img
            src={mainImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-(--color-surface-secondary)">
            <PackageOpen
              className="size-10 text-(--color-text-disabled)"
              aria-hidden="true"
            />
          </div>
        )}

        {hasBrand && (
          <Badge
            variant="outline"
            className="absolute start-3 top-3 z-30 border-transparent bg-(--color-info) px-2.5 text-(--color-on-error)"
          >
            {product.brand}
          </Badge>
        )}
      </div>

      {renderWishlist("absolute end-3 top-3 z-20")}

      <CardContent className="pointer-events-none flex flex-1 flex-col gap-1.5 px-5 pb-5">
        <div>
          <p className="truncate font-mono text-[11px] tracking-wide text-(--color-text-secondary) uppercase">
            {product.category} {t("shop.separator")} {product.subcategory}
          </p>
          <h3
            className="mt-1 truncate font-display text-lg font-semibold text-(--color-text-primary)"
            title={productName}
          >
            {productName}
          </h3>

          {renderRating()}
        </div>

        <div className="flex min-w-0 flex-wrap items-baseline gap-2">
          <p className="font-display text-2xl font-bold tabular-nums text-(--color-text-primary)">
            {formatCurrency(displayPrice, undefined, i18n.language)}
          </p>

          {hasDiscount && (
            <p className="text-sm tabular-nums text-(--color-text-secondary) line-through">
              {formatCurrency(product.price, undefined, i18n.language)}
            </p>
          )}
        </div>

        {isRunningLow || isOutOfStock ? (
          <p
            className={`flex items-center gap-1.5 text-sm min-h-5 ${stockStatusClass}`}
          >
            {isRunningLow ? (
              <>
                <TriangleAlert className="size-4" aria-hidden="true" />
                {t("shop.runningLow", { count: product.stock })}
              </>
            ) : (
              <>
                <CircleX className="size-4" aria-hidden="true" />
                {t("shop.outOfStock")}
              </>
            )}
          </p>
        ) : null}

        <div className="pointer-events-auto relative z-20 mt-auto flex gap-2 pt-2">
          <Button
            className="flex-1 bg-(--color-primary) text-primary-foreground hover:bg-(--color-secondary)"
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
        </div>
      </CardContent>
    </Card>
  );
}