import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import bannerImage from "../assets/banner2.webp";
import ComingSoonButton from "./ComingSoonButton";

export default function PromotionalBanner() {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t("landing.banner.imageAlt")}
      className="relative my-10 h-52 select-none overflow-hidden rounded-xl bg-cover bg-center md:h-64 lg:h-72"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-black/55 to-transparent" />

      <div className="relative flex h-full flex-col justify-center p-6 text-white md:p-8">
        <span className="font-semibold uppercase tracking-wide">
          {t("landing.banner.label")}
        </span>
        <p className="mt-2 text-2xl font-bold md:text-3xl lg:text-4xl">
          {t("landing.banner.headline")}
        </p>
        <p className="mt-1 text-sm text-white/85 md:text-base">
          {t("landing.banner.description")}
        </p>

        <ComingSoonButton
          variant="outline"
          className="mt-5 w-fit border-white/60 bg-transparent text-white capitalize hover:bg-white/10"
        >
          {t("landing.banner.cta")}
          <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </ComingSoonButton>
      </div>
    </section>
  );
}