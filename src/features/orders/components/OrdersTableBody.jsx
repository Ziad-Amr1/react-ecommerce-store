
import React from 'react'
import { useTranslation } from "react-i18next";
import { formatDisplayDate } from "@/utils/formatDate";
import {Badge} from '@/components/ui/badge'
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const OrdersTableBody = ({ orders, onRowClick, renderStatusBadge }) => {
  const { t, i18n } = useTranslation();
  return (
    <TableBody>
      {orders.map((order, index) => {
        const name = order?.shippingAddress?.fullName || "—";

        const orderId = order?._id || "";

        return (
          <TableRow
            key={orderId || index}
            onClick={() => onRowClick(order)}
            className="cursor-pointer transition-colors hover:bg-[var(--color-surface-secondary)]/50"
          >
            <TableCell className="font-mono text-sm font-medium">
              #{orderId ? orderId.slice(0, 8) : t("orders.notAvailable")}
            </TableCell>

            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block max-w-[140px] truncate text-[var(--color-text-secondary)]">
                    {name}
                  </span>
                </TooltipTrigger>

                <TooltipContent>{name}</TooltipContent>
              </Tooltip>
            </TableCell>

            <TableCell className="text-[var(--color-text-secondary)]">
              {formatDisplayDate(order?.createdAt) || "—"}
            </TableCell>

            <TableCell>{renderStatusBadge(order?.status)}</TableCell>

            <TableCell>
              {/* {renderPaymentStatusBadge(order?.paymentStatus)} */}
              <Badge
                variant="outline"
                className="border-transparent px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: "var(--color-warning-bg)",
                  color: "var(--color-warning)",
                }}
              >
                {order?.paymentStatus || "—"}
              </Badge>
            </TableCell>

            <TableCell>
              <Badge
                variant="outline"
                className="border-transparent px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: "var(--color-surface-secondary)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {order?.paymentMethod || "—"}
              </Badge>
            </TableCell>

            <TableCell className="font-display font-bold">
              {formatCurrency(
                order?.totalPrice,
                "USD",
                i18n.language || "en-US",
              )}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default OrdersTableBody