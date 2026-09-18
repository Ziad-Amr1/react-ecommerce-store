import { Card } from "@/components/ui/card";

export default function OrderSummaryCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
      <div className="space-y-5">
        {/* "Order summary" title */}
        <div className="h-4 w-28 animate-pulse rounded bg-(--color-surface-secondary)" />

        <div className="space-y-2.5">
          {/* Subtotal row */}
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-24 animate-pulse rounded bg-(--color-surface-secondary)" />
            <div className="h-3.5 w-16 animate-pulse rounded bg-(--color-surface-secondary)" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-(--color-border)" aria-hidden="true" />

        {/* Total row */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-12 animate-pulse rounded bg-(--color-surface-secondary)" />
          <div className="h-4 w-20 animate-pulse rounded bg-(--color-surface-secondary)" />
        </div>

        {/* Checkout button */}
        <div className="h-12 w-full animate-pulse rounded-xl bg-(--color-surface-secondary)" />
      </div>
    </Card>
  );
}
