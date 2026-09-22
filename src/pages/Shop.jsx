import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal, ShoppingBag, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import useProducts from "@/features/products/useProducts";
import useProductCatalog from "@/features/products/useProductCatalog";
import useShopFilters from "@/features/products/useShopFilters";
import { applyFiltersToCatalog } from "@/features/products/clientFilter";
import ProductCard from "@/features/products/components/ProductCard";
import ProductPagination from "@/features/products/components/ProductPagination";
import ShopSearchBar from "@/features/products/components/ShopSearchBar";
import ShopSidebar from "@/features/products/components/ShopSidebar";
import ActiveFiltersBar from "@/features/products/components/ActiveFiltersBar";
import ProductSkeleton from "@/features/products/components/ProductCardSkeleton";
import SEO from "@/components/SEO/SEO";

const PAGE_LIMIT = 12;

const EMPTY_FILTERS = {
  search: "",
  category: "All",
  subcategory: "All",
  brand: "All",
  minPrice: "",
  maxPrice: "",
  sortBy: "Default",
};

function syncFiltersToUrl(snapshot, applied) {
  const params = new URLSearchParams(snapshot);
  const fields = {
    search: applied.search,
    category: applied.category,
    subcategory: applied.subcategory,
    brand: applied.brand,
    minPrice: applied.minPrice,
    maxPrice: applied.maxPrice,
  };
  Object.entries(fields).forEach(([key, value]) => {
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });
  if (applied.sortBy && applied.sortBy !== "Default") {
    params.set("sort", applied.sortBy);
  } else {
    params.delete("sort");
  }
  return params;
}

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

  const catalog = useProductCatalog();

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  // Filters can arrive via the URL (deep links, shared links, subcategory chips).
  const initialFilters = {
    ...EMPTY_FILTERS,
    search: searchParams.get("search") ?? EMPTY_FILTERS.search,
    category: searchParams.get("category") ?? EMPTY_FILTERS.category,
    subcategory: searchParams.get("subcategory") ?? EMPTY_FILTERS.subcategory,
    brand: searchParams.get("brand") ?? EMPTY_FILTERS.brand,
    minPrice: searchParams.get("minPrice") ?? EMPTY_FILTERS.minPrice,
    maxPrice: searchParams.get("maxPrice") ?? EMPTY_FILTERS.maxPrice,
    sortBy: searchParams.get("sort") ?? EMPTY_FILTERS.sortBy,
  };

  const filters = useShopFilters(products, catalog.products, initialFilters);

  // The full catalog (cached in localStorage) powers the sidebar counts, the
  // price slider ceiling, and instant client-side subcategory filtering.
  const isSubcategoryMode = filters.applied.subcategory !== "All";

  const pageMaxPrice = products.length
    ? Math.max(...products.map((p) => Number(p.price) || 0))
    : 0;
  const sliderMax = Math.max(
    catalog.maxPrice,
    pageMaxPrice,
    Number(filters.applied.maxPrice) || 0,
    100,
  );

  // Client-side results used when a subcategory filter is active, because the
  // backend filters by category but not by subcategory.
  const clientResults = useMemo(() => {
    if (!isSubcategoryMode || catalog.products.length === 0) {
      return { items: [], total: 0, totalPages: 1 };
    }
    return applyFiltersToCatalog(catalog.products, filters.applied, {
      page: pageFromUrl,
      pageSize: PAGE_LIMIT,
    });
  }, [isSubcategoryMode, catalog.products, filters.applied, pageFromUrl]);

  const showClientResults = isSubcategoryMode && catalog.products.length > 0;
  const feedItems = showClientResults ? clientResults.items : products;
  const feedTotal = showClientResults
    ? clientResults.total
    : totalProducts != null
      ? totalProducts
      : products.length;
  const feedTotalPages = showClientResults ? clientResults.totalPages : totalPages;
  const feedLoading = showClientResults
    ? catalog.products.length === 0 && catalog.isLoading
    : isLoading;
  const feedError = showClientResults ? null : apiError;
  const resultsLabelKey =
    showClientResults || totalProducts != null ? "shop.results" : "shop.showing";

  // URL synchronisation: applied filters are reflected in the URL so pages are
  // shareable, and a filter change resets to page 1 atomically.
  const didMountUrl = useRef(false);
  const prevApplied = useRef(filters.applied);
  const pendingPageReset = useRef(false);

  useEffect(() => {
    const appliedChanged = prevApplied.current !== filters.applied;
    prevApplied.current = filters.applied;

    if (!didMountUrl.current) {
      didMountUrl.current = true;
      return;
    }

    const snapshot = new URLSearchParams(searchParams);
    if (appliedChanged && pageFromUrl !== 1) {
      pendingPageReset.current = true;
      snapshot.set("page", "1");
    }
    const next = syncFiltersToUrl(snapshot, filters.applied);
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [filters.applied, searchParams, setSearchParams, pageFromUrl]);

  // Filters run server-side except for subcategory (client-side over the cached
  // catalog). The page number lives in the URL; when a filter change also resets
  // the page, skip the intermediate fetch so the page is fetched once.
  useEffect(() => {
    if (isSubcategoryMode) {
      return;
    }
    if (pendingPageReset.current) {
      pendingPageReset.current = false;
      return;
    }
    fetchProducts(pageFromUrl, filters.applied);
  }, [pageFromUrl, filters.applied, fetchProducts, isSubcategoryMode]);

  const handlePageChange = (page) => {
    setSearchParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-(--color-text-primary) font-body transition-colors duration-300">
      <SEO
        title={t("shop.title")}
        description={t("shop.subtitle")}
        url="/products"
      />
      <div className="py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-(--color-border)">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-(--color-text-primary)">
              {t("shop.title", "Shop")}
            </h1>
            <p className="text-sm text-(--color-text-secondary) mt-1">
              {t("shop.subtitle")}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              filters.setIsMobileFilterOpen(!filters.isMobileFilterOpen)
            }
            className="md:hidden flex items-center gap-2 rounded-xl border-(--color-border) bg-(--color-surface) text-(--color-text-primary)"
          >
            <SlidersHorizontal className="size-4" />
            {t("shop.filterTitle", "Filters")}
            {filters.hasActiveFilters && (
              <span className="size-2 rounded-full bg-(--color-primary)" />
            )}
          </Button>
        </div>

        {/* Main Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Component */}
          <ShopSidebar
            categories={filters.categories}
            selectedCategory={filters.draft.category}
            setSelectedCategory={filters.selectCategory}
            subcategories={filters.subcategories}
            selectedSubcategory={filters.draft.subcategory}
            setSelectedSubcategory={filters.selectSubcategory}
            brands={filters.brands}
            selectedBrand={filters.draft.brand}
            setSelectedBrand={filters.selectBrand}
            minPrice={filters.minPrice}
            setMinPrice={filters.setMinPrice}
            maxPrice={filters.maxPrice}
            setMaxPrice={filters.setMaxPrice}
            priceCeiling={sliderMax}
            sortBy={filters.sortBy}
            setSortBy={filters.changeSort}
            applyFilters={filters.applyFilters}
            clearFilters={filters.clearFilters}
            isMobileFilterOpen={filters.isMobileFilterOpen}
            t={t}
          />

          {/* Feed Container */}
          <div className="flex-1 space-y-6">
            {/* Search Bar UI */}
            <ShopSearchBar
              searchQuery={filters.searchQuery}
              setSearchQuery={filters.setSearchQuery}
              onSubmit={filters.applyFilters}
              viewMode={filters.viewMode}
              setViewMode={filters.setViewMode}
            />

            {/* Active Filters Bar Component */}
            <ActiveFiltersBar
              resultsCount={feedTotal}
              resultsLabelKey={resultsLabelKey}
              applied={filters.applied}
              getSortLabel={filters.getSortLabel}
              hasActiveFilters={filters.hasActiveFilters}
              clearFilters={filters.clearFilters}
              clearCategory={filters.clearCategory}
              clearSubcategory={filters.clearSubcategory}
              clearBrand={filters.clearBrand}
              clearPrice={filters.clearPrice}
              clearSort={filters.clearSort}
              clearSearch={filters.clearSearch}
            />

            {/* Catalog refresh status */}
            {catalog.isRefreshing && (
              <p className="flex items-center gap-1.5 text-xs text-(--color-text-secondary)">
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                {t("shop.catalogRefreshing")}
              </p>
            )}

            {/* Product Feed */}
            {feedLoading ? (
              <div
                className={`grid gap-6 ${filters.viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} viewMode={filters.viewMode} />
                ))}
              </div>
            ) : feedError ? (
              <div className="text-center py-16 bg-(--color-surface) rounded-2xl border border-(--color-border)">
                <h3 className="text-base font-semibold text-(--color-error)">
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
            ) : feedItems.length === 0 ? (
              <div className="text-center py-16 bg-(--color-surface) rounded-2xl border border-(--color-border)">
                <ShoppingBag className="size-12 text-(--color-text-secondary) opacity-40 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-(--color-text-primary)">
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
                {feedItems.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    viewMode={filters.viewMode}
                  />
                ))}
              </div>
            )}
            <ProductPagination
              currentPage={pageFromUrl}
              totalPages={feedTotalPages}
              isLoading={showClientResults ? false : isPaginationLoading}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
