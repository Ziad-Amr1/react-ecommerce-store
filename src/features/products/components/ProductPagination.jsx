import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function ProductPagination({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}) {
  const { t } = useTranslation();

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        aria-label={t("shop.pagePreviousAria")}
      >
        <ChevronLeft className="size-4 rtl:rotate-180" />
        {t("shop.pagePrevious")}
      </Button>

      <span className="text-sm text-[var(--color-text-secondary)]">
        {t("shop.pageOf", { current: currentPage, total: totalPages })}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        aria-label={t("shop.pageNextAria")}
      >
        {t("shop.pageNext")}
        <ChevronRight className="size-4 rtl:rotate-180" />
      </Button>

      {isLoading && (
        <Loader2 className="size-4 animate-spin text-[var(--color-primary)]" />
      )}
    </div>
  );
}
