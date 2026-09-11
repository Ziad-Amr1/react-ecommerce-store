

import React from 'react'
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/utils/formatNumber";

const OrdersHeader = ({ totalOrders }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
          {t("orders.subtitle")}
        </p>

        <h1 className="mt-1 font-display text-3xl font-bold text-[var(--color-text-primary)]">
          {t("orders.title")}
        </h1>
      </div>

      <Card className="border-[var(--color-border)] bg-[var(--color-surface)] py-0 shadow-[var(--shadow-sm)]">
        <CardContent className="flex items-center gap-2.5 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
            <Package className="h-4 w-4 text-[var(--color-primary)]" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold tabular-nums text-[var(--color-text-primary)]">
              {formatNumber(totalOrders, i18n.language || "en-US")}
            </span>

            <span className="text-[11px] text-[var(--color-text-secondary)]">
              {t("orders.totalOrders")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersHeader