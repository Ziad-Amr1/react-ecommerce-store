import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function CartEmpty() {
  const { t } = useTranslation();

  return (
    <Empty className="mt-6 rounded-2xl border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingCart className="size-6" aria-hidden="true" />
        </EmptyMedia>

        <EmptyTitle>{t("cart.emptyTitle", "Your cart is empty")}</EmptyTitle>

        <EmptyDescription>
          {t(
            "cart.emptyDescription",
            "Explore our products and add items to your cart.",
          )}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button asChild className="rounded-xl">
          <Link to="/products">
            {t("cart.browseProducts", "Browse Products")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
