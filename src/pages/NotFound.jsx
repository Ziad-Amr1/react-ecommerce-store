import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] size-96 rounded-full bg-(--color-info) opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-15%] left-[-8%] size-[28rem] rounded-full bg-(--color-supporting) opacity-20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center justify-center gap-5 text-center">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-(--color-surface-secondary)">
          <TriangleAlert
            className="size-10 text-(--color-supporting)"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="font-display text-5xl font-bold tracking-tight text-(--color-text-primary) sm:text-6xl">
            {t("notFound.title")}
          </h1>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-text-secondary)">
            {t("notFound.code")}
          </p>
          <h2 className="font-display text-2xl font-bold text-(--color-text-primary)">
            {t("notFound.subtitle")}
          </h2>
        </div>

        <p className="max-w-md text-sm leading-6 text-(--color-text-secondary)">
          {t("notFound.description")}
        </p>

        <Button asChild className="mt-2">
          <Link to="/">{t("notFound.home")}</Link>
        </Button>
      </div>
    </main>
  );
}