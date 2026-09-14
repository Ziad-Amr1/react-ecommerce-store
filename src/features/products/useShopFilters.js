<<<<<<< Updated upstream
import { useState, useMemo } from "react";
=======
import { useState, useMemo, useEffect } from "react";

const EMPTY_APPLIED = {
  search: "",
  category: "All",
  minPrice: "",
  maxPrice: "",
  sortBy: "Default",
};

const SORT_LABELS = {
  discount_asc: "Discount: Low to High",
  discount_desc: "Discount: High to Low",
};
>>>>>>> Stashed changes

export default function useShopFilters(products, totalProducts) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("Default");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

<<<<<<< Updated upstream
  // حساب الأقسام ديناميكياً
  const categories = useMemo(() => {
    if (!products || !Array.isArray(products))
      return [{ name: "All", count: 0 }];
=======
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

  // إرجاع All مع إجمالي المنتجات، وتصنيفي Phones (3) و Electronics (40) حصراً دون غيرهما
  const categories = useMemo(() => {
    const allCount = totalProducts != null ? totalProducts : (products?.length || 0);
>>>>>>> Stashed changes

    return [
      { name: "All", count: allCount },
      { name: "Phones", count: 3 },
      { name: "Electronics", count: 40 },
    ];
  }, [products, totalProducts]);

  // منطق الفلترة والترتيب
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products
      .filter((product) => {
        const matchesSearch = product.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "All" ||
          product.category?.toLowerCase() === selectedCategory.toLowerCase();

        const min = minPrice !== "" ? parseFloat(minPrice) : 0;
        const max = maxPrice !== "" ? parseFloat(maxPrice) : Infinity;
        const priceToCompare = product.discountPrice || product.price || 0;
        const matchesPrice = priceToCompare >= min && priceToCompare <= max;

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price || 0;
        const priceB = b.discountPrice || b.price || 0;

        if (sortBy === "low_to_high") return priceA - priceB;
        if (sortBy === "high_to_low") return priceB - priceA;
        if (sortBy === "top_rated") {
          const ratingA = a.rating || a.ratings || a.rate || 0;
          const ratingB = b.rating || b.ratings || b.rate || 0;
          return ratingB - ratingA;
        }
        if (sortBy === "newest") {
          const dateA = new Date(
            a.createdAt || a.created_at || a.date || 0,
          ).getTime();
          const dateB = new Date(
            b.createdAt || b.created_at || b.date || 0,
          ).getTime();
          return dateB - dateA;
        }
        return 0;
      });
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice, sortBy]);

  const hasActiveFilters =
    selectedCategory !== "All" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    searchQuery !== "" ||
    sortBy !== "Default";

  const clearFilters = () => {
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("Default");
    setSearchQuery("");
  };

  const getSortLabel = (val) => {
    const labels = {
      low_to_high: "Price: Low to High",
      high_to_low: "Price: High to Low",
      top_rated: "Top Rated",
      newest: "Newest",
    };
    return labels[val] || val;
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    categories,
    filteredProducts,
    hasActiveFilters,
    clearFilters,
    getSortLabel,
  };
}
