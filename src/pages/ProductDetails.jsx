import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  TriangleAlert,
  Heart,
  LoaderCircle,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";

import useProductDetails from "@/features/products/useProductDetails";
import useRelatedProducts from "@/features/products/useRelatedProducts";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import useWishlist from "@/hooks/useWishlist";

import Stars from "@/features/products/components/ProductRating";
import ProductSkeleton from "@/features/products/components/ProductCardSkeleton";
import ProductCard from "@/features/products/components/ProductCard";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const { product, isLoading, error, retry } = useProductDetails(id);

  const location = useLocation();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const {
    similarProducts,
    recommendedProducts,
    isLoading: isRelatedLoading,
  } = useRelatedProducts(product);

  const productId = product?._id || product?.id || id;
  const isFavorite = productId ? isInWishlist(productId) : false;

  const handleWishlistToggle = async () => {
    if (isWishlistLoading || !productId) return;

    if (!isAuthenticated) {
      toast.info(t("wishlist.signInRequired"));
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--color-surface-secondary) text-(--color-text-primary) font-body transition-colors duration-300">
        <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-(--color-surface)" />

          <div className="grid gap-8 lg:grid-cols-2">
            <ProductSkeleton />

            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded-lg bg-(--color-surface)" />
              <div className="h-4 w-1/2 animate-pulse rounded-lg bg-(--color-surface)" />
              <div className="h-12 w-full animate-pulse rounded-2xl bg-(--color-surface)" />
              <div className="h-28 w-full animate-pulse rounded-2xl bg-(--color-surface)" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-(--color-surface-secondary) text-(--color-text-primary) font-body transition-colors duration-300">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) py-20">
            <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-(--color-error)/10">
              <TriangleAlert
                className="size-7 text-(--color-error)"
                aria-hidden="true"
              />
            </div>

            <h2 className="font-display text-lg font-semibold text-(--color-text-primary)">
              {t("products.loadErrorTitle")}
            </h2>

            <p className="mt-1 text-sm text-(--color-text-secondary)">
              {t("products.loadProductFailed")}
            </p>

            <Button className="mt-4" onClick={retry}>
              {t("products.retry")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-(--color-surface-secondary) text-(--color-text-primary) font-body transition-colors duration-300">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) py-20">
            <h2 className="font-display text-lg font-semibold text-(--color-text-primary)">
              {t("products.notFound")}
            </h2>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/products")}
            >
              {t("products.backToList")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const productName = product.name || t("shop.untitledProduct");

  const images = product.images?.filter((image) => image?.url) ?? [];

  const currentImage = images[selectedImage]?.url;

  const hasDiscount =
    product.discountPrice != null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const displayPrice = product.discountPrice || product.price;

  const salePercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : null;

  const rating = Number(product.averageRating) || 0;
  const reviewsCount = Number(product.numReviews) || 0;
  const hasRating = rating > 0;

  const stockStatusClass =
    product.stock === 0
      ? "text-(--color-error)"
      : product.stock < 5
        ? "text-(--color-warning)"
        : "text-(--color-success)";

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      await addItem(product);

      toast.success(
        t("cart.added", {
          name: productName,
        }),
      );
    } catch {
      toast.error(t("cart.addFailed"));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-surface-secondary) text-(--color-text-primary) font-body transition-colors duration-300">
      <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10 sm:px-8 lg:px-10">
        {/* Back */}
        <Button
          variant="outline"
          className="rounded-xl border-(--color-border) bg-(--color-surface) text-(--color-text-primary)"
          onClick={() => navigate("/products")}
          aria-label={t("products.backToList")}
        >
          <ArrowLeft
            className="size-4 shrink-0 rtl:rotate-180"
            aria-hidden="true"
          />

          {t("products.backToList")}
        </Button>

        {/* Product Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <Card className="h-full gap-4 overflow-hidden border-(--color-border) py-0 shadow-(--shadow-md)">
            <div className="relative m-4 aspect-square overflow-hidden rounded-xl bg-(--color-surface-secondary)">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-(--color-text-disabled)">
                  {t("products.noImage", "No image")}
                </div>
              )}
            </div>

            {images.length > 0 && (
              <CardContent className="flex gap-2 px-5 pb-5">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`${productName} ${t(
                      "shop.image",
                      "image",
                    )} ${index + 1}`}
                    className={`size-16 overflow-hidden rounded-lg border ${
                      index === selectedImage
                        ? "border-(--color-primary)"
                        : "border-(--color-border)"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Info */}
          <Card className="h-full border-(--color-border) shadow-(--shadow-md)">
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                {product.brand && (
                  <Badge
                    variant="outline"
                    className="border-transparent bg-(--color-info) px-2.5 text-(--color-on-error)"
                  >
                    {product.brand}
                  </Badge>
                )}

                <p className="font-mono text-[11px] tracking-wide text-(--color-text-secondary) uppercase">
                  {product.category} {t("shop.separator")}{" "}
                  {product.subcategory}
                </p>

                <h1 className="font-display text-3xl font-bold tracking-tight text-(--color-text-primary)">
                  {productName}
                </h1>

                {product.shortDescription && (
                  <p className="text-sm leading-6 text-(--color-text-secondary)">
                    {product.shortDescription}
                  </p>
                )}

                {hasRating && (
                  <div className="flex items-center gap-2">
                    <Stars
                      value={rating}
                      label={t("shop.productRatingLabel", {
                        rating,
                        reviewsCount,
                      })}
                    />

                    <span className="text-sm text-(--color-text-secondary)">
                      {rating.toFixed(1)}{" "}
                      <span className="text-(--color-text-disabled)">
                        ({formatNumber(reviewsCount)})
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-(--color-border) pt-5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="font-display text-3xl font-bold tabular-nums text-(--color-text-primary)">
                    {formatCurrency(displayPrice)}
                  </p>

                  {hasDiscount && (
                    <p className="text-base text-(--color-text-secondary) line-through">
                      {formatCurrency(product.price)}
                    </p>
                  )}

                  {hasDiscount && (
                    <Badge
                      variant="outline"
                      className="border-transparent bg-(--color-error) text-(--color-on-error)"
                    >
                      {salePercentage} {t("shop.off")}
                    </Badge>
                  )}
                </div>

                <p
                  className={`mt-3 flex items-center gap-1.5 text-sm ${stockStatusClass}`}
                >
                  {product.stock > 0 && product.stock < 5 ? (
                    <>
                      <TriangleAlert
                        className="size-4"
                        aria-hidden="true"
                      />

                      {t("shop.runningLow", {
                        count: product.stock,
                      })}
                    </>
                  ) : product.stock === 0 ? (
                    <>
                      <CircleX
                        className="size-4"
                        aria-hidden="true"
                      />

                      {t("shop.outOfStock")}
                    </>
                  ) : (
                    <>
                      <CircleCheck
                        className="size-4"
                        aria-hidden="true"
                      />

                      {t("shop.inStock")}
                    </>
                  )}
                </p>
              </div>

              {/* Product Information */}
              <div className="grid gap-5 border-t border-(--color-border) pt-5 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-(--color-text-secondary)">
                    {t("products.fields.category")}
                  </p>

                  <p className="mt-1 font-semibold text-(--color-text-primary)">
                    {product.category || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-(--color-text-secondary)">
                    {t("products.fields.subcategory")}
                  </p>

                  <p className="mt-1 font-semibold text-(--color-text-primary)">
                    {product.subcategory || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-(--color-text-secondary)">
                    {t("products.fields.sku")}
                  </p>

                  <p className="mt-1 break-all font-mono text-sm font-semibold text-(--color-text-primary)">
                    {product.sku || "—"}
                  </p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-(--color-border) pt-5">
                  <h2 className="font-display text-lg font-bold text-(--color-text-primary)">
                    {t("products.sections.description")}
                  </h2>

                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-(--color-text-secondary)">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 border-t border-(--color-border) pt-5">
                <Button
                  className="flex-1 bg-(--color-primary) text-primary-foreground hover:bg-(--color-secondary)"
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  aria-label={
                    isOutOfStock
                      ? t("shop.outOfStock")
                      : t("shop.addToCart")
                  }
                >
                  {isAdding ? (
                    <LoaderCircle
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <ShoppingCart aria-hidden="true" />
                  )}

                  {isOutOfStock
                    ? t("shop.outOfStock")
                    : t("shop.addToCart")}
                </Button>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleWishlistToggle}
                        disabled={isWishlistLoading}
                        aria-label={
                          isFavorite
                            ? t("wishlist.removeFromWishlist")
                            : t("wishlist.addToWishlist")
                        }
                        aria-pressed={isFavorite}
                        className={`rounded-xl border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-secondary) ${
                          isFavorite
                            ? "text-(--color-error)"
                            : "text-(--color-text-primary)"
                        }`}
                      >
                        {isWishlistLoading ? (
                          <LoaderCircle
                            className="size-4 animate-spin"
                            aria-hidden="true"
                          />
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Similar Products */}
        {!isRelatedLoading && similarProducts.length > 0 && (
          <section className="space-y-5 border-t border-(--color-border) pt-10">
            <div>
              <p className="text-sm font-medium text-(--color-primary)">
                {t("products.similarProducts")}
              </p>

              <h2 className="mt-1 font-display text-2xl font-bold text-(--color-text-primary)">
                {t("products.youMayAlsoLike")}
              </h2>

              <p className="mt-2 text-sm text-(--color-text-secondary)">
                {t("products.similarProductsDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  viewMode="grid"
                />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Products */}
        {!isRelatedLoading && recommendedProducts.length > 0 && (
          <section className="space-y-5 border-t border-(--color-border) pt-10">
            <div>
              <p className="text-sm font-medium text-(--color-primary)">
                {t("products.recommended")}
              </p>

              <h2 className="mt-1 font-display text-2xl font-bold text-(--color-text-primary)">
                {t("products.recommendedForYou")}
              </h2>

              <p className="mt-2 text-sm text-(--color-text-secondary)">
                {t("products.recommendedDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  viewMode="grid"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}