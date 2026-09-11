import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ShopSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  clearFilters,
  isMobileFilterOpen,
  t
}) {
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
            {t("filter_title", "Filter Products")}
          </h2>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("category", "Categories")}
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
                  <span>{t(`categories.${cat.name.toLowerCase()}`, cat.name)}</span>
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

        {/* Price Range */}
        <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("price_range", "Price Range")}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={t("min_price", "Min")}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-10 bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-sm rounded-xl font-mono"
            />
            <span className="text-[var(--color-text-secondary)] font-mono text-sm">-</span>
            <Input
              type="number"
              placeholder={t("max_price", "Max")}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-10 bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-sm rounded-xl font-mono"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("sort_by", "Sort By")}
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] focus:outline-none cursor-pointer font-body"
            >
              <option value="Default">{t("sort_default", "Default")}</option>
              <option value="price_asc">{t("sort_low_high", "Price: Low to High")}</option>
              <option value="price_desc">{t("sort_high_low", "Price: High to Low")}</option>
              <option value="rating">{t("sort_top_rated", "Top Rated")}</option>
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
            {t("clear_all_filters", "Clear All Filters")}
          </Button>
        </div>
      </div>
    </aside>
  );
}