// import React from "react";
import categories from "@/features/categories/components/categories";
import CategoryCard from "@/features/landing/components/CategoryCard";
import { useTranslation } from "react-i18next";

export default function Category() {
  const { t } = useTranslation();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="border-b border-[var(--color-border)] py-10">
        <h1 className="text-3xl pb-2 font-bold font-display tracking-tight text-[var(--color-text-primary)]">
          {t("category.title")}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          {t("category.subtitle")}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.key}>
            <CategoryCard
              image={category.image}
              title={t(`landing.categories.names.${category.key}`)}
              category={category.category}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
