import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import electronicsImage from "../assets/electronics.webp";
import livingImage from "../assets/living.webp";
import accessoriesImage from "../assets/accessories.webp";
import sunglassesImage from "../assets/sunglasses.webp";
import beautyImage from "../assets/beauty.webp";
import fashionImage from "../assets/fashion.webp";
import CategoryCard from "./CategoryCard";
import ComingSoonButton from "./ComingSoonButton";

const categories = [
  {
    key: "electronics",
    image: electronicsImage,
  },
  {
    key: "homeLiving",
    image: livingImage,
  },
  {
    key: "accessories",
    image: accessoriesImage,
  },
  {
    key: "sunglasses",
    image: sunglassesImage,
  },
  {
    key: "beauty",
    image: beautyImage,
  },
  {
    key: "fashion",
    image: fashionImage,
  },
];

export default function Categories() {
  const { t } = useTranslation();

  return (
    <section className="mt-16" aria-labelledby="categories-title">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="categories-title" className="font-bold text-foreground">
          {t("landing.categories.title")}
        </h2>

        <ComingSoonButton>
          {t("landing.categories.viewAll")}
          <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </ComingSoonButton>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.key}
            image={category.image}
            title={t(`landing.categories.names.${category.key}`)}
          />
        ))}
      </div>
    </section>
  );
}