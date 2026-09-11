import { X, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function ActiveFiltersBar({
  resultsCount,
  resultsLabelKey,
  applied,
  getSortLabel,
  hasActiveFilters,
  clearFilters,
  selectCategory,
  setSearchQuery,
  setMinPrice,
  setMaxPrice,
  changeSort,
}) {
  const { t } = useTranslation();

  const clearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--color-surface)] p-3.5 rounded-2xl border border-[var(--color-border)] shadow-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider pr-3 border-r border-[var(--color-border)]">
          {t(resultsLabelKey, { count: resultsCount })}
        </span>

        {applied.category !== "All" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-normal text-xs">
            Category: <span className="font-semibold">{applied.category}</span>
            <X
              className="size-3.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] cursor-pointer"
              onClick={() => selectCategory("All")}
            />
          </Badge>
        )}

        {(applied.minPrice !== "" || applied.maxPrice !== "") && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-normal text-xs">
            Price:{" "}
            <span className="font-mono font-semibold">
              ${applied.minPrice || "0"} - ${applied.maxPrice || "∞"}
            </span>
            <X
              className="size-3.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] cursor-pointer"
              onClick={clearPrice}
            />
          </Badge>
        )}

        {applied.sortBy !== "Default" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-normal text-xs">
            Sort: <span className="font-semibold">{getSortLabel(applied.sortBy)}</span>
            <X
              className="size-3.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] cursor-pointer"
              onClick={() => changeSort("Default")}
            />
          </Badge>
        )}

        {applied.search !== "" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-normal text-xs">
            Search: <span className="font-semibold">"{applied.search}"</span>
            <X
              className="size-3.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          </Badge>
        )}
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] flex items-center gap-1.5 px-2">
          <FilterX className="size-3.5" />
          {t("clear_all_filters", "Clear Filters")}
        </Button>
      )}
    </div>
  );
}