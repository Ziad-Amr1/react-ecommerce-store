import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function ProductPageHeader({ titleKey, descriptionKey, onBack }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <Button variant="outline" className="mb-4" onClick={onBack}>
        <ArrowLeft className="size-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
        {t("products.backToList")}
      </Button>

      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t(titleKey)}
        </h1>
        <p className="text-sm text-muted-foreground">{t(descriptionKey)}</p>
      </div>
    </div>
  );
}