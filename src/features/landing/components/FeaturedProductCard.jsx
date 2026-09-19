import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Heart, LoaderCircle, PackageOpen, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { formatCurrency, CURRENCIES } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuth from "@/hooks/useAuth";
import useWishlist from "@/hooks/useWishlist";

const STAR_SLOTS = [1, 2, 3, 4, 5];

function discountPercent(product) {
  const price = Number(product.price);
  const discountPrice = Number(product.discountPrice);

  if (!(price > 0) || !(discountPrice > 0) || discountPrice >= price) {
    return null;
  }

  return Math.round(((price - discountPrice) / price) * 100);
}

/* Partial-fill stars (Amazon/Google style): a row of outline stars with a
   clipped row of filled stars layered on top. The clip is anchored to the
   start edge, so it mirrors correctly in RTL. */
function Stars({ rating, label }) {
  const clamped = Math.min(Math.max(rating, 0), 5);

  return (
    <div className="relative inline-flex" role="img" aria-label={label}>
      <div className="flex gap-px" aria-hidden="true">
        {STAR_SLOTS.map((slot) => (
          <Star key={slot} className="size-3.5 text-(--color-border-strong)" />
        ))}
      </div>

      <div
        className="absolute inset-y-0 start-0 overflow-hidden"
        style={{ width: `${(clamped / 5) * 100}%` }}
        aria-hidden="true"
      >
        {/* w-max stops the row from compressing inside the clip container */}
        <div className="flex w-max gap-px">
          {STAR_SLOTS.map((slot) => (
            <Star
              key={slot}
              className="size-3.5 fill-(--color-warning) text-(--color-warning)"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const productId = product._id || product.id;
  const isFavorite = productId ? isInWishlist(productId) : false;

  const handleWishlistClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

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

  const name = product.name || t("landing.featured.untitled");
  const image = product.images?.[0]?.url;
  const discount = discountPercent(product);

  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice);
  const currentPrice =
    discountPrice > 0 && discountPrice < price ? discountPrice : price;

  const rating = Number(product.rating);
  const hasRating = Number.isFinite(rating) && rating > 0;
  const reviewCount = Number(product.reviewsCount) || 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[transform,box-shadow] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md">
      {/* Stretched link: the whole card is one hit target / one tab stop.
          It carries the accessible name, so the img below is decorative
          (alt="") — the name is read once, not twice. */}
      <Link
        to={`/products/${product._id}`}
        aria-label={t("landing.featured.cardAriaLabel", { name })}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)"
      />

      <div className="pointer-events-none relative aspect-square overflow-hidden bg-(--color-surface-secondary)">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-contain p-3 transition-transform duration-300 motion-safe:group-hover:scale-105 sm:p-4"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center text-(--color-supporting-decorative)"
            aria-hidden="true"
          >
            <PackageOpen className="size-10" />
          </div>
        )}

        {discount !== null && (
          <Badge className="absolute start-2 top-2 max-w-[calc(100%-1rem)] truncate bg-(--color-error) px-2 text-xs tabular-nums text-(--color-on-error)">
            {t("landing.featured.discountOff", { percent: discount })}
          </Badge>
        )}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className="absolute end-2 top-2 z-20">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleWishlistClick}
              disabled={isWishlistLoading}
              aria-label={
                isFavorite
                  ? t("wishlist.removeFromWishlist")
                  : t("wishlist.addToWishlist", { name })
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
              : t("wishlist.addToWishlist", { name })}
          </p>
        </TooltipContent>
      </Tooltip>

      {/* Body — pointer-events-none so the stretched link handles clicks */}
      <div className="pointer-events-none flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
          {name}
        </h3>

        {hasRating && (
          <div className="flex items-center gap-1.5">
            <Stars
              rating={rating}
              label={t("landing.featured.ratingAria", {
                rating: rating.toFixed(1),
                count: reviewCount,
              })}
            />

            <span className="text-xs tabular-nums text-muted-foreground">
              ({formatNumber(reviewCount, i18n.language)})
            </span>
          </div>
        )}

        <div className="mt-auto flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 pt-1 sm:gap-x-3">
          <span className="font-display text-base font-bold tabular-nums text-foreground sm:text-xl">
            {formatCurrency(currentPrice, CURRENCIES.EGP, i18n.language)}
          </span>

          {discount !== null && (
            <span className="text-xs tabular-nums text-muted-foreground line-through sm:text-sm">
              {formatCurrency(price, CURRENCIES.EGP, i18n.language)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
