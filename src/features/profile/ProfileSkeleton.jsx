import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading profile" aria-busy="true">
      {/* Profile header */}
      <div className="rounded-xl border">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {/* Avatar */}
            <Skeleton className="size-20 shrink-0 rounded-full" />

            {/* Profile information */}
            <div className="w-full max-w-80 space-y-2 text-center sm:text-start">
              {/* Name + badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Email */}
              <Skeleton className="mx-auto h-4 w-56 sm:mx-0" />

              {/* Member since */}
              <Skeleton className="mx-auto h-3.5 w-40 sm:mx-0" />
            </div>
          </div>

          {/* Sign out button */}
          <Skeleton className="mx-auto h-9 w-28 shrink-0 rounded-md sm:mx-0" />
        </div>
      </div>

      {/* Personal information */}
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
