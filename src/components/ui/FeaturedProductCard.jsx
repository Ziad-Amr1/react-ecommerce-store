import { ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export default function FeaturedProductCard({ featuredProduct }) {
  return (
    <div className="rounded-lg shadow-md cursor-pointer">
      {/* Start Image and Action Buttons  */}
      <div className="relative p-2 bg-[var(--color-surface)]  aspect-square overflow-hidden">
        <img
          src={
            featuredProduct.images?.[0]?.url
              ? featuredProduct.images[0].url
              : "https://placehold.co/400"
          }
          alt={featuredProduct.name}
          className="size-full object-contain  duration-150 hover:grayscale"
        />

        <div className="absolute right-[10px] top-1/2 -translate-y-1/2">
          <ShoppingCart
            size={20}
            className="mb-3 cursor-pointer duration-150 hover:text-[var(--color-focus-ring)]"
          />
          <Heart
            size={20}
            className="cursor-pointer duration-150 hover:text-[var(--color-focus-ring)]"
          />
        </div>
      </div>
      {/* Start Meta Data  */}
      <div className="p-2 bg-[var(--color-surface)]">
        <h3 className="capitalize font-bold text-[var(--color-text-primary)]">
          {featuredProduct.name || "Untitled Product"}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-end">
            {featuredProduct.discountPrice ? (
              <span className="font-bold font-mono text-xl text-[var(--color-focus-ring)] me-3">
                ${featuredProduct.discountPrice}
              </span>
            ) : (
              ""
            )}
            <span
              className={`${featuredProduct.discountPrice ? "line-through" : ""} font-mono ${featuredProduct.discountPrice ? "text-[var(--color-text-secondary)]" : "text-[var(--color-focus-ring)] text-xl font-bold"}`}
            >
              ${featuredProduct.price}
            </span>
          </div>
          <Badge
            className={`${featuredProduct.discountPrice ? "inline-flex" : "hidden"} ms-3 bg-[var(--color-error)] font-mono`}
          >
            -
            {(
              ((featuredProduct.price - featuredProduct.discountPrice) /
                featuredProduct.price) *
              100
            ).toFixed(0)}
            %
          </Badge>
        </div>
      </div>
    </div>
  );
}
