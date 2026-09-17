import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyOrders() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] bg-(--color-surface-secondary) py-12 font-body text-(--color-text-primary)">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-(--color-text-primary)">
            {t("myOrders.title", { defaultValue: "My Orders" })}
          </h1>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            {t("myOrders.subtitle", { defaultValue: "View and track your personal orders." })}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center shadow-xs">
          <div className="flex size-16 items-center justify-center rounded-full bg-(--color-surface-secondary) text-(--color-text-secondary) mb-4">
            <ShoppingBag className="size-8 opacity-60" aria-hidden="true" />
          </div>

          <h2 className="font-display text-lg font-semibold text-(--color-text-primary)">
            {t("myOrders.emptyTitle", { defaultValue: "No orders yet" })}
          </h2>

          <p className="mt-1 max-w-md text-sm text-(--color-text-secondary)">
            {t("myOrders.emptyDescription", { defaultValue: "You haven't placed any orders yet. Start shopping to fill your order history!" })}
          </p>

          <Button asChild className="mt-6 rounded-full gap-2 cursor-pointer">
            <Link to="/products">
              {t("myOrders.browseProducts", { defaultValue: "Browse Products" })}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
