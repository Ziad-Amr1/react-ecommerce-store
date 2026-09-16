import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/formatNumber";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

export default function AdminTablePagination({
  currentPage,
  totalPages,
  loading,
  onPageChange,
  labelPrefix,
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en-US";

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1 || loading}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label={t(`${labelPrefix}.previous`)}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            {t(`${labelPrefix}.previous`)}
          </Button>
        </PaginationItem>

        <PaginationItem>
          <span className="rounded-md border bg-muted/50 px-3 py-1.5 tabular-nums text-sm text-foreground">
            {formatNumber(currentPage, locale)} / {formatNumber(totalPages, locale)}
          </span>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || loading}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label={t(`${labelPrefix}.next`)}
          >
            {t(`${labelPrefix}.next`)}
            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}