import { useTranslation } from "react-i18next";
import { ShieldCheck, Lock, Eye, Database, FileText } from "lucide-react";
import useDocumentMeta from "@/hooks/useDocumentMeta";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  useDocumentMeta({
    title: t("privacy.title", { defaultValue: "Privacy Policy" }),
    description: t("privacy.description", { defaultValue: "Read Oversea Store's privacy policy and data collection practices." }),
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8 font-body">
      <div className="space-y-3 text-center sm:text-start border-b border-(--color-border) pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span>{t("privacy.badge", { defaultValue: "Data Transparency & Security" })}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-foreground">
          {t("privacy.headline", { defaultValue: "Privacy Policy" })}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t("privacy.lastUpdated", { defaultValue: "Last updated: September 18, 2026" })} ·{" "}
          <span className="font-medium text-(--color-warning)">
            {t("privacy.legalNotice", { defaultValue: "Requires formal legal review before production deployment." })}
          </span>
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-foreground">
        <section className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-7 shadow-xs">
          <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
            <Lock className="size-5 text-primary" />
            {t("privacy.overview.heading", { defaultValue: "1. Overview & Data Collected" })}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("privacy.overview.body", {
              defaultValue:
                "Oversea Store respects your privacy and is committed to protecting personal data. We collect only the data necessary to fulfill e-commerce transactions, secure account access, and maintain service availability:",
            })}
          </p>
          <ul className="list-disc ps-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
            <li>{t("privacy.overview.items.account", { defaultValue: "Account Data: Username, email address, hashed password, phone number, and optional avatar URL upon registration." })}</li>
            <li>{t("privacy.overview.items.order", { defaultValue: "Order & Fulfillment Data: Shipping address, customer name, contact phone number, items purchased, line-item pricing, and order status tracking." })}</li>
            <li>{t("privacy.overview.items.session", { defaultValue: "Session & Security Data: HttpOnly session authentication cookies (no raw passwords or access tokens are stored in browser local storage)." })}</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-7 shadow-xs">
          <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
            <Database className="size-5 text-primary" />
            {t("privacy.usage.heading", { defaultValue: "2. How We Use Your Information" })}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("privacy.usage.body", {
              defaultValue:
                "Personal data collected by Oversea Store is strictly utilized for operational, fulfillment, and account governance purposes:",
            })}
          </p>
          <ul className="list-disc ps-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
            <li>{t("privacy.usage.items.orders", { defaultValue: "Processing, fulfilling, and delivering customer orders." })}</li>
            <li>{t("privacy.usage.items.security", { defaultValue: "Sending critical transactional order updates and OTP security codes for password reset or email verification." })}</li>
            <li>{t("privacy.usage.items.governance", { defaultValue: "Enforcing role-based admin governance and protecting platform security." })}</li>
            <li>{t("privacy.usage.items.compliance", { defaultValue: "Maintaining required legal and audit records for past commercial sales." })}</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-7 shadow-xs">
          <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
            <Eye className="size-5 text-primary" />
            {t("privacy.cookies.heading", { defaultValue: "3. Cookies & Session Storage" })}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("privacy.cookies.body", {
              defaultValue:
                "Oversea Store uses essential cookies solely to maintain authenticated sessions via HttpOnly attributes. We do not use third-party tracking or advertising cookies.",
            })}
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-7 shadow-xs">
          <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
            <FileText className="size-5 text-primary" />
            {t("privacy.rights.heading", { defaultValue: "4. User Rights & Account Deletion" })}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("privacy.rights.body", {
              defaultValue:
                "Users retain full rights to update their personal profile or request account deletion via the Profile page. When an account is deleted, the authentication credential record is permanently removed, while past order receipts are archived for legal accounting compliance.",
            })}
          </p>
        </section>
      </div>
    </main>
  );
}
