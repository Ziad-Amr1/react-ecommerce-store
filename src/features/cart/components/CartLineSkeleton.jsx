export function CartLineSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 sm:p-5">
      <div className="size-5 shrink-0 animate-pulse rounded bg-(--color-surface-secondary)" />
      <div className="size-16 shrink-0 animate-pulse rounded-xl bg-(--color-surface-secondary)" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-1/3 animate-pulse rounded bg-(--color-surface-secondary)" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-(--color-surface-secondary)" />
      </div>

      <div className="h-9 w-24 animate-pulse rounded-lg bg-(--color-surface-secondary)" />

      <div className="h-5 w-16 animate-pulse rounded bg-(--color-surface-secondary)" />
    </div>
  );
}