import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <Card
      className="group flex h-full flex-col overflow-hidden rounded-xl border-border bg-card shadow-sm"
      aria-hidden="true"
    >
      <CardContent className="flex h-full flex-col p-0">
        {/* Image */}
        <Skeleton className="aspect-square w-full rounded-none" />

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
          {/* Title */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />

          {/* Optional description/details */}
          <div className="hidden space-y-2 sm:block">
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>

          {/* Bottom row */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            {/* Price */}
            <Skeleton className="h-6 w-20" />

            {/* Button */}
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
