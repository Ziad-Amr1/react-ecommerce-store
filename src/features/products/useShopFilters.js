import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

const EMPTY_APPLIED = {
  search: "",
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
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "All";
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("Default");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Applied filters are the only values that drive server queries.
  const [applied, setApplied] = useState({
    ...EMPTY_APPLIED,
    category: categoryFromUrl,
  });

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
    setApplied((current) => ({
      ...current,
      category: name,
    }));
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

  //allows category counts to show what is available under the other active filters
  const categories = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      // Search
      if (
        applied.search &&
        !product.name?.toLowerCase().includes(applied.search.toLowerCase())
      ) {
        return false;
      }

      // Brand
      if (applied.brand !== "All" && product.brand !== applied.brand) {
        return false;
      }

      // Min price
      if (
        applied.minPrice !== "" &&
        Number(product.price) < Number(applied.minPrice)
      ) {
        return false;
      }

      // Max price
      if (
        applied.maxPrice !== "" &&
        Number(product.price) > Number(applied.maxPrice)
      ) {
        return false;
      }

      return true;
    });

    const counts = {};
    filteredProducts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return [
      {
        name: "All",
        count: filteredProducts.length,
      },
      ...Object.entries(counts).map(([name, count]) => ({
        name,
        count,
      })),
    ];
  }, [
    products,
    applied.search,
    applied.brand,
    applied.minPrice,
    applied.maxPrice,
  ]);

  const brands = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [{ name: "All", count: 0 }];
    }

    const filteredProducts = products.filter((product) => {
      // Search
      if (
        applied.search &&
        !product.name?.toLowerCase().includes(applied.search.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (applied.category !== "All" && product.category !== applied.category) {
        return false;
      }

      // Min price
      if (
        applied.minPrice !== "" &&
        Number(product.price) < Number(applied.minPrice)
      ) {
        return false;
      }

      // Max price
      if (
        applied.maxPrice !== "" &&
        Number(product.price) > Number(applied.maxPrice)
      ) {
        return false;
      }

      return true;
    });

    const counts = {};

    filteredProducts.forEach((product) => {
      if (product.brand) {
        counts[product.brand] = (counts[product.brand] || 0) + 1;
      }
    });

    return [
      {
        name: "All",
        count: filteredProducts.length,
      },
      ...Object.entries(counts).map(([name, count]) => ({
        name,
        count,
      })),
    ];
  }, [
    products,
    applied.search,
    applied.category,
    applied.minPrice,
    applied.maxPrice,
  ]);

  const hasActiveFilters =
    applied.search !== "" ||
    applied.category !== "All" ||
    applied.brand !== "All" ||
    applied.minPrice !== "" ||
    applied.maxPrice !== "" ||
    applied.sortBy !== "Default";

  const clearFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("Default");
    setApplied({ ...EMPTY_APPLIED, category: "All" });
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
    brands,
    hasActiveFilters,
    clearFilters,
    getSortLabel,
  };
}
