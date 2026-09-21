import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AccountPageHeader from "@/components/layout/AccountPageHeader";
import SEO from "@/components/SEO/SEO";
import CategoryCard from "@/features/landing/components/CategoryCard";
import categories from "@/features/categories/data/categories";

export default function CategoriesStore() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const title = t(`landing.categories.names.${cat.key}`, cat.title).toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return !query || title.includes(query);
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

      <div className="mx-auto max-w-7xl space-y-8">
        <AccountPageHeader
          title={t("categoriesStore.title", "Browse Categories")}
          description={t(
            "categoriesStore.description",
            "Explore our store catalog by category to find exactly what you need.",
          )}
          count={categories.length}
        />

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              "categoriesStore.searchPlaceholder",
              "Search categories...",
            )}
            className="ps-10 rounded-xl bg-card border-border"
          />
        </div>

        {/* Categories Gallery */}
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
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((cat) => (
              <li key={cat.key}>
                <CategoryCard
                  image={cat.image}
                  title={t(`landing.categories.names.${cat.key}`, cat.title)}
                  category={cat.category}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
