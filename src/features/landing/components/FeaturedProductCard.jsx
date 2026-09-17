import { Link } from "react-router";
import { Heart, PackageOpen, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CURRENCY = "USD"; // TODO: hoist to shared config — third copy of this

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
          <Badge className="absolute start-2 top-2 max-w-[calc(100%-1rem)] truncate bg-(--color-error) px-2 text-xs tabular-nums text-on-error">
            {t("landing.featured.discountOff", { percent: discount })}
          </Badge>
        )}
      </div>

      {/* Wishlist — disabled until the real wishlist API exists. A heart
          that toggles locally but doesn't persist would mislead users. */}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="absolute end-2 top-2 z-20">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label={t("landing.featured.toggleWishlist", { name })}
              className="cursor-not-allowed bg-(--color-surface)/80 backdrop-blur-sm opacity-60 hover:bg-(--color-surface)"
            >
              <Heart aria-hidden="true" />
            </Button>
          </span>
        </TooltipTrigger>

        <TooltipContent side="top">
          <p className="text-xs">{t("landing.comingSoon")}</p>
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
            {formatCurrency(currentPrice, CURRENCY, i18n.language)}
          </span>

          {discount !== null && (
            <span className="text-xs tabular-nums text-muted-foreground line-through sm:text-sm">
              {formatCurrency(price, CURRENCY, i18n.language)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
