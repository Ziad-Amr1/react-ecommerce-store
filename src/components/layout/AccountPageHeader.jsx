export default function AccountPageHeader({
  title,
  description,
  count,
  children,
  actions,
  className = "",
}) {
  const actionContent = actions || children;

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border ${className}`}
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>

          {typeof count === "number" && count >= 0 && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {count}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {actionContent && (
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center shrink-0">
          {actionContent}
        </div>
      )}
    </div>
  );
}
