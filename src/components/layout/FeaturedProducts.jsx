import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturedProductCard from "../ui/FeaturedProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "../ui/SkeletonCard";
import { v4 as uuidv4 } from "uuid";
import ErrorImage from "../../../public/error.webp";
import ErrorDialog from "../ui/ErrorDialog";
import EmptyDialog from "../ui/EmptyDialog";
import { useProducts } from "@/contexts/ProductsContext";

export default function FeaturedProducts() {
  const { featuredProducts, loading, error } = useProducts();
  if (loading) {
    return (
      <div className="w-[80%] lg:w-full mx-auto bg-[var(--color-background)] mt-20 px-2 py-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/8" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }
  if (error) {
    return <ErrorDialog image={ErrorImage} issue="featured products" />;
  }
  if (featuredProducts.length == 0) {
    return <EmptyDialog />;
  }

  return (
    <div className="bg-[var(--color-background)] mt-20 py-4 px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-[var(--color-text-primary)] font-body font-bold capitalize">
          featured products
        </h2>
        <Button
          variant="ghost"
          className="cursor-pointer capitalize text-[var(--color-focus-ring)]"
        >
          view all products
          <ArrowRight data-icon="inline-start" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map((featuredProduct) => (
          <FeaturedProductCard
            key={featuredProduct.id || uuidv4()}
            featuredProduct={featuredProduct}
          />
        ))}
      </div>
    </div>
  );
}
