import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CategoryCard({ image, title, category }) {
  const { t } = useTranslation();

  return (
    <Link to={`/products?category=${encodeURIComponent(category)}`}>
      <article className="group relative h-80 overflow-hidden rounded-xl shadow-sm cursor-pointer">
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
          <h3 className="text-lg font-semibold text-white lg:text-xl">
            {title}
          </h3>

          <div className="flex text-white mt-2">
            {t("landing.categories.shopNow")}
            <ArrowUpRight
              className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:motion-safe:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
