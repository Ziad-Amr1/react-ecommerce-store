import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { assetUrl } from "@/utils/assetUrl";

export default function StoreFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-(--color-surface)">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src={assetUrl("logo.webp")}
              alt={t("brand.logoAlt")}
              className="size-8 shrink-0 object-contain"
            />
            <span className="font-(--font-display) text-base font-bold text-(--color-text-primary)">
              {t("brand.name")}
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-(--color-text-secondary)">
            {t("store.footer.tagline")}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-(--color-text-primary)">
            {t("store.footer.groups.shop")}
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                to="/"
                className="text-sm text-(--color-text-secondary) hover:text-(--color-link) transition-colors"
              >
                {t("store.footer.links.home")}
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="text-sm text-(--color-text-secondary) hover:text-(--color-link) transition-colors"
              >
                {t("store.footer.links.catalog", "Categories & Catalog")}
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-sm text-(--color-text-secondary) hover:text-(--color-link) transition-colors"
              >
                {t("store.footer.links.newArrivals", "Shop All Products")}
              </Link>
            </li>
            <li>
              <Link
                to="/products?sale=true"
                className="text-sm text-(--color-text-secondary) hover:text-(--color-link) transition-colors"
              >
                {t("store.footer.links.sale", "Sale & Offers")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-(--color-text-primary)">
            {t("store.footer.groups.support")}
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                to="/privacy"
                className="text-sm text-(--color-text-secondary) hover:text-(--color-link) transition-colors"
              >
                {t("store.footer.links.privacy", "Privacy Policy")}
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="text-sm text-(--color-text-secondary) hover:text-(--color-link) transition-colors"
              >
                {t("store.footer.links.helpCenter", "Help Center & FAQ")}
              </Link>
            </li>
            <li>
              <Link
                to="/shipping"
                className="text-sm text-(--color-text-secondary) hover:text-(--color-link) transition-colors"
              >
                {t("store.footer.links.shippingReturns", "Shipping & Returns")}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-sm text-(--color-text-secondary) hover:text-(--color-link) transition-colors"
              >
                {t("store.footer.links.contact", "Contact Us")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-(--color-text-secondary)">
            &copy; {currentYear} {t("brand.name")}. {t("store.footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
