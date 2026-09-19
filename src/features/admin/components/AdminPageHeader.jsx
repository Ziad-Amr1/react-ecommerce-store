import { cn } from "@/lib/utils";

// Statistic item shape: { id, label, value } — the label/value pairs are
// provided by the calling page, so this header stays free of domain logic.
export default function AdminPageHeader({
  kicker,
  title,
  description,
  action,
  statistics = [],
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3",
        className,
      )}
    >
      <div className="min-w-0">
        {kicker && (
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {kicker}
          </p>
        )}
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {statistics.length > 0 && (
          <dl className="flex items-center divide-x divide-border rounded-md border border-(--color-border) bg-card px-1.5 py-1 shadow-sm rtl:divide-x-reverse">
            {statistics.map((statistic) => (
              <div
                key={statistic.id}
                className="flex flex-col px-3 first:pl-2 last:pr-2"
              >
                <dt className="text-xs leading-4 text-muted-foreground">
                  {statistic.label}
                </dt>
                <dd className="font-display text-lg font-bold leading-6 tabular-nums text-foreground">
                  {statistic.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {action}
      </div>
    </div>
  );
}