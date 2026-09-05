import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const BENEFIT_KEYS = [
  "auth.benefits.products",
  "auth.benefits.orders",
  "auth.benefits.customers",
];

const itemVariants = {
  success: "flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-4",
  surface: "flex items-center gap-3 rounded-xl bg-surface/10 p-4",
};

export default function AuthBenefits({ variant = "success" }) {
  const { t } = useTranslation();
  const isSuccess = variant === "success";
  const itemClasses = itemVariants[variant] ?? itemVariants.success;

  return (
    <ul className="space-y-4">
      {BENEFIT_KEYS.map((key) => (
        <li key={key} className={itemClasses}>
          {isSuccess ? (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--color-success-bg) text-(--color-success)">
              <Check className="size-4" aria-hidden="true" />
            </span>
          ) : (
            <Check className="h-6 w-6 shrink-0 text-(--color-success)" aria-hidden="true" />
          )}

          <span className="text-base font-medium">{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}