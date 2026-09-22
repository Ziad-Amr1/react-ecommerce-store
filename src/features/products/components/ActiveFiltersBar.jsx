import { X, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/formatCurrency";
import { AVAILABILITY_OPTIONS } from "@/features/products/useShopFilters";

function ClearButton({ label, onClick }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className="size-6 shrink-0 rounded-full text-(--color-text-secondary) hover:text-(--color-error) hover:bg-(--color-error)/10"
      onClick={onClick}
    >
      <X className="size-3.5" aria-hidden="true" />
    </Button>
  );
}

export default function ActiveFiltersBar({
  resultsCount,
  resultsLabelKey,
  applied,
  getSortLabel,
  hasActiveFilters,
  clearFilters,
  clearCategory,
  clearSubcategory,
  clearBrand,
  clearPrice,
  clearSort,
  clearSearch,
  clearAvailability,
  clearDiscount,
}) {
  const { t, i18n } = useTranslation();

  const minBound = Number(applied.minPrice) || 0;
  const maxBound =
    applied.maxPrice !== "" && Number.isFinite(Number(applied.maxPrice))
      ? Number(applied.maxPrice)
      : null;
  const priceLabel =
    maxBound == null
      ? `${formatCurrency(minBound, undefined, i18n.language)} - ${t("shop.filterUnlimited", "∞")}`
      : `${formatCurrency(minBound, undefined, i18n.language)} - ${formatCurrency(maxBound, undefined, i18n.language)}`;

  const clearLabel = t("shop.removeFilter", "Remove filter");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-(--color-surface) p-3.5 rounded-2xl border border-(--color-border) shadow-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider pe-3 border-e border-(--color-border)">
          {t(resultsLabelKey, { count: resultsCount })}
        </span>

        {applied.category !== "All" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-(--color-surface-secondary) text-(--color-text-primary) border border-(--color-border) font-normal text-xs">
            {t("shop.filterCategory")}{" "}
            <span className="font-semibold">{applied.category}</span>
            <ClearButton label={clearLabel} onClick={clearCategory} />
          </Badge>
        )}

        {applied.subcategory !== "All" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-(--color-surface-secondary) text-(--color-text-primary) border border-(--color-border) font-normal text-xs">
            {t("shop.filterSubcategory")}{" "}
            <span className="font-semibold">{applied.subcategory}</span>
            <ClearButton label={clearLabel} onClick={clearSubcategory} />
          </Badge>
        )}

        {applied.brand !== "All" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-(--color-surface-secondary) text-(--color-text-primary) border border-(--color-border) font-normal text-xs">
            {t("shop.filterBrand")}{" "}
            <span className="font-semibold">{applied.brand}</span>
            <ClearButton label={clearLabel} onClick={clearBrand} />
          </Badge>
        )}

        {(applied.minPrice !== "" || applied.maxPrice !== "") && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-(--color-surface-secondary) text-(--color-text-primary) border border-(--color-border) font-normal text-xs">
            {t("shop.filterPrice")}{" "}
            <span className="font-mono font-semibold">
              {priceLabel}
            </span>
            <ClearButton label={clearLabel} onClick={clearPrice} />
          </Badge>
        )}

        {applied.discount === true && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-(--color-surface-secondary) text-(--color-text-primary) border border-(--color-border) font-normal text-xs">
            {t("shop.filterOnSale", "On sale:")}
            <ClearButton label={clearLabel} onClick={clearDiscount} />
          </Badge>
        )}

        {applied.availability !== "Any" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-(--color-surface-secondary) text-(--color-text-primary) border border-(--color-border) font-normal text-xs">
            {t("shop.filterAvailability", "Availability:")}{" "}
            <span className="font-semibold">
              {t(
                AVAILABILITY_OPTIONS.find(
                  (option) => option.value === applied.availability,
                )?.labelKey ?? "shop.availabilityAny",
              )}
            </span>
            <ClearButton label={clearLabel} onClick={clearAvailability} />
          </Badge>
        )}

        {applied.sortBy !== "Default" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-(--color-surface-secondary) text-(--color-text-primary) border border-(--color-border) font-normal text-xs">
            {t("shop.filterSort")}{" "}
            <span className="font-semibold">{getSortLabel(applied.sortBy)}</span>
            <ClearButton label={clearLabel} onClick={clearSort} />
          </Badge>
        )}

        {applied.search !== "" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-(--color-surface-secondary) text-(--color-text-primary) border border-(--color-border) font-normal text-xs">
            {t("shop.filterSearch")}{" "}
            <span className="font-semibold">"{applied.search}"</span>
            <ClearButton label={clearLabel} onClick={clearSearch} />
          </Badge>
        )}
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8 text-(--color-error) hover:bg-(--color-error)/10 hover:text-(--color-error) flex items-center gap-1.5 px-2">
          <FilterX className="size-3.5" />
          {t("shop.clearAllFilters", "Clear Filters")}
        </Button>
      )}
    </div>
  );
}