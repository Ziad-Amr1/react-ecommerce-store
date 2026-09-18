import { TableCell, TableRow } from "@/components/ui/table";

export default function TableSkeletonRows({ rows = 5, columns }) {
  return Array.from({ length: rows }).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      {Array.from({ length: columns }).map((__, columnIndex) => (
        <TableCell key={columnIndex}>
          <div className="h-4 animate-pulse rounded-md bg-muted" />
        </TableCell>
      ))}
    </TableRow>
  ));
}