import { useTranslation } from "react-i18next";
import { assetUrl } from "@/utils/assetUrl";
import { Link } from "react-router";
import { Wrench, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO/SEO";

export default function Maintenance() {
  const { t } = useTranslation();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <SEO
        title={t("maintenance.title", "We'll Be Right Back")}
        description={t(
          "maintenance.description",
          "Oversea Store is currently undergoing scheduled maintenance. Please check back soon.",
        )}
        url="/maintenance"
        noindex
      />
      <div
        className="pointer-events-none absolute -top-24 left-[-10%] size-96 rounded-full bg-(--color-info) opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-15%] right-[-8%] size-[28rem] rounded-full bg-(--color-supporting) opacity-20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center justify-center gap-5 text-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={assetUrl("logo.webp")}
            alt={t("brand.logoAlt")}
            className="size-9 shrink-0 object-contain"
          />
          <span className="font-(--font-display) text-lg font-bold text-(--color-text-primary)">
            {t("brand.name")}
          </span>
        </Link>

        <div className="flex size-20 items-center justify-center rounded-2xl bg-(--color-surface-secondary)">
          <Wrench
            className="size-10 text-(--color-supporting)"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-text-secondary)">
            {t("maintenance.badge", "Scheduled Maintenance")}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-(--color-text-primary) sm:text-5xl">
            {t("maintenance.title", "We'll Be Right Back")}
          </h1>
        </div>

        <p className="max-w-md text-sm leading-6 text-(--color-text-secondary)">
          {t(
            "maintenance.description",
            "Oversea Store is currently undergoing scheduled maintenance. Please check back soon.",
          )}
        </p>

        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            {t("maintenance.retry", "Try Again")}
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/contact">
              <Mail className="size-4" aria-hidden="true" />
              {t("maintenance.contact", "Contact Support")}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
