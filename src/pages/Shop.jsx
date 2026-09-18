import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import useProducts from "@/features/products/useProducts";
import useShopFilters from "@/features/products/useShopFilters";
import ProductCard from "@/features/products/components/ProductCard";
import ProductPagination from "@/features/products/components/ProductPagination";

import ShopSearchBar from "@/features/products/components/ShopSearchBar";
import ShopSidebar from "@/features/products/components/ShopSidebar";
import ActiveFiltersBar from "@/features/products/components/ActiveFiltersBar";
import ProductSkeleton from "@/features/products/components/ProductCardSkeleton";
import useDocumentMeta from "@/hooks/useDocumentMeta";

export default function Shop() {
  const { t } = useTranslation();
  const {
    products,
    currentPage,
    totalPages,
    totalProducts,
    isLoading,
    isPaginationLoading,
    apiError,
    fetchProducts,
  } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useShopFilters(products);

  // Derive the price slider's upper bound from the prices actually returned on
  // the current page, never by fetching the whole catalog. Always accounting
  // for an applied max price keeps a user-set value inside the range.
  const pageMaxPrice = products.length
    ? Math.max(...products.map((p) => Number(p.price) || 0))
    : 0;
  const sliderMax = Math.max(
    pageMaxPrice,
    Number(filters.applied.maxPrice) || 0,
    100,
  );

  useDocumentMeta({
    title: t("shop.title"),
    description: t("shop.subtitle"),
  });

  // When the applied filters change (not on first render), go back to
  // page 1 so the user sees the start of the filtered results.
  const didMount = useRef(false);
  const prevApplied = useRef(filters.applied);
  const pendingPageReset = useRef(false);
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const appliedChanged = prevApplied.current !== filters.applied;
    prevApplied.current = filters.applied;

    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (appliedChanged && pageFromUrl !== 1) {
      pendingPageReset.current = true;
      setSearchParams({ page: "1" });
    }
  }, [filters.applied, setSearchParams, pageFromUrl]);

  // Filters run server-side; the page number lives in the URL. When a filter
  // change also resets the page, skip the intermediate fetch so the page is
  // fetched once, not twice.
  useEffect(() => {
    if (pendingPageReset.current) {
      pendingPageReset.current = false;
      return;
    }

    fetchProducts(pageFromUrl, filters.applied);
  }, [searchParams, filters.applied, fetchProducts, pageFromUrl]);

  const handlePageChange = (page) => {
    setSearchParams({ page: String(page) });
  };

  const resultsCount =
    totalProducts != null ? totalProducts : products.length;
  const resultsLabelKey =
    totalProducts != null ? "shop.results" : "shop.showing";

  return (
    <div className="min-h-screen bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] font-body transition-colors duration-300">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-[var(--color-text-primary)]">
              {t("shop.title", "Shop")}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {t("shop.subtitle")}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              filters.setIsMobileFilterOpen(!filters.isMobileFilterOpen)
            }
            className="md:hidden flex items-center gap-2 rounded-xl border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]"
          >
            <SlidersHorizontal className="size-4" />
            {t("shop.filterTitle", "Filters")}
            {filters.hasActiveFilters && (
              <span className="size-2 rounded-full bg-[var(--color-primary)]" />
            )}
          </Button>
        </div>

        {/* Search Bar UI */}
        <ShopSearchBar
          searchQuery={filters.searchQuery}
          setSearchQuery={filters.setSearchQuery}
          viewMode={filters.viewMode}
          setViewMode={filters.setViewMode}
        />

        {/* Main Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Component */}
          <ShopSidebar
            categories={filters.categories}
            selectedCategory={filters.applied.category}
            setSelectedCategory={filters.selectCategory}
            brands={filters.brands}
            selectedBrand={filters.applied.brand}
            setSelectedBrand={filters.selectBrand}
            minPrice={filters.minPrice}
            setMinPrice={filters.setMinPrice}
            maxPrice={filters.maxPrice}
            setMaxPrice={filters.setMaxPrice}
            priceCeiling={sliderMax}
            sortBy={filters.sortBy}
            setSortBy={filters.changeSort}
            clearFilters={filters.clearFilters}
            isMobileFilterOpen={filters.isMobileFilterOpen}
            t={t}
          />

          {/* Feed Container */}
          <main className="flex-1 space-y-6">
            {/* Active Filters Bar Component */}
            <ActiveFiltersBar
              resultsCount={resultsCount}
              resultsLabelKey={resultsLabelKey}
              applied={filters.applied}
              getSortLabel={filters.getSortLabel}
              hasActiveFilters={filters.hasActiveFilters}
              clearFilters={filters.clearFilters}
              selectCategory={filters.selectCategory}
              selectBrand={filters.selectBrand}
              setSearchQuery={filters.setSearchQuery}
              setMinPrice={filters.setMinPrice}
              setMaxPrice={filters.setMaxPrice}
              changeSort={filters.changeSort}
            />

            {/* Product Feed */}
            {isLoading ? (
              <div
                className={`grid gap-6 ${filters.viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} viewMode={filters.viewMode} />
                ))}
              </div>
            ) : apiError ? (
              <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
                <h3 className="text-base font-semibold text-[var(--color-error)]">
                  {t("products.loadErrorTitle")}
                </h3>
                <Button
                  onClick={() => fetchProducts(currentPage, filters.applied)}
                  className="mt-4"
                  variant="outline"
                  size="sm"
                >
                  {t("products.retry")}
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
                <ShoppingBag className="size-12 text-[var(--color-text-secondary)] opacity-40 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {t("products.noProductsFound")}
                </h3>
                {filters.hasActiveFilters && (
                  <Button
                    onClick={filters.clearFilters}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    {t("shop.clearAllFilters", "Clear All Filters")}
                  </Button>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-6 ${filters.viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    viewMode={filters.viewMode}
                  />
                ))}
              </div>
            )}
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              isLoading={isPaginationLoading}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>
    </div>
  );
}