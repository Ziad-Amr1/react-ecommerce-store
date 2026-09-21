import { useEffect, useMemo } from "react";
import SEO from "@/components/SEO/SEO";

import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import useProducts from "@/features/products/useProducts";
import useCatalogProducts from "@/features/products/useCatalogProducts";
import useShopFilters from "@/features/products/useShopFilters";
import ProductCard from "@/features/products/components/ProductCard";
import ProductPagination from "@/features/products/components/ProductPagination";

import ShopSearchBar from "@/features/products/components/ShopSearchBar";
import ShopSidebar from "@/features/products/components/ShopSidebar";
import ActiveFiltersBar from "@/features/products/components/ActiveFiltersBar";
import ProductSkeleton from "@/features/products/components/ProductCardSkeleton";

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

  const {
    catalogProducts,
    isCatalogLoading,
    catalogError,
    fetchCatalogProducts,
  } = useCatalogProducts();

  const maxCatalogPrice = useMemo(() => {
    if (!catalogProducts.length) {
      return 0;
    }

    return Math.max(
      ...catalogProducts.map((product) => Number(product.price) || 0),
    );
  }, [catalogProducts]);

  const [searchParams, setSearchParams] = useSearchParams();
  // const filters = useShopFilters(products);

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const PAGE_LIMIT = 12;
  const limitFromUrl = Number(searchParams.get("limit")) || PAGE_LIMIT;

  const filters = useShopFilters(catalogProducts);

  useEffect(() => {}, [
    searchParams,
    filters.applied,
    filters.hasActiveFilters,
  ]);

  // const previousAppliedRef = useRef(filters.applied);

  // Prevent catalog from being fetched more than once
  // const catalogFetchedRef = useRef(false);

  // useEffect(() => {
  //   if (catalogFetchedRef.current) {
  //     return;
  //   }
  //   if (isLoading) {
  //     return;
  //   }
  //   if (!totalProducts || totalProducts <= 0) {
  //     return;
  //   }
  //   catalogFetchedRef.current = true;
  //   fetchCatalogProducts(totalProducts);
  // }, [isLoading, totalProducts, fetchCatalogProducts]);

  useEffect(() => {
    fetchCatalogProducts();
  }, [fetchCatalogProducts]);

  // uRL synchronization

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    const currentSearch = params.get("search") || "";
    const currentCategory = params.get("category") || "All";
    const currentBrand = params.get("brand") || "All";
    const currentMinPrice = params.get("minPrice") || "";
    const currentMaxPrice = params.get("maxPrice") || "";
    const currentSort = params.get("sort") || "Default";

    const filtersMatchUrl =
      currentSearch === filters.applied.search &&
      currentCategory === filters.applied.category &&
      currentBrand === filters.applied.brand &&
      currentMinPrice === filters.applied.minPrice &&
      currentMaxPrice === filters.applied.maxPrice &&
      currentSort === filters.applied.sortBy;

    if (filtersMatchUrl) {
      return;
    }

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.set("page", "1");
      params.set("limit", String(limitFromUrl));

      if (filters.applied.search) {
        params.set("search", filters.applied.search);
      } else {
        params.delete("search");
      }

      if (filters.applied.category !== "All") {
        params.set("category", filters.applied.category);
      } else {
        params.delete("category");
      }

      if (filters.applied.brand !== "All") {
        params.set("brand", filters.applied.brand);
      } else {
        params.delete("brand");
      }

      if (filters.applied.minPrice !== "") {
        params.set("minPrice", filters.applied.minPrice);
      } else {
        params.delete("minPrice");
      }

      if (filters.applied.maxPrice !== "") {
        params.set("maxPrice", filters.applied.maxPrice);
      } else {
        params.delete("maxPrice");
      }

      if (filters.applied.sortBy !== "Default") {
        params.set("sort", filters.applied.sortBy);
      } else {
        params.delete("sort");
      }

      return params;
    });
  }, [filters.applied, searchParams, setSearchParams, limitFromUrl]);

  useEffect(() => {
    fetchProducts(pageFromUrl, limitFromUrl, filters.applied);
  }, [
    pageFromUrl,
    limitFromUrl,
    filters.applied,
    fetchProducts,
    // setSearchParams,
  ]);

  // useEffect(() => {
  //   console.log("URL category:", categoryFromUrl);
  //   console.log("Applied category:", filters.applied.category);
  // }, [categoryFromUrl, filters.applied.category]);

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.set("page", String(page));
      params.set("limit", String(PAGE_LIMIT));

      return params;
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resultsCount = totalProducts != null ? totalProducts : products.length;
  const resultsLabelKey =
    totalProducts != null ? "shop.results" : "shop.showing";

  return (
    <>
      <SEO
        title={t("seo.shop.title")}
        description={t("seo.shop.description")}
        url="/products"
      />

      <div className="min-h-screen bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] font-body transition-colors duration-300">
        <div className="w-full mx-auto px-6 sm:px-8 lg:px-10 py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
            <div>
              <h1 className="text-3xl font-bold font-display tracking-tight text-[var(--color-text-primary)]">
                {t("shop.title")}
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
              {t("shop.sideBar.filterTitle")}
              {filters.hasActiveFilters && (
                <span className="size-2 rounded-full bg-[var(--color-primary)]" />
              )}
            </Button>
          </div>

          {/* Main Section */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Component */}
            <ShopSidebar
              categories={filters.categories}
              brands={filters.brands}
              selectedCategory={filters.applied.category}
              setSelectedCategory={filters.selectCategory}
              selectedBrand={filters.applied.brand}
              setSelectedBrand={filters.selectBrand}
              minPrice={filters.minPrice}
              setMinPrice={filters.setMinPrice}
              maxPrice={filters.maxPrice}
              setMaxPrice={filters.setMaxPrice}
              maxCatalogPrice={maxCatalogPrice}
              sortBy={filters.sortBy}
              setSortBy={filters.changeSort}
              clearFilters={filters.clearFilters}
              isMobileFilterOpen={filters.isMobileFilterOpen}
              t={t}
            />

            {/* Feed Container */}
            <main className="flex-1 space-y-6">
              {/* Search Bar UI */}
              <ShopSearchBar
                searchQuery={filters.searchQuery}
                setSearchQuery={filters.setSearchQuery}
                viewMode={filters.viewMode}
                setViewMode={filters.setViewMode}
              />
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
                    onClick={() =>
                      fetchProducts(pageFromUrl, limitFromUrl, filters.applied)
                    }
                    className="mt-4"
                    variant="outline"
                    size="sm"
                  >
                    {t("products.retry")}
                  </Button>
                </div>
              ) : (
                <>
                  {/* catalog loading status */}
                  <div className="mb-4 flex items-center justify-between">
                    {isCatalogLoading && (
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {t("loadingFilters")}
                      </span>
                    )}
                  </div>
                  {/* Catalog error */}
                  {catalogError && (
                    <p className="mb-4 text-sm text-[var(--color-error)]">
                      {t("errors.loadFilters")}
                    </p>
                  )}
                  {/* No products */}
                  {products.length === 0 ? (
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
                          {t("shop.clearAllFilters")}
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
                </>
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
    </>
  );
}
