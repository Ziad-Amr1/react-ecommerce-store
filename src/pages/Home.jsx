import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col items-center justify-center gap-4 px-6 py-16 lg:px-8">
        <h1 className="font-display text-5xl font-bold tracking-tight text-(--color-text-primary) sm:text-6xl">
          {t("home.title")}
        </h1>
    </main>
  )}
  