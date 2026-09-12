import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

export default function OrdersPagination({ currentPage, totalPages, isLoading, onPageChange }) {
  const { t } = useTranslation();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="border-t border-border px-6 py-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label={t("orders.pagination.previous")}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
              {t("orders.pagination.previous")}
            </Button>
          </PaginationItem>

          <PaginationItem>
            <span className="rounded-md border bg-muted/50 px-3 py-1.5 tabular-nums text-sm text-foreground">
              {currentPage} / {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label={t("orders.pagination.next")}
            >
              {t("orders.pagination.next")}
              <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}