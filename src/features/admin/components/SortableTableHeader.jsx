import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Column definition shape handled by this header:
//   { key, label, sortable?, sortKey?, align?: "start" | "end", className? }
// `sortKey` is the value reported to the shared controller's handleSort.
function SortIcon({ active, direction }) {
  if (!active) {
    return <ArrowUpDown className="ms-1 size-3.5 opacity-40" aria-hidden="true" />;
  }

  return direction === "asc" ? (
    <ArrowUp className="ms-1 size-3.5" aria-hidden="true" />
  ) : (
    <ArrowDown className="ms-1 size-3.5" aria-hidden="true" />
  );
}

export default function SortableTableHeader({
  columns,
  sortKey = "",
  sortDirection = "asc",
  onSort = () => {},
  className,
}) {
  return (
    <TableHeader>
      <TableRow className={cn("bg-muted/50", className)}>
        {columns.map((column) => {
          const sortable = Boolean(column.sortable);
          const active = sortable && column.sortKey === sortKey;
          const alignEnd = column.align === "end";

          return (
            <TableHead
              key={column.key}
              className={cn(
                sortable && "cursor-pointer select-none",
                alignEnd ? "text-end" : "text-start",
                column.className,
              )}
              aria-sort={
                active
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : undefined
              }
            >
              {sortable ? (
                <button
                  type="button"
                  onClick={() => onSort(column.sortKey)}
                  className={cn(
                    "inline-flex w-full items-center gap-0.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)",
                    alignEnd ? "justify-end text-end" : "justify-start text-start",
                    "cursor-pointer",
                  )}
                >
                  <span>{column.label}</span>
                  <SortIcon active={active} direction={sortDirection} />
                </button>
              ) : (
                <span className={cn(alignEnd ? "flex justify-end" : "flex justify-start")}>{column.label}</span>
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}