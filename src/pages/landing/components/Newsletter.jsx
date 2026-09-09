import { Mail, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComingSoonButton from "./ComingSoonButton";

export default function Newsletter() {
  const { t } = useTranslation();

  return (
    <section className="my-10 flex select-none flex-col items-center justify-between gap-6 rounded-xl border border-border bg-card px-6 py-8 md:flex-row md:px-8">
      <div className="flex w-full items-center gap-4 md:w-1/2">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <Mail className="size-7" aria-hidden="true" />
        </div>

        <div className="font-display">
          <h2 className="text-base font-semibold text-foreground capitalize md:text-lg">
            {t("landing.newsletter.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("landing.newsletter.description")}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row md:w-1/2 md:justify-end">
        <div className="w-full sm:max-w-xs">
          <Label htmlFor="newsletter-email" className="sr-only">
            {t("landing.newsletter.emailLabel")}
          </Label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder={t("landing.newsletter.emailPlaceholder")}
            autoComplete="email"
          />
        </div>

        <ComingSoonButton className="capitalize">
          {t("landing.newsletter.subscribe")}
          <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </ComingSoonButton>
      </div>
    </section>
  );
}