import {
  PackageSearch,
  BanknoteArrowDown,
  ShieldCheck,
  Headset,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "../assets/hero.webp";
import ProsCard from "./ProsCard";
import ComingSoonButton from "./ComingSoonButton";

const prosItems = [
  {
    key: "variety",
    icon: PackageSearch,
  },
  {
    key: "returns",
    icon: BanknoteArrowDown,
  },
  {
    key: "secure",
    icon: ShieldCheck,
  },
  {
    key: "support",
    icon: Headset,
  },
];

export default function LandingHero() {
  const { t } = useTranslation();

  return (
    <section>
      <div className="flex flex-col items-center gap-8 py-10 md:flex-row md:items-center md:gap-6">
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold text-foreground font-display capitalize lg:text-4xl">
            {t("landing.hero.title")}
          </h1>
          <h2 className="mt-1 text-2xl font-bold text-foreground font-display capitalize lg:text-4xl">
            {t("landing.hero.subPre")}{" "}
            <span className="text-primary">{t("landing.hero.subHighlight")}</span>
          </h2>

          <p className="mt-4 max-w-xl leading-6 text-muted-foreground">
            {t("landing.hero.description")}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ComingSoonButton className="px-8 capitalize">
              {t("landing.hero.shopNow")}
            </ComingSoonButton>
            <ComingSoonButton className="px-6 capitalize">
              {t("landing.hero.explore")}
            </ComingSoonButton>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src={heroImage}
            alt={t("landing.hero.imageAlt")}
            className="w-full select-none rounded-xl shadow-sm"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {prosItems.map((item) => (
          <ProsCard
            key={item.key}
            icon={item.icon}
            titleKey={`landing.hero.pros.${item.key}.title`}
            descriptionKey={`landing.hero.pros.${item.key}.desc`}
          />
        ))}
      </div>
    </section>
  );
}