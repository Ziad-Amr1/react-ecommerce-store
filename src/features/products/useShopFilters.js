import { useState, useMemo } from "react";

const EMPTY_FILTERS = {
  search: "",
  category: "All",
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

export default function useShopFilters(products) {
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Setters for draft state
  const setSearchQuery = (val) => setDraft((prev) => ({ ...prev, search: val }));
  const setMinPrice = (val) => setDraft((prev) => ({ ...prev, minPrice: val }));
  const setMaxPrice = (val) => setDraft((prev) => ({ ...prev, maxPrice: val }));
  const changeSort = (val) => setDraft((prev) => ({ ...prev, sortBy: val }));
  const selectCategory = (name) => setDraft((prev) => ({ ...prev, category: name }));
  const selectBrand = (name) => setDraft((prev) => ({ ...prev, brand: name }));

  // Apply draft filters to applied state
  const applyFilters = () => {
    setApplied(draft);
  };

  // Synchronized clear functions for active filter badges (updates both applied and draft)
  const clearCategory = () => {
    setDraft((prev) => ({ ...prev, category: "All" }));
    setApplied((prev) => ({ ...prev, category: "All" }));
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

  // Category list reflects only the products returned on the current page.
  const categories = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [{ name: "All", count: 0 }];
    }

    const counts = {};
    products.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });

    const dynamicList = Object.keys(counts).map((cat) => ({
      name: cat,
      count: counts[cat],
    }));

    return [{ name: "All", count: products.length }, ...dynamicList];
  }, [products]);

  // Brand list reflects only the products returned on the current page.
  const brands = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [{ name: "All", count: 0 }];
    }

    const counts = {};
    products.forEach((p) => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });

    const dynamicList = Object.keys(counts)
      .sort((a, b) => a.localeCompare(b))
      .map((brand) => ({ name: brand, count: counts[brand] }));

    return [{ name: "All", count: products.length }, ...dynamicList];
  }, [products]);

  const hasActiveFilters =
    applied.search !== "" ||
    applied.category !== "All" ||
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
    selectBrand,
    clearCategory,
    clearBrand,
    clearPrice,
    clearSort,
    clearSearch,
    brands,
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