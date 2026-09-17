import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton({ viewMode = "grid" }) {
  if (viewMode === "list") {
    return (
      <div className="isolate flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-card p-3 shadow-[var(--shadow-md)] sm:gap-5 sm:p-4">
        <Skeleton className="size-16 shrink-0 rounded-lg sm:size-20 sm:rounded-xl" />

        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="hidden h-3 w-32 sm:block" />
          <Skeleton className="h-4 w-4/5 sm:h-5" />
          <Skeleton className="h-3 w-28" />
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Skeleton className="h-6 w-16 sm:w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md sm:w-24" />
            <Skeleton className="h-8 w-8 rounded-md sm:w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="isolate h-full gap-4 overflow-hidden border-[var(--color-border)] py-0 shadow-[var(--shadow-md)]">
      {/* Image */}
      <div className="relative m-4 aspect-[4/3] overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
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
