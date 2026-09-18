import { Link, Navigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { CheckCircle2, PackageCheck, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  const { t } = useTranslation();
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!location.state?.fromCheckout) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6">
      <span className="flex size-20 items-center justify-center rounded-full bg-(--color-success-bg) text-(--color-success)">
        <PackageCheck className="size-10" aria-hidden="true" />
      </span>

      <h1 className="mt-6 font-display text-2xl font-bold text-foreground sm:text-3xl">
        {t("orderSuccess.title")}
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        {t("orderSuccess.description")}
      </p>

      {orderId && (
        <p className="mt-4 flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface-secondary) px-4 py-2 text-sm text-(--color-text-primary)">
          <CheckCircle2
            className="size-4 text-(--color-success)"
            aria-hidden="true"
          />
          {t("orderSuccess.orderRef", { id: orderId })}
        </p>
      )}

      <div className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Button
          asChild
          className="bg-(--color-primary) text-primary-foreground hover:bg-(--color-secondary)"
        >
          <Link to="/my-orders">{t("orderSuccess.myOrders")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/products" className="gap-2">
            <ShoppingBag className="size-4" aria-hidden="true" />
            {t("orderSuccess.continueShopping")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
