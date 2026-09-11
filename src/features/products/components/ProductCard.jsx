import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CircleCheck,
  CircleX,
  TriangleAlert,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";
import { useTranslation } from "react-i18next";
import Stars from "@/features/products/components/ProductRating";

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const images = product.images?.filter((image) => image?.url) ?? [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const image = images[currentImageIndex]?.url;

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

  //Comment should be removed after creating addToWishlist ,removeFromWishlist functions

  // const handleWishlist = async () => {
  //   try {
  //     if (wishlisted) {
  //       await removeFromWishlist(product._id);
  //       setWishlisted(false);
  //     } else {
  //       await addToWishlist(product._id);
  //       setWishlisted(true);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  //Comment should be removed after creating useCart ,cart context

  // const { addToCart } = useCart();

  const rating = product.averageRating ?? 0;
  const reviewsCount = product.numReviews ?? 0;

  const stockStatusClass =
    product.stock === 0
      ? "text-[var(--color-error)]"
      : product.stock < 5
        ? "text-[var(--color-warning)]"
        : "text-[var(--color-success)]";

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [images.length, currentImageIndex]);

  return (
    <Card className="h-full gap-4 overflow-hidden border-[var(--color-border)] py-0 shadow-[var(--shadow-md)]">
      <div className="relative m-4 aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-surface-secondary)]">
        <img
          src={image}
          alt={productName}
          loading="lazy"
          className="h-full w-full object-cover"
        />

        {/* Brand */}
        {hasBrand && (
          <Badge
            variant="outline"
            className="absolute top-3 left-3 z-30 border-transparent bg-[var(--color-info)] px-2.5 text-[var(--color-on-error)]"
          >
            {product.brand}
          </Badge>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => setWishlisted((value) => !value)}
          // onClick={handleWishlist}
          className="absolute top-3 right-3 z-40 bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface)]"
        >
          <Heart
            aria-hidden="true"
            className={
              wishlisted
                ? "fill-[var(--color-error)] text-[var(--color-error)]"
                : undefined
            }
          />
        </Button>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`size-1.5 rounded-full ${
                  index === currentImageIndex
                    ? "bg-black"
                    : "bg-black/50 hover:bg-black/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <CardContent className="space-y-1 px-5 pb-5">
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

        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1 bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-secondary)]"
            // onClick={() => addToCart(product)}
          >
            <ShoppingCart aria-hidden="true" />
            {t("shop.addToCart")}
          </Button>
          <Button
            variant="outline"
            aria-label={`View details for ${productName}`}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            {t("shop.details")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
