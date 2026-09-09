import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ComingSoonText({ label }) {
  const { t } = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="w-fit cursor-default text-sm text-(--color-text-secondary)">
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">{t("landing.comingSoon")}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function StoreFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-(--color-surface)">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/favicon.ico"
              alt={t("brand.logoAlt")}
              className="h-8 object-contain"
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
                className="text-sm text-(--color-text-secondary) hover:text-(--color-link)"
              >
                {t("store.footer.links.home")}
              </Link>
            </li>
            <li>
              <ComingSoonText label={t("store.footer.links.catalog")} />
            </li>
            <li>
              <ComingSoonText label={t("store.footer.links.newArrivals")} />
            </li>
            <li>
              <ComingSoonText label={t("store.footer.links.sale")} />
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-(--color-text-primary)">
            {t("store.footer.groups.support")}
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <ComingSoonText label={t("store.footer.links.helpCenter")} />
            </li>
            <li>
              <ComingSoonText label={t("store.footer.links.shippingReturns")} />
            </li>
            <li>
              <ComingSoonText label={t("store.footer.links.contact")} />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-(--color-text-secondary)">
            © {currentYear} {t("brand.name")}. {t("store.footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}