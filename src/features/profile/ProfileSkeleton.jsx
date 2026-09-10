import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading profile" aria-busy="true">
      <div className="rounded-xl border">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <Skeleton className="size-20 rounded-full" />
          <div className="w-full max-w-72 space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-18 rounded-xl" />
          <Skeleton className="h-18 rounded-xl" />
          <Skeleton className="h-18 rounded-xl" />
          <Skeleton className="h-18 rounded-xl" />
        </div>
      </div>
    </div>
  );
}