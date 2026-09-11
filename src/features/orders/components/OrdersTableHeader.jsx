import React from 'react'
import { useTranslation } from "react-i18next";

import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const OrdersTableHeader = ({ onSort, getSortIcon, sortKey }) => {
  const { t } = useTranslation();
  return (
    <TableHeader>
      <TableRow className="bg-[var(--color-surface-secondary)]">
        <TableHead>{t("orders.columns.order")}</TableHead>

        <TableHead
          className={`group cursor-pointer select-none transition-colors hover:text-[var(--color-text-primary)] ${
            sortKey === "customer"
              ? "font-bold text-[var(--color-text-primary)]"
              : ""
          }`}
          onClick={() => onSort("customer")}
        >
          {t("orders.columns.customer")}
          {getSortIcon("customer")}
        </TableHead>

        <TableHead
          className={`group cursor-pointer select-none transition-colors hover:text-[var(--color-text-primary)] ${
            sortKey === "date"
              ? "font-bold text-[var(--color-text-primary)]"
              : ""
          }`}
          onClick={() => onSort("date")}
        >
          {t("orders.columns.date")}
          {getSortIcon("date")}
        </TableHead>

        <TableHead
          className={`group cursor-pointer select-none transition-colors hover:text-[var(--color-text-primary)] ${
            sortKey === "status"
              ? "font-bold text-[var(--color-text-primary)]"
              : ""
          }`}
          onClick={() => onSort("status")}
        >
          {t("orders.columns.status")}
          {getSortIcon("status")}
        </TableHead>

        <TableHead
          className={`group cursor-pointer select-none transition-colors hover:text-[var(--color-text-primary)] ${
            sortKey === "paymentStatus"
              ? "font-bold text-[var(--color-text-primary)]"
              : ""
          }`}
          onClick={() => onSort("paymentStatus")}
        >
          {t("orders.columns.paymentStatus")}
          {getSortIcon("paymentStatus")}
        </TableHead>

        <TableHead>{t("orders.columns.paymentMethod")}</TableHead>

        <TableHead
          className={`group cursor-pointer select-none transition-colors hover:text-[var(--color-text-primary)] ${
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

export default OrdersTableHeader