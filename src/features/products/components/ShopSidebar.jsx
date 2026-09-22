import { SlidersHorizontal, Check, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABILITY_OPTIONS } from "@/features/products/useShopFilters";

export default function ShopSidebar(props) {
  const {
    isMobileFilterOpen,
    setIsMobileFilterOpen = () => {},
    applyFilters,
  } = props;

  // The mobile filter panel slides in from the reading-ended side (the end
  // side) so it mirrors with the language: right in LTR, left in RTL.
  const isRtl =
    typeof document !== "undefined" &&
    document.documentElement.dir === "rtl";

  const applyAndClose = () => {
    applyFilters();
    setIsMobileFilterOpen(false);
  };

  return (
    <>
      {/* Static sidebar (md+): column of filters pinned in the layout flow */}
      <aside className="hidden w-full flex-shrink-0 space-y-6 md:block md:sticky md:top-20 md:max-h-[calc(100dvh_-_6rem)] md:w-72 md:self-start md:overflow-y-auto md:overscroll-contain">
        <ShopFilterCard {...props} />
      </aside>

      {/* Mobile filter drawer: slides from the end side, RTL/LTR aware */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent
          side={isRtl ? "left" : "right"}
          showCloseButton={false}
          className="w-[85vw] sm:max-w-sm flex flex-col p-0 gap-0"
        >
          <SheetHeader className="flex flex-row items-center justify-between gap-2 border-b p-4 text-start">
            <SheetTitle className="flex items-center gap-2 font-display text-lg font-bold text-(--color-text-primary)">
              <SlidersHorizontal className="size-5 text-(--color-primary)" />
              {props.t("shop.filterTitle", "Filter Products")}
            </SheetTitle>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer"
                aria-label={props.t("common.close", "Close")}
              >
                <X className="size-4" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <ShopFilterCard {...props} applyFilters={applyAndClose} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function ShopFilterCard({
  categories,
  selectedCategory,
  setSelectedCategory,
  subcategories,
  selectedSubcategory,
  setSelectedSubcategory,
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
  availability,
  setAvailability,
  discount,
  setDiscount,
  applyFilters,
  clearFilters,
  t,
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
    <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-5 space-y-6 shadow-sm">
      <div className="pb-3 border-b border-(--color-border)">
        <h2 className="font-display text-lg font-bold text-(--color-text-primary) flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-(--color-primary)" />
          {t("shop.filterTitle", "Filter Products")}
        </h2>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
          {t("shop.category", "Categories")}
        </label>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-(--color-surface-secondary) text-(--color-primary) border border-(--color-border) font-semibold"
                    : "text-(--color-text-secondary) hover:bg-(--color-surface-secondary) hover:text-(--color-text-primary)"
                }`}
              >
                <span>{t(`landing.categories.names.${cat.name.toLowerCase()}`, cat.name)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  isSelected ? "bg-(--color-surface) text-(--color-text-primary)" : "bg-(--color-surface-secondary) text-(--color-text-secondary)"
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategories — shown once a category is selected */}
      {selectedCategory !== "All" && (
        <div className="space-y-3 pt-3 border-t border-(--color-border)">
          <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
            {t("shop.subcategory", "Subcategory")}
          </label>
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger aria-label={t("shop.subcategory", "Subcategory")} className="w-full h-10 rounded-xl border-(--color-border) bg-(--color-surface-secondary) px-3.5 text-sm font-medium text-(--color-text-primary)">
              <SelectValue placeholder={t("shop.allSubcategories", "All Subcategories")} />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((sub) => (
                <SelectItem key={sub.name} value={sub.name}>
                  {sub.name === "All"
                    ? t("shop.allSubcategories", "All Subcategories")
                    : sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Brands */}
      <div className="space-y-3 pt-3 border-t border-(--color-border)">
        <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
          {t("shop.brand", "Brand")}
        </label>
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger aria-label={t("shop.brand", "Brand")} className="w-full h-10 rounded-xl border-(--color-border) bg-(--color-surface-secondary) px-3.5 text-sm font-medium text-(--color-text-primary)">
            <SelectValue placeholder={t("shop.allBrands", "All Brands")} />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.name} value={brand.name}>
                {brand.name === "All"
                  ? t("shop.allBrands", "All Brands")
                  : brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-3 border-t border-(--color-border)">
        <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
          {t("shop.priceRange", "Price Range")}
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={t("shop.minPrice", "Min")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-10 bg-(--color-surface-secondary) border-(--color-border) text-sm rounded-xl font-mono"
          />
          <span className="text-(--color-text-secondary) font-mono text-sm">-</span>
          <Input
            type="number"
            placeholder={t("shop.maxPrice", "Max")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-10 bg-(--color-surface-secondary) border-(--color-border) text-sm rounded-xl font-mono"
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
      <div className="space-y-3 pt-3 border-t border-(--color-border)">
        <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
          {t("shop.sortBy", "Sort By")}
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger aria-label={t("shop.sortBy", "Sort By")} className="w-full h-10 rounded-xl border-(--color-border) bg-(--color-surface-secondary) px-3.5 text-sm font-medium text-(--color-text-primary)">
            <SelectValue placeholder={t("shop.sortDefault", "Default")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Default">{t("shop.sortDefault", "Default")}</SelectItem>
            <SelectItem value="price_asc">{t("shop.sortLowHigh", "Price: Low to High")}</SelectItem>
            <SelectItem value="price_desc">{t("shop.sortHighLow", "Price: High to Low")}</SelectItem>
            <SelectItem value="rating">{t("shop.sortTopRated", "Top Rated")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Availability */}
      <div className="space-y-3 pt-3 border-t border-(--color-border)">
        <span className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
          {t("shop.availability", "Availability")}
        </span>
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger aria-label={t("shop.availability", "Availability")} className="w-full h-10 rounded-xl border-(--color-border) bg-(--color-surface-secondary) px-3.5 text-sm font-medium text-(--color-text-primary)">
            <SelectValue placeholder={t("shop.availabilityAny", "Any")} />
          </SelectTrigger>
          <SelectContent>
            {AVAILABILITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Discount */}
      <div className="space-y-3 pt-3 border-t border-(--color-border)">
        <span className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
          {t("shop.onSale", "Discount")}
        </span>
        <label className="flex items-center gap-3 cursor-pointer select-none px-1 py-1 text-sm text-(--color-text-primary)">
          <Checkbox
            checked={discount}
            onCheckedChange={(checked) => setDiscount(checked === true)}
            aria-label={t("shop.onSale", "Discount")}
          />
          <ShoppingBag className="size-4 text-(--color-text-secondary) shrink-0" />
          <span>{t("shop.onSaleLabel", "On sale only")}</span>
        </label>
      </div>

      {/* Actions: Apply & Clear */}
      <div className="pt-3 border-t border-(--color-border) space-y-2">
        <Button
          onClick={applyFilters}
          className="w-full rounded-xl bg-(--color-primary) text-(--color-on-primary) hover:bg-(--color-primary)/90 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Check className="size-4" />
          {t("shop.applyFilters", "Apply Filters")}
        </Button>

        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full rounded-xl border-(--color-border) bg-(--color-surface) text-(--color-text-primary) hover:bg-(--color-surface-secondary) transition-colors flex items-center justify-center gap-2"
        >
          <X className="size-4 text-(--color-text-secondary)" />
          {t("shop.clearAllFilters", "Clear All Filters")}
        </Button>
      </div>
    </div>
  );
}