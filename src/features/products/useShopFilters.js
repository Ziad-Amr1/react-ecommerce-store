import { useState, useMemo, useEffect } from "react";

const EMPTY_APPLIED = {
  search: "",
  category: "All",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [, setSortBy] = useState("Default");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Applied filters are the only values that drive server queries.
  const [applied, setApplied] = useState(EMPTY_APPLIED);

  // Debounce search/price input before committing it as a server query.
  useEffect(() => {
    const timer = setTimeout(() => {
      setApplied((current) => {
        const next = {
          ...current,
          search: searchQuery,
          minPrice,
          maxPrice,
        };
        return JSON.stringify(next) === JSON.stringify(current)
          ? current
          : next;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, minPrice, maxPrice]);

  const selectCategory = (name) => {
    setApplied((current) => ({ ...current, category: name }));
  };

  const changeSort = (value) => {
    setSortBy(value);
    setApplied((current) => ({ ...current, sortBy: value }));
  };

  // Category list reflects only the products returned on the current page.
  // The backend exposes no catalog-wide categories endpoint yet, so this
  // list is used purely as a visual shortcut; selecting a category still
  // applies a real server-side filter.
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

  const hasActiveFilters =
    applied.search !== "" ||
    applied.category !== "All" ||
    applied.minPrice !== "" ||
    applied.maxPrice !== "" ||
    applied.sortBy !== "Default";

  const clearFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    changeSort("Default");
    setApplied(EMPTY_APPLIED);
  };

  const getSortLabel = (val) => SORT_LABELS[val] || val;

  return {
    searchQuery,
    setSearchQuery,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    changeSort,
    applied,
    selectCategory,
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