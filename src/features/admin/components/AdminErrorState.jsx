import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminErrorState({
  title,
  hint,
  onRetry,
  retryLabel,
  retryIcon,
  className,
  iconClassName,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 py-14 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-full bg-(--color-error-bg)",
          iconClassName,
        )}
      >
        <TriangleAlert className="size-7 text-(--color-error)" aria-hidden="true" />
      </div>
      <h2 className="font-display text-lg font-semibold text-foreground">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{hint}</p>
      {onRetry && (
        <Button className="mt-2" onClick={onRetry}>
          {retryIcon}
          {retryLabel}
        </Button>
      )}
    </div>
  );
}