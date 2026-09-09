import { useState, useMemo } from "react";

export default function useShopFilters(products) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("Default");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // حساب الأقسام ديناميكياً
  const categories = useMemo(() => {
    if (!products || !Array.isArray(products))
      return [{ name: "All", count: 0 }];

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
