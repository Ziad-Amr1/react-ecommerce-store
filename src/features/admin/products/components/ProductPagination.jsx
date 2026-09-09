import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function ProductPagination({ currentPage, totalPages, isFetching, onPageChange }) {
  const { t } = useTranslation();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        disabled={currentPage === 1 || isFetching}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label={t("products.pagination.previous")}
      >
        {t("products.pagination.previous")}
      </Button>

      <span className="rounded-md border bg-card px-4 py-2 font-mono text-sm text-foreground">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={currentPage === totalPages || isFetching}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={t("products.pagination.next")}
      >
        {t("products.pagination.next")}
      </Button>
    </div>
  );
}