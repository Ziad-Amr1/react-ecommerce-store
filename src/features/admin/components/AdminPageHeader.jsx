import { cn } from "@/lib/utils";

export default function AdminPageHeader({
  kicker,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3",
        className,
      )}
    >
      <div>
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
      {action}
    </div>
  );
}