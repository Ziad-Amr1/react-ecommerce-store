import { X, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ActiveFiltersBar({
  resultsCount,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  hasActiveFilters,
  clearFilters,
  getSortLabel
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--color-surface)] p-3.5 rounded-2xl border border-[var(--color-border)] shadow-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider pr-3 border-r border-[var(--color-border)]">
          Results ({resultsCount})
        </span>

        {selectedCategory !== "All" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-normal text-xs">
            Category: <span className="font-semibold">{selectedCategory}</span>
            <X className="size-3.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] cursor-pointer" onClick={() => setSelectedCategory("All")} />
          </Badge>
        )}

        {(minPrice !== "" || maxPrice !== "") && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-normal text-xs">
            Price: <span className="font-mono font-semibold">${minPrice || "0"} - ${maxPrice || "∞"}</span>
            <X className="size-3.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] cursor-pointer" onClick={() => { setMinPrice(""); setMaxPrice(""); }} />
          </Badge>
        )}

        {sortBy !== "Default" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-normal text-xs">
            Sort: <span className="font-semibold">{getSortLabel(sortBy)}</span>
            <X className="size-3.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] cursor-pointer" onClick={() => setSortBy("Default")} />
          </Badge>
        )}

        {searchQuery !== "" && (
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-normal text-xs">
            Search: <span className="font-semibold">"{searchQuery}"</span>
            <X className="size-3.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] cursor-pointer" onClick={() => setSearchQuery("")} />
          </Badge>
        )}
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] flex items-center gap-1.5 px-2">
          <FilterX className="size-3.5" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}