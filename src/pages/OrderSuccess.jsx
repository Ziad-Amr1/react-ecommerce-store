import { Link, useLocation, Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { CheckCircle2, PackageSearch, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderSuccess() {
  const { t } = useTranslation();
  const location = useLocation();

  // Only reachable right after a real order was created (see Checkout.jsx).
  // Guards against someone landing here directly via the URL.
  const orderId = location.state?.orderId;
  const cameFromCheckout = Boolean(location.state?.fromCheckout);

  if (!cameFromCheckout) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
      <Card className="w-full border-(--color-border)">
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <div className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-9" aria-hidden="true" />
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("orderSuccess.title")}
          </h1>

          <p className="max-w-md text-sm text-muted-foreground">
            {t("orderSuccess.description")}
          </p>

          {orderId && (
            <p className="font-mono text-xs text-muted-foreground">
              {t("orderSuccess.orderRef", { id: String(orderId).slice(0, 8) })}
            </p>
          )}

          <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="border-(--color-border)">
              <Link to="/profile">
                <PackageSearch className="size-4" aria-hidden="true" />
                {t("orderSuccess.myOrders")}
              </Link>
            </Button>

            <Button
              asChild
              className="bg-(--color-primary) text-primary-foreground hover:bg-(--color-secondary)"
            >
              <Link to="/products">
                <ShoppingBag className="size-4" aria-hidden="true" />
                {t("orderSuccess.continueShopping")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
