import { Card } from "@/components/ui/card";

export default function PromoCodeCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
      {/* "Have a promo code?" title with icon */}
      <div className="mb-3 flex items-center gap-2">
        <div className="size-4 shrink-0 animate-pulse rounded bg-(--color-surface-secondary)" />
        <div className="h-4 w-32 animate-pulse rounded bg-(--color-surface-secondary)" />
      </div>

      {/* Input + Apply button row */}
      <div className="flex gap-2">
        <div className="h-10 min-w-0 flex-1 animate-pulse rounded-xl bg-(--color-surface-secondary)" />
        <div className="h-10 w-20 shrink-0 animate-pulse rounded-xl bg-(--color-surface-secondary)" />
      </div>
    </Card>
  );
}