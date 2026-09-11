import { Search, X, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ShopSearchBar({ searchQuery, setSearchQuery, viewMode, setViewMode, t }) {
  return (
    <div className="flex items-center gap-3 bg-[var(--color-surface)] p-3 rounded-2xl border border-[var(--color-border)] shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none z-10" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search_placeholder", "Search products...")}
          className="pl-12 pr-10 py-6 text-sm bg-transparent border-none shadow-none focus-visible:ring-0 rounded-xl text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] font-body"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")} 
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex items-center bg-[var(--color-surface-secondary)] p-1 rounded-xl border border-[var(--color-border)] shrink-0">
        <button
          onClick={() => setViewMode("grid")}
          aria-label="Grid View"
          className={`p-2 rounded-lg transition-all ${
            viewMode === "grid" 
              ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-xs" 
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <LayoutGrid className="size-4" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          aria-label="List View"
          className={`p-2 rounded-lg transition-all ${
            viewMode === "list" 
              ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-xs" 
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <List className="size-4" />
        </button>
      </div>
    </div>
  );
}