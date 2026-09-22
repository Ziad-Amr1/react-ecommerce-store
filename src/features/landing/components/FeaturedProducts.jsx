import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import useFeaturedProducts from "../useFeaturedProducts";
import ProductCard from "@/features/products/components/ProductCard";
import ProductSkeleton from "@/features/products/components/ProductCardSkeleton";
import { EmptyState, ErrorState } from "./LandingStates";

const PER_VIEW_MOBILE = 1;
const PER_VIEW_SM = 2;
const PER_VIEW_LG = 4;
const SM_BREAKPOINT = "(min-width: 40rem)"; // Tailwind `sm`
const LG_BREAKPOINT = "(min-width: 64rem)"; // Tailwind `lg`

export default function FeaturedProducts() {
  const { t, i18n } = useTranslation();
  const { featuredProducts, isLoading, error, retry } = useFeaturedProducts();

  const [perView, setPerView] = useState(PER_VIEW_LG);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return undefined;
    }
    const smMq = window.matchMedia(SM_BREAKPOINT);
    const lgMq = window.matchMedia(LG_BREAKPOINT);
    const sync = () => {
      if (lgMq.matches) {
        setPerView(PER_VIEW_LG);
      } else if (smMq.matches) {
        setPerView(PER_VIEW_SM);
      } else {
        setPerView(PER_VIEW_MOBILE);
      }
    };
    sync();
    smMq.addEventListener("change", sync);
    lgMq.addEventListener("change", sync);
    return () => {
      smMq.removeEventListener("change", sync);
      lgMq.removeEventListener("change", sync);
    };
  }, []);

  const [page, setPage] = useState(0);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(featuredProducts.length / perView)),
    [featuredProducts.length, perView],
  );
  const clampedPage = Math.min(page, totalPages - 1);
  const goPrevious = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < featuredProducts.length; i += perView) {
      result.push(featuredProducts.slice(i, i + perView));
    }
    return result;
  }, [featuredProducts, perView]);

  const isRtl = i18n.dir?.() === "rtl";
  const trackOffset = (isRtl ? clampedPage : -clampedPage) * 100;

  if (isLoading) {
    return (
      <section aria-busy="true" role="status" className="mt-16">
        <span className="sr-only">{t("landing.featured.loading")}</span>

        {/* Mirrors the real header: eyebrow + title left, link right */}
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-48" />
          </div>

          <Skeleton className="h-5 w-20" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <ProductSkeleton viewMode="compact" />
          <ProductSkeleton viewMode="compact" />
          <ProductSkeleton viewMode="compact" />
          <ProductSkeleton viewMode="compact" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-16">
        <ErrorState onRetry={retry} />
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="mt-16">
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="mt-16" aria-labelledby="featured-products-title">
      {/* flex-wrap: a long German "Alle Produkte ansehen" wraps instead of
          colliding with the title on narrow screens */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-6">
        <div>
          <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-(--color-text-secondary)">
            {t("landing.featured.eyebrow")}
          </p>

          <h2
            id="featured-products-title"
            className="font-display text-xl font-bold text-foreground sm:text-2xl"
          >
            {t("landing.featured.title")}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 rtl:flex-row">
          {totalPages > 1 && (
            <>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                  onClick={goPrevious}
                  disabled={clampedPage === 0}
                  aria-label={t("landing.featured.previous")}
                >
                  <ChevronLeft
                    className="size-4 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                  onClick={goNext}
                  disabled={clampedPage === totalPages - 1}
                  aria-label={t("landing.featured.next")}
                >
                  <ChevronRight
                    className="size-4 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Button>
              </div>

              <span
                className="text-sm tabular-nums text-(--color-text-secondary)"
                aria-live="polite"
              >
                {t("landing.featured.pageCount", {
                  current: clampedPage + 1,
                  total: totalPages,
                })}
              </span>
            </>
          )}

          {/* Swap back to ComingSoonButton ONLY while /products genuinely
            doesn't exist — a "view all" that 404s is worse than no link. */}
          <Link
            to="/products"
            className="group/link inline-flex shrink-0 items-center gap-1.5 pb-0.5 text-sm font-medium text-(--color-link) underline-offset-4 hover:text-(--color-link-hover) hover:underline"
          >
            {t("landing.featured.viewAll")}

            <ArrowRight
              className="size-4 transition-transform motion-safe:group-hover/link:translate-x-0.5 rtl:-scale-x-100 rtl:motion-safe:group-hover/link:-translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      <div
        className="overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label={t("landing.featured.title")}
      >
        <div
          className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(${trackOffset}%)` }}
        >
          {pages.map((pageProducts, index) => (
            <div
              key={pageProducts.map((p) => p._id).join("-")}
              className="grid w-full shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
              aria-hidden={index !== clampedPage}
            >
              {pageProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  viewMode="compact"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
