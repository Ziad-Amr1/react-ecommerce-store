import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyOrdersError({ onRetry }) {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center shadow-xs"
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-(--color-error-bg) text-(--color-error)">
        <AlertCircle className="size-8" aria-hidden="true" />
      </div>

      <h2 className="font-display text-lg font-semibold text-(--color-text-primary)">
        {t("myOrders.loadErrorTitle")}
      </h2>

      <p className="mt-1 max-w-md text-sm text-(--color-text-secondary)">
        {t("myOrders.loadErrorDescription")}
      </p>

      <Button className="mt-6 cursor-pointer" onClick={onRetry}>
        {t("myOrders.retry")}
      </Button>
    </div>
  );
}
