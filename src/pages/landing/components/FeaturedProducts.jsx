import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import useFeaturedProducts from "../useFeaturedProducts";
import FeaturedProductCard from "./FeaturedProductCard";
import SkeletonCard from "./SkeletonCard";
import { EmptyState, ErrorState } from "./LandingStates";
import ComingSoonButton from "./ComingSoonButton";

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const { featuredProducts, isLoading, error, retry } =
    useFeaturedProducts();

  if (isLoading) {
    return (
      <section aria-busy="true" role="status" className="mt-16">
        <span className="sr-only">{t("landing.featured.loading")}</span>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
    <section className="mt-16">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-bold text-foreground capitalize">
          {t("landing.featured.title")}
        </h2>

        <ComingSoonButton className="capitalize">
          {t("landing.featured.viewAll")}
          <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </ComingSoonButton>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <FeaturedProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}