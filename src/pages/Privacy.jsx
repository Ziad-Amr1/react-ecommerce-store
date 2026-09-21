import { useTranslation } from "react-i18next";
import { ShieldCheck, Lock, Eye, Database, FileText } from "lucide-react";
import SEO from "@/components/SEO/SEO";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-5xl py-8 sm:py-12 space-y-8 font-body">
      <SEO
        title={t("privacy.title")}
        description={t("privacy.description")}
        url="/privacy"
      />
      <div className="space-y-3 text-center sm:text-start border-b border-(--color-border) pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span>{t("privacy.badge")}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-foreground">
          {t("privacy.headline")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t("privacy.lastUpdated")} ·{" "}
          <span className="font-medium text-(--color-warning)">
            {t("privacy.legalNotice")}
          </span>
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-foreground">
        <section className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-7 shadow-xs">
          <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
            <Lock className="size-5 text-primary" />
            {t("privacy.overview.heading")}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("privacy.overview.body")}
          </p>
          <ul className="list-disc ps-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
            <li>{t("privacy.overview.items.account")}</li>
            <li>{t("privacy.overview.items.order")}</li>
            <li>{t("privacy.overview.items.session")}</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-7 shadow-xs">
          <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
            <Database className="size-5 text-primary" />
            {t("privacy.usage.heading")}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("privacy.usage.body")}
          </p>
          <ul className="list-disc ps-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
            <li>{t("privacy.usage.items.orders")}</li>
            <li>{t("privacy.usage.items.security")}</li>
            <li>{t("privacy.usage.items.governance")}</li>
            <li>{t("privacy.usage.items.compliance")}</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-7 shadow-xs">
          <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
            <Eye className="size-5 text-primary" />
            {t("privacy.cookies.heading")}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("privacy.cookies.body")}
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-7 shadow-xs">
          <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
            <FileText className="size-5 text-primary" />
            {t("privacy.rights.heading")}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("privacy.rights.body")}
          </p>
        </section>
      </div>
    </div>
  );
}
