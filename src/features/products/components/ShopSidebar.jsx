import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShopSidebar({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  maxCatalogPrice,
  sortBy,
  setSortBy,
  clearFilters,
  isMobileFilterOpen,
  t,
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
            {t("shop.filterTitle")}
          </h2>
        </div>
        {/* Categories */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("shop.category")}
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className=" h-11 w-full rounded-xl border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className=" rounded-xl border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] ">
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  <span className="flex items-center gap-2">
                    <span>
                      {category.name === "All" ? t("shop.all") : category.name}
                    </span>
                    <span className=" text-xs text-[var(--color-text-secondary)] ">
                      ({category.count})
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Brand */}
        <div className="space-y-3 border-t border-[var(--color-border)] pt-3">
          <label className=" text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] ">
            {t("shop.sideBar.brands")}
          </label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className=" h-11 w-full rounded-xl border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className=" rounded-xl border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] ">
              {brands.map((brand) => (
                <SelectItem key={brand.name} value={brand.name}>
                  <span className="flex items-center gap-2">
                    <span>
                      {brand.name === "All" ? t("shop.all") : brand.name}
                    </span>

                    <span className="text-xs text-[var(--color-text-secondary)]">
                      ({brand.count})
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Price Range */}
        <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("shop.priceRange")}
          </label>

          {/* Min / Max Inputs */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={t("shop.minPrice")}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-10 bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-sm rounded-xl font-mono"
            />

            <span className="text-[var(--color-text-secondary)] font-mono text-sm">
              -
            </span>

            <Input
              type="number"
              placeholder={t("shop.maxPrice")}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-10 bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-sm rounded-xl font-mono"
            />
          </div>

          {/* Price Slider */}
          <div className="pt-2">
            <Slider
              min={0}
              max={maxCatalogPrice}
              step={1}
              value={[
                Number(minPrice) || 0,
                Number(maxPrice) || maxCatalogPrice,
              ]}
              onValueChange={([min, max]) => {
                setMinPrice(min === 0 ? "" : String(min));
                setMaxPrice(max === maxCatalogPrice ? "" : String(max));
              }}
            />

            <div className="flex justify-between mt-2 text-xs text-[var(--color-text-secondary)]">
              <span>0</span>
              <span>{maxCatalogPrice}</span>
            </div>
          </div>
        </div>
        {/* Sort By */}
        <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {t("shop.sortBy")}
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className=" h-11 w-full rounded-xl border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 ">
              <SelectValue placeholder={t("shop.sort.default")} />
            </SelectTrigger>
            <SelectContent className=" rounded-xl border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-lg ">
              <SelectItem value="Default">{t("shop.sort.default")}</SelectItem>
              <SelectItem value="price_asc">
                {t("shop.sort.priceLowToHigh")}
              </SelectItem>
              <SelectItem value="price_desc">
                {t("shop.sort.priceHighToLow")}
              </SelectItem>
              <SelectItem value="rating">{t("shop.sort.topRated")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Clear Filters */}
        <div className="pt-3 border-t border-[var(--color-border)]">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full rounded-xl border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors flex items-center justify-center gap-2"
          >
            <X className="size-4 text-[var(--color-text-secondary)]" />
            {t("shop.clearAllFilters")}
          </Button>
        </div>
      </div>
    </aside>
  );
}
