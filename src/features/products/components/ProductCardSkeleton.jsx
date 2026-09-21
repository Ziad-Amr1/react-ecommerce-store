import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ImageSkeleton = ({ className }) => (
  <div
    className={`relative flex aspect-[4/3] items-center justify-center bg-(--color-surface-secondary) ${className}`}
  >
    <Skeleton className="absolute start-3 top-3 z-30 h-5 w-14 rounded-md" />
    <span className="sr-only">Loading product image</span>
  </div>
);

export default function ProductCardSkeleton({ viewMode = "grid" }) {
  if (viewMode === "list") {
    return (
      <div className="isolate flex items-center gap-3 rounded-xl border border-(--color-border) bg-card p-3 shadow-(--shadow-md) sm:gap-5 sm:p-4">
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

  if (viewMode === "compact") {
    return (
      <Card className="isolate h-full gap-4 overflow-hidden border-(--color-border) py-0 shadow-(--shadow-md)">
        <ImageSkeleton className="overflow-hidden" />

        <CardContent className="flex flex-1 flex-col gap-2 px-5 pb-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <Skeleton className="h-6 w-16 sm:h-7 sm:w-20" />
            <Skeleton className="hidden h-4 w-12 rounded-md sm:block" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="isolate h-full gap-4 overflow-hidden border-(--color-border) py-0 shadow-(--shadow-md)">
      <ImageSkeleton className="m-4 w-[calc(100%-2rem)] overflow-hidden rounded-xl" />

      <CardContent className="flex flex-1 flex-col gap-1.5 px-5 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-5 w-4/5" />

          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-2 pt-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}