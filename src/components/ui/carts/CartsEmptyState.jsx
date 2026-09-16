import { Inbox } from "lucide-react";

export function CartsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <p className="font-medium text-foreground">No carts found</p>
      <p className="text-sm text-muted-foreground">Try a different search term.</p>
    </div>
  );
}
