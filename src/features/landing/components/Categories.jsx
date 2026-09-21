import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import CategoryCard from "./CategoryCard";

import categories from "@/features/categories/components/categories";

export default function Categories() {
  const { t } = useTranslation();

  return (
    <section className="mt-16" aria-labelledby="categories-title">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2
          id="categories-title"
          className="font-display text-2xl font-bold text-foreground"
        >
          {t("landing.categories.title")}
        </h2>

        <Link
          to="/Categories"
          className="group/link inline-flex shrink-0 items-center gap-1.5 pb-0.5 text-sm font-medium text-(--color-link) underline-offset-4 hover:text-(--color-link-hover) hover:underline"
        >
          {t("landing.categories.viewAll")}

          <ArrowRight
            className="size-4 transition-transform motion-safe:group-hover/link:translate-x-0.5 rtl:-scale-x-100 rtl:motion-safe:group-hover/link:-translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </header>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 6).map((category) => (
          <li key={category.key}>
            <CategoryCard
              image={category.image}
              title={t(`landing.categories.names.${category.key}`)}
              category={category.key}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
