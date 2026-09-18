import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function ShopSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  brands,
  selectedBrand,
  setSelectedBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  priceCeiling,
  sortBy,
  setSortBy,
  clearFilters,
  isMobileFilterOpen,
  t
}) {
  // Keep the range slider thumbs valid: within [0, priceCeiling] and ordered.
  const rawMin = Number(minPrice) || 0;
  const rawMax = maxPrice !== "" ? Number(maxPrice) : priceCeiling;
  const sliderMin = Math.max(0, Math.min(rawMin, priceCeiling));
  const sliderMax = Math.max(
    sliderMin,
    Math.min(Number.isFinite(rawMax) ? rawMax : priceCeiling, priceCeiling),
  );

  return (
    <aside
      className={`w-full flex-shrink-0 space-y-6 md:sticky md:top-20 md:max-h-[calc(100dvh_-_6rem)] md:w-72 md:self-start md:overflow-y-auto md:overscroll-contain ${
        isMobileFilterOpen ? "block" : "hidden md:block"
      }`}
    >
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 space-y-6 shadow-sm">
        <div className="pb-3 border-b border-[var(--color-border)]">
          <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-[var(--color-primary)]" />
            {t("shop.filterTitle", "Filter Products")}
          </h2>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("shop.category", "Categories")}
          </label>
          <div className="space-y-1.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-[var(--color-surface-secondary)] text-[var(--color-primary)] border border-[var(--color-border)] font-semibold"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <span>{t(`landing.categories.names.${cat.name.toLowerCase()}`, cat.name)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    isSelected ? "bg-[var(--color-surface)] text-[var(--color-text-primary)]" : "bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brands */}
        <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("shop.brand", "Brand")}
          </label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              aria-label={t("shop.brand", "Brand")}
              className="w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] focus:outline-none cursor-pointer font-body"
            >
              {brands.map((brand) => (
                <option key={brand.name} value={brand.name}>
                  {brand.name === "All"
                    ? t("shop.allBrands", "All Brands")
                    : brand.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("shop.priceRange", "Price Range")}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={t("shop.minPrice", "Min")}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-10 bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-sm rounded-xl font-mono"
            />
            <span className="text-[var(--color-text-secondary)] font-mono text-sm">-</span>
            <Input
              type="number"
              placeholder={t("shop.maxPrice", "Max")}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-10 bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-sm rounded-xl font-mono"
            />
          </div>

          {priceCeiling > 0 && (
            <Slider
              min={0}
              max={priceCeiling}
              step={Math.max(1, Math.round(priceCeiling / 100))}
              value={[sliderMin, sliderMax]}
              onValueChange={([nextMin, nextMax]) => {
                setMinPrice(String(nextMin));
                setMaxPrice(String(nextMax));
              }}
              aria-label={t("shop.priceRange", "Price Range")}
            />
          )}
        </div>

        {/* Sort By */}
        <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("shop.sortBy", "Sort By")}
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] focus:outline-none cursor-pointer font-body"
            >
              <option value="Default">{t("shop.sortDefault", "Default")}</option>
              <option value="price_asc">{t("shop.sortLowHigh", "Price: Low to High")}</option>
              <option value="price_desc">{t("shop.sortHighLow", "Price: High to Low")}</option>
              <option value="rating">{t("shop.sortTopRated", "Top Rated")}</option>
            </select>
            <ChevronDown className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="pt-3 border-t border-[var(--color-border)]">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full rounded-xl border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors flex items-center justify-center gap-2"
          >
            <X className="size-4 text-[var(--color-text-secondary)]" />
            {t("shop.clearAllFilters", "Clear All Filters")}
          </Button>
        </div>
      </div>
    </aside>
  );
}