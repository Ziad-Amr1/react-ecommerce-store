

import { useTranslation } from "react-i18next";

import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const OrdersTableHeader = ({ onSort, getSortIcon, sortKey }) => {
  const { t } = useTranslation();
  return (
    <TableHeader>
      <TableRow className="bg-[var(--color-surface-secondary)]">
        {/* Order — always visible */}
        <TableHead className="whitespace-nowrap">
          {t("orders.columns.order")}
        </TableHead>

        {/* Customer — always visible */}
        <TableHead
          className={`group cursor-pointer select-none whitespace-nowrap transition-colors hover:text-[var(--color-text-primary)] ${
            sortKey === "customer"
              ? "font-bold text-[var(--color-text-primary)]"
              : ""
          }`}
          onClick={() => onSort("customer")}
        >
          {t("orders.columns.customer")}
          {getSortIcon("customer")}
        </TableHead>

        {/* Date — hidden below sm */}
        <TableHead
          className={`group hidden cursor-pointer select-none whitespace-nowrap transition-colors hover:text-[var(--color-text-primary)] sm:table-cell ${
            sortKey === "date"
              ? "font-bold text-[var(--color-text-primary)]"
              : ""
          }`}
          onClick={() => onSort("date")}
        >
          {t("orders.columns.date")}
          {getSortIcon("date")}
        </TableHead>

        {/* Status — always visible */}
        <TableHead
          className={`group cursor-pointer select-none whitespace-nowrap transition-colors hover:text-[var(--color-text-primary)] ${
            sortKey === "status"
              ? "font-bold text-[var(--color-text-primary)]"
              : ""
          }`}
          onClick={() => onSort("status")}
        >
          {t("orders.columns.status")}
          {getSortIcon("status")}
        </TableHead>

        {/* Payment Status — hidden below md */}
        <TableHead
          className={`group hidden cursor-pointer select-none whitespace-nowrap transition-colors hover:text-[var(--color-text-primary)] md:table-cell ${
            sortKey === "paymentStatus"
              ? "font-bold text-[var(--color-text-primary)]"
              : ""
          }`}
          onClick={() => onSort("paymentStatus")}
        >
          {t("orders.columns.paymentStatus")}
          {getSortIcon("paymentStatus")}
        </TableHead>

        {/* Payment Method — hidden below lg */}
        <TableHead className="hidden whitespace-nowrap lg:table-cell">
          {t("orders.columns.paymentMethod")}
        </TableHead>

        {/* Total — always visible */}
        <TableHead
          className={`group cursor-pointer select-none whitespace-nowrap transition-colors hover:text-[var(--color-text-primary)] ${
            sortKey === "total"
              ? "font-bold text-[var(--color-text-primary)]"
              : ""
          }`}
          onClick={() => onSort("total")}
        >
          {t("orders.columns.total")}
          {getSortIcon("total")}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OrdersTableHeader;