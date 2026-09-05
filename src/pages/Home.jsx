import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 lg:px-8">
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <div className="space-y-6">
          <h1 className="font-display text-5xl font-bold tracking-tight text-(--color-text-primary) sm:text-6xl">
            {t("home.title")}
          </h1>

          <p className="mx-auto max-w-xl text-base leading-7 text-(--color-text-secondary) sm:text-lg">
            {t("home.description")}
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => handleNavigate("/login")}
          >
            {t("home.login")}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full border border-(--color-border) sm:w-auto"
            onClick={() => handleNavigate("/design-system")}
          >
            {t("home.designSystem")}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-(--color-text-secondary)">
          {t("home.comingSoon")}
        </p>
      </div>
    </main>
  );
}
