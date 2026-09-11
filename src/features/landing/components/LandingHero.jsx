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
import ComingSoonButton from "./ComingSoonButton";
import { Badge } from "@/components/ui/badge";

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
      className="relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        {/* Split hero: message left, visual right — the highest-performing
            layout for 2025 (value + proof + action above the fold). */}
        <div className="grid items-center gap-10 pt-10 lg:grid-cols-2 lg:gap-16 lg:pt-16">
          {/* ── Left: message ─────────────────────────────────────── */}
          <header className="flex flex-col items-start gap-6">
            {/* Announcement pill — common shadcn hero pattern */}
            <Badge
              variant="outline"
              className="border-(--color-supporting) bg-(--color-accent) text-(--color-on-accent)"
            >
              {t("landing.hero.badge")}
            </Badge>

            <div className="space-y-4">
              <h1
                id="landing-hero-title"
                className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              >
                {t("landing.hero.title")}
              </h1>

              <h2 className="font-display text-lg font-semibold text-muted-foreground lg:text-xl">
                {t("landing.hero.subPre")}{" "}
                <span className="text-primary">
                  {t("landing.hero.subHighlight")}
                </span>
              </h2>

              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                {t("landing.hero.description")}
              </p>
            </div>

            {/* Dual CTAs: primary filled, secondary outline */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <ComingSoonButton className="px-8">
                {t("landing.hero.shopNow")}
              </ComingSoonButton>

              <ComingSoonButton
                variant="outline"
                className="px-6"
              >
                {t("landing.hero.explore")}
                <ArrowRight
                  className="size-4 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              </ComingSoonButton>
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
              className="w-full rounded-2xl object-cover shadow-lg"
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
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
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