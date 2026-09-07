import { ArrowRight } from "lucide-react";
import ElectronicImage from "../../../public/electronics.webp";
import LivingImage from "../../../public/living.webp";
import AccessoriesImage from "../../../public/accessories.webp";
import SunglassesImage from "../../../public/sunglasses.webp";
import BeautyImage from "../../../public/beauty.webp";
import FashionImage from "../../../public/fashion.webp";
import CategoryCard from "../ui/CategoryCard";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: ElectronicImage,
  },

  {
    id: 2,
    name: "Home & Living",
    image: LivingImage,
  },
  {
    id: 3,
    name: "Accessories",
    image: AccessoriesImage,
  },
  {
    id: 4,
    name: "Sunglasses",
    image: SunglassesImage,
  },
  {
    id: 5,
    name: "Beauty",
    image: BeautyImage,
  },
  {
    id: 6,
    name: "Fashion",
    image: FashionImage,
  },
];

export default function Categories() {
  return (
    <section className="py-16 px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-[var(--color-text-primary)] font-body font-bold capitalize">
          categories
        </h2>
        <Button
          variant="ghost"
          className="cursor-pointer capitalize text-[var(--color-focus-ring)]"
        >
          view all categories
          <ArrowRight data-icon="inline-start" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
