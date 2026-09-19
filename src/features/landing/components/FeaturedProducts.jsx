import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import useFeaturedProducts from "../useFeaturedProducts";
import FeaturedProductCard from "./FeaturedProductCard";
import SkeletonCard from "./SkeletonCard";
import { EmptyState, ErrorState } from "./LandingStates";

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const { featuredProducts, isLoading, error, retry } = useFeaturedProducts();

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

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
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

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <FeaturedProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
