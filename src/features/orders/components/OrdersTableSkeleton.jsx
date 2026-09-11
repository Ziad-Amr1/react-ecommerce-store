
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

const SKELETON_ROWS = 6;

export default function OrdersTableSkeleton() {
  return (
    <TableBody>
      {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {/* Order */}
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>

          {/* Customer */}
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>

          {/* Date */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          {/* Status */}
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>

          {/* Payment Status */}
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>

          {/* Payment Method */}
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>

          {/* Total */}
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
