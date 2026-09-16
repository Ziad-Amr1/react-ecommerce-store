import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";

export default function CartLoadError() {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-(--color-error) bg-(--color-error-bg) p-4 text-sm text-(--color-error)">
      <TriangleAlert className="size-5 shrink-0" aria-hidden="true" />

      <p>
        {t(
          "cart.loadFailed",
          "We couldn't load your cart. Please refresh the page or try again in a moment.",
        )}
      </p>
    </div>
  );
}
