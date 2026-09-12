import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";

export default function Cart() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-bold text-foreground">
        {t("cart.title")}
      </h1>

      <Empty className="mt-6 border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingCart className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>{t("cart.emptyTitle")}</EmptyTitle>
          <EmptyDescription>{t("cart.emptyDescription")}</EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button asChild>
            <Link to="/products">{t("cart.browseProducts")}</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}