import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CategoryCard({ image, title }) {
  const { t } = useTranslation();

  return (
    <div className="group relative h-80 select-none overflow-hidden rounded-xl shadow-sm">
      <img src={image} alt={title} className="h-full w-full object-cover" />

      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-lg font-semibold text-white lg:text-xl">{title}</h3>

        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="mt-2 inline-flex cursor-not-allowed items-center gap-1.5 text-sm font-medium text-white/90"
              tabIndex={-1}
            >
              {t("landing.categories.shopNow")}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{t("landing.comingSoon")}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}