import { useState, useMemo } from "react";

const EMPTY_FILTERS = {
  search: "",
  category: "All",
  subcategory: "All",
  brand: "All",
  minPrice: "",
  maxPrice: "",
  sortBy: "Default",
};

const SORT_LABELS = {
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  rating: "Top Rated",
};

function countByName(source, select, sortNames = false) {
  if (!Array.isArray(source) || source.length === 0) {
    return [{ name: "All", count: 0 }];
  }
  const counts = {};
  source.forEach((item) => {
    const value = select(item);
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  let names = Object.entries(counts).map(([name, count]) => ({ name, count }));
  if (sortNames) {
    names = names.sort((a, b) => a.name.localeCompare(b.name));
  }
  return [{ name: "All", count: source.length }, ...names];
}

export default function useShopFilters(
  products,
  catalogProducts = [],
  initialFilters = EMPTY_FILTERS,
) {
  const [draft, setDraft] = useState(initialFilters);
  const [applied, setApplied] = useState(initialFilters);
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Whole-catalog counts when the cached catalog is available (true counts
  // across every product), falling back to the current page otherwise.
  const countSource = Array.isArray(catalogProducts) && catalogProducts.length
    ? catalogProducts
    : products;

  // Setters for draft state
  const setSearchQuery = (val) => setDraft((prev) => ({ ...prev, search: val }));
  const setMinPrice = (val) => setDraft((prev) => ({ ...prev, minPrice: val }));
  const setMaxPrice = (val) => setDraft((prev) => ({ ...prev, maxPrice: val }));
  const changeSort = (val) => setDraft((prev) => ({ ...prev, sortBy: val }));
  const selectBrand = (name) => setDraft((prev) => ({ ...prev, brand: name }));

  // Picking a new category resets the picked subcategory so the list never
  // points at a subcategory that belongs to a different category.
  const selectCategory = (name) =>
    setDraft((prev) => ({
      ...prev,
      category: name,
      subcategory: name === "All" ? "All" : prev.subcategory,
    }));

  const selectSubcategory = (name) =>
    setDraft((prev) => ({ ...prev, subcategory: name }));

  // Apply draft filters to applied state (a subcategory is meaningless without
  // its category, so it is dropped when the category is cleared).
  const applyFilters = () => {
    setApplied({
      ...draft,
      subcategory: draft.category === "All" ? "All" : draft.subcategory,
    });
  };

  // Synchronized clear functions for active filter badges (updates both applied and draft)
  const clearCategory = () => {
    setDraft((prev) => ({ ...prev, category: "All", subcategory: "All" }));
    setApplied((prev) => ({ ...prev, category: "All", subcategory: "All" }));
  };

  const clearSubcategory = () => {
    setDraft((prev) => ({ ...prev, subcategory: "All" }));
    setApplied((prev) => ({ ...prev, subcategory: "All" }));
  };

  const clearBrand = () => {
    setDraft((prev) => ({ ...prev, brand: "All" }));
    setApplied((prev) => ({ ...prev, brand: "All" }));
  };

  const clearPrice = () => {
    setDraft((prev) => ({ ...prev, minPrice: "", maxPrice: "" }));
    setApplied((prev) => ({ ...prev, minPrice: "", maxPrice: "" }));
  };

  const clearSort = () => {
    setDraft((prev) => ({ ...prev, sortBy: "Default" }));
    setApplied((prev) => ({ ...prev, sortBy: "Default" }));
  };

  const clearSearch = () => {
    setDraft((prev) => ({ ...prev, search: "" }));
    setApplied((prev) => ({ ...prev, search: "" }));
  };

  const clearFilters = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  };

  // Category list reflects the products the filter can actually see (the cached
  // catalog when present, the current page otherwise).
  const categories = useMemo(
    () => countByName(countSource, (p) => p.category),
    [countSource],
  );

  const brands = useMemo(
    () => countByName(countSource, (p) => p.brand, true),
    [countSource],
  );

  // Subcategories for the currently selected category.
  const subcategories = useMemo(() => {
    const category = draft.category !== "All" ? String(draft.category).toLowerCase() : null;
    if (!category) {
      return [{ name: "All", count: 0 }];
    }
    const scoped = countSource.filter(
      (p) => String(p.category || "").toLowerCase() === category,
    );
    const list = countByName(scoped, (p) => p.subcategory, true);
    list[0] = { name: "All", count: scoped.length };
    return list;
  }, [countSource, draft.category]);

  const hasActiveFilters =
    applied.search !== "" ||
    applied.category !== "All" ||
    applied.subcategory !== "All" ||
    applied.brand !== "All" ||
    applied.minPrice !== "" ||
    applied.maxPrice !== "" ||
    applied.sortBy !== "Default";

  const getSortLabel = (val) => SORT_LABELS[val] || val;

  return {
    searchQuery: draft.search,
    setSearchQuery,
    minPrice: draft.minPrice,
    setMinPrice,
    maxPrice: draft.maxPrice,
    setMaxPrice,
    sortBy: draft.sortBy,
    changeSort,
    applied,
    draft,
    applyFilters,
    selectCategory,
    selectSubcategory,
    selectBrand,
    clearCategory,
    clearSubcategory,
    clearBrand,
    clearPrice,
    clearSort,
    clearSearch,
    brands,
    subcategories,
    viewMode,
    setViewMode,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    categories,
    hasActiveFilters,
    clearFilters,
    getSortLabel,
  };
}