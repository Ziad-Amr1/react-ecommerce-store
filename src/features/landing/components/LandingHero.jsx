import { Link } from "react-router";
import {
  PackageSearch,
  BanknoteArrowDown,
  ShieldCheck,
  Headset,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "../assets/hero.webp";
import ProsCard from "./ProsCard";
import { Button } from "@/components/ui/button";

const prosItems = [
  { key: "variety", icon: PackageSearch },
  { key: "returns", icon: BanknoteArrowDown },
  { key: "secure", icon: ShieldCheck },
  { key: "support", icon: Headset },
];

export default function LandingHero() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="landing-hero-title"
      className="relative overflow-hidden xl:left-1/2 xl:w-screen xl:-translate-x-1/2"
    >
      <div className="mx-auto w-full xl:px-16 2xl:px-24">
        {/* Split hero: message left, visual right — the highest-performing
            layout for 2025 (value + proof + action above the fold). */}
        <div className="grid items-center gap-10 pt-10 lg:grid-cols-2 lg:gap-16 lg:pt-16 2xl:gap-20 2xl:pt-24">
          {/* ── Left: message ─────────────────────────────────────── */}
          <header className="flex flex-col items-start gap-6 xl:max-w-[38rem] 2xl:max-w-[42rem]">
            <div className="space-y-4">
              <h1
                id="landing-hero-title"
                className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
              >
                {t("landing.hero.title")}
              </h1>

              <h2 className="font-display text-lg font-semibold text-muted-foreground lg:text-xl xl:text-2xl 2xl:text-3xl">
                {t("landing.hero.subPre")}{" "}
                <span className="text-primary">
                  {t("landing.hero.subHighlight")}
                </span>
              </h2>

              <p className="max-w-xl text-base leading-7 text-muted-foreground xl:text-lg xl:leading-8 2xl:text-xl 2xl:leading-9">
                {t("landing.hero.description")}
              </p>
            </div>

            {/* Dual CTAs: primary filled, secondary outline — both lead to the
              real storefront catalog (/products, shipped with the shop PR). */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row xl:gap-4">
              <Button asChild className="w-full px-8 sm:w-auto">
                <Link to="/products">{t("landing.hero.shopNow")}</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full px-6 sm:w-auto"
              >
                <Link to="/products">
                  {t("landing.hero.explore")}
                  <ArrowRight
                    className="size-4 rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </header>

          {/* ── Right: visual ─────────────────────────────────────── */}
          <figure className="relative">
            <img
              src={heroImage}
              alt={t("landing.hero.imageAlt")}
              width={1200}
              height={800}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="mx-auto w-full max-w-md rounded-2xl object-cover shadow-lg xl:max-w-xl 2xl:max-w-3xl"
            />

            {/* Decorative accent halo behind the image — uses the
                accent token so it adapts to dark mode automatically. */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-3xl bg-(--color-accent)/50 blur-2xl"
            />
          </figure>
        </div>

        {/* ── Value props ───────────────────────────────────────── */}
        <ul
          role="list"
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:mt-20 2xl:gap-6"
        >
          {prosItems.map((item) => (
            <li key={item.key}>
              <ProsCard
                icon={item.icon}
                titleKey={`landing.hero.pros.${item.key}.title`}
                descriptionKey={`landing.hero.pros.${item.key}.desc`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
