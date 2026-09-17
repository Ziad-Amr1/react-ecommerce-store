import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const shieldVariants = {
  primary:
    "size-14 rounded-lg border border-(--color-supporting) bg-primary-foreground/10 p-2",
  surface: "h-14 w-14 rounded-lg bg-surface/10 p-2",
};

export default function AuthHero({
  titleKey,
  subtitleKey,
  variant = "primary",
}) {
  const { t } = useTranslation();
  const shieldClasses = shieldVariants[variant] ?? shieldVariants.primary;

  return (
    <div>
      <div className="mb-10 flex items-center gap-3">
        <Shield className={shieldClasses} aria-hidden="true" />

        <span className="font-display text-4xl font-bold">
          {t("brand.name")}
        </span>
      </div>

      <h1 className="font-display text-4xl font-bold leading-tight text-balance">
        {t(titleKey)}
      </h1>

      <p className="mt-4 text-lg text-primary-foreground/80">
        {t(subtitleKey)}
      </p>
    </div>
  );
}