import { cn } from "@/lib/utils";

export default function AdminTableEmptyState({
  icon,
  title,
  hint,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex h-52 flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      </div>
      {action}
    </div>
  );
}