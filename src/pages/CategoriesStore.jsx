import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, Search, Sparkles, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AccountPageHeader from "@/components/layout/AccountPageHeader";
import SEO from "@/components/SEO/SEO";

import electronicsImage from "@/features/landing/assets/electronics.webp";
import livingImage from "@/features/landing/assets/living.webp";
import accessoriesImage from "@/features/landing/assets/accessories.webp";
import sunglassesImage from "@/features/landing/assets/sunglasses.webp";
import beautyImage from "@/features/landing/assets/beauty.webp";
import fashionImage from "@/features/landing/assets/fashion.webp";

const CATEGORIES_DATA = [
  {
    id: "electronics",
    key: "electronics",
    apiValue: "electronics",
    image: electronicsImage,
    itemCount: 24,
    subcategories: ["Smartphones", "Laptops", "Audio", "Wearables"],
  },
  {
    id: "fashion",
    key: "fashion",
    apiValue: "fashion",
    image: fashionImage,
    itemCount: 38,
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories"],
  },
  {
    id: "homeLiving",
    key: "homeLiving",
    apiValue: "home",
    image: livingImage,
    itemCount: 19,
    subcategories: ["Furniture", "Decor", "Kitchenware", "Lighting"],
  },
  {
    id: "beauty",
    key: "beauty",
    apiValue: "beauty",
    image: beautyImage,
    itemCount: 31,
    subcategories: ["Skincare", "Haircare", "Fragrance", "Makeup"],
  },
  {
    id: "accessories",
    key: "accessories",
    apiValue: "accessories",
    image: accessoriesImage,
    itemCount: 15,
    subcategories: ["Jewelry", "Bags & Wallets", "Watches", "Belts"],
  },
  {
    id: "sunglasses",
    key: "sunglasses",
    apiValue: "sunglasses",
    image: sunglassesImage,
    itemCount: 12,
    subcategories: ["Aviator", "Wayfarer", "Polarized", "Designer"],
  },
];

export default function CategoriesStore() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = CATEGORIES_DATA.filter((cat) => {
    const title = t(`landing.categories.names.${cat.key}`, cat.key).toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    if (title.includes(query)) return true;
    return cat.subcategories.some((sub) => sub.toLowerCase().includes(query));
  });

  return (
    <div className="py-8 font-body text-foreground">
      <SEO
        title={t("categoriesStore.title", "Browse Categories")}
        description={t(
          "categoriesStore.description",
          "Explore our store catalog by category to find exactly what you need.",
        )}
        url="/categories"
      />
      <div className="mx-auto max-w-6xl space-y-8">
        <AccountPageHeader
          title={t("categoriesStore.title", "Browse Categories")}
          description={t(
            "categoriesStore.description",
            "Explore our store catalog by category to find exactly what you need.",
          )}
          count={CATEGORIES_DATA.length}
        />

        {/* Search & Filter Bar */}
        <div className="relative max-w-md">
          <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              "categoriesStore.searchPlaceholder",
              "Search categories or subcategories...",
            )}
            className="ps-10 rounded-xl bg-card border-border"
          />
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <Card className="rounded-2xl border border-dashed p-12 text-center">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <Tag className="size-10 text-muted-foreground opacity-60 mb-3" />
              <h3 className="font-display text-lg font-semibold">
                {t("categoriesStore.noResultsTitle", "No categories found")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(
                  "categoriesStore.noResultsDesc",
                  "Try searching with a different keyword.",
                )}
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-full"
              >
                {t("categoriesStore.clearSearch", "Clear search")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((cat) => {
              const title = t(`landing.categories.names.${cat.key}`, cat.key);
              return (
                <Card
                  key={cat.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md py-0 gap-0"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={cat.image}
                      alt={title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-white">
                      <div>
                        <h2 className="font-display text-xl font-bold tracking-tight">
                          {title}
                        </h2>
                        <p className="text-xs opacity-90">
                          {t("categoriesStore.itemCount", {
                            count: cat.itemCount,
                            defaultValue: `${cat.itemCount} items`,
                          })}
                        </p>
                      </div>

                      <Badge className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                        <Sparkles className="size-3 me-1" />
                        {t("categoriesStore.badge", "Popular")}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {t("categoriesStore.subcategories", "Subcategories")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subcategories.map((sub) => (
                          <Badge
                            key={sub}
                            variant="secondary"
                            className="rounded-lg text-xs font-normal"
                          >
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full rounded-xl gap-2 cursor-pointer"
                    >
                      <Link to={`/products?category=${cat.apiValue}`}>
                        <span>
                          {t("categoriesStore.exploreCategory", {
                            name: title,
                            defaultValue: `Explore ${title}`,
                          })}
                        </span>
                        <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
