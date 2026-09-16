import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

export default function ContinueShoppingLink() {
  const { t } = useTranslation();

  return (
    <Link
      to="/products"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-text-secondary) hover:text-(--color-text-primary)"
    >
      <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />

      {t("cart.continueShopping", "Continue shopping")}
    </Link>
  );
}
