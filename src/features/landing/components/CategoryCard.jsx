import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CategoryCard({ image, title }) {
  const { t } = useTranslation();

  return (
    <article className="group relative h-80 overflow-hidden rounded-xl shadow-sm">
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Bottom-to-top overlay: deep at the base, fading up so the headline and CTA stay legible over any image. */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0
          bg-linear-to-t
          from-black/85
          via-black/45
          to-transparent
          transition-opacity duration-300
          group-hover:from-black/90
          group-hover:via-black/55
        "
      />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-lg font-semibold text-white lg:text-xl">{title}</h3>

        <Link
          to="/products"
          className="mt-2 inline-flex h-auto items-center gap-1.5 p-0 text-sm font-medium text-white/90 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {t("landing.categories.shopNow")}
          <ArrowUpRight
            className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:motion-safe:group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
