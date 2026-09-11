import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="isolate h-full gap-4 overflow-hidden border-[var(--color-border)] py-0 shadow-[var(--shadow-md)]">
      {/* Image */}
      <div className="relative m-4 aspect-[4/3] overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />

        {/* Image dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          <Skeleton className="size-1.5 rounded-full" />
          <Skeleton className="size-1.5 rounded-full" />
          <Skeleton className="size-1.5 rounded-full" />
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-1.5 px-5 pb-5">
        {/* Category */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />

          {/* Product name */}
          <Skeleton className="h-5 w-4/5" />

          {/* Rating */}
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>

        {/* Stock */}
        <Skeleton className="mt-2 h-5 w-28" />

        {/* Buttons */}
        <div className="mt-auto flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
