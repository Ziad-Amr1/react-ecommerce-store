import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] bg-(--color-surface-secondary) py-12 font-body text-(--color-text-primary)">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-(--color-text-primary)">
            {t("wishlist.title", { defaultValue: "Wishlist" })}
          </h1>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            {t("wishlist.subtitle", { defaultValue: "Items you've saved for later." })}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center shadow-xs">
          <div className="flex size-16 items-center justify-center rounded-full bg-(--color-surface-secondary) text-(--color-text-secondary) mb-4">
            <Heart className="size-8 opacity-60" aria-hidden="true" />
          </div>

          <h2 className="font-display text-lg font-semibold text-(--color-text-primary)">
            {t("wishlist.emptyTitle", { defaultValue: "Your wishlist is empty" })}
          </h2>

          <p className="mt-1 max-w-md text-sm text-(--color-text-secondary)">
            {t("wishlist.emptyDescription", { defaultValue: "Save items you like while browsing to find them easily later." })}
          </p>

          <Button asChild className="mt-6 rounded-full gap-2 cursor-pointer">
            <Link to="/products">
              {t("wishlist.browseProducts", { defaultValue: "Browse Products" })}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
