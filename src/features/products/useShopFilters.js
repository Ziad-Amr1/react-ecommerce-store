import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";

const EMPTY_APPLIED = {
  search: "",
  category: "All",
  brand: "All",
  minPrice: "",
  maxPrice: "",
  sortBy: "Default",
};

const SORT_LABELS = {
  price_asc: "shop.sort.priceLowToHigh",
  price_desc: "shop.sort.priceHighToLow",
  rating: "shop.sort.topRated",
};

export default function useShopFilters(products) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("Default");
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

  const selectBrand = (brand) => {
    setApplied((current) => ({
      ...current,
      brand,
    }));
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
    setSortBy("Default");
    setApplied(EMPTY_APPLIED);
  };

  const getSortLabel = (val) => {
    if (val === "Default") {
      return t("shop.sort.default");
    }

    return t(SORT_LABELS[val], val);
  };

  return {
    searchQuery,
    setSearchQuery,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortBy,
    changeSort,
    applied,
    selectCategory,
    selectBrand,
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
