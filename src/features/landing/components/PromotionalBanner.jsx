import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import bannerImage from "../assets/banner2.webp";

export default function PromotionalBanner() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="promo-banner-title"
      className="relative mt-16 min-h-52 overflow-hidden rounded-xl md:min-h-64 lg:min-h-72"
    >
      {/* Image as an <img> so the browser can prioritise it and we get
          proper width/height. Absolutely positioned behind the copy. */}
      <img
        src={bannerImage}
        alt=""
        loading="lazy"
        decoding="async"
        width={1600}
        height={600}
        className="absolute inset-0 size-full object-cover"
      />

      {/* Directional scrim: darker from the reading edge, fading outward.
          Mirrored in RTL so the text side stays the dark side. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent rtl:bg-linear-to-l"
      />

      <div className="relative flex h-full flex-col justify-center p-6 text-white md:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
          {t("landing.banner.label")}
        </p>

        <h2
          id="promo-banner-title"
          className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl"
        >
          {t("landing.banner.headline")}
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-white/85 md:text-base">
          {t("landing.banner.description")}
        </p>

        <Button
          asChild
          variant="outline"
          className="mt-5 w-fit border-white/60 bg-white/0 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Link to="/products">
            {t("landing.banner.cta")}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
