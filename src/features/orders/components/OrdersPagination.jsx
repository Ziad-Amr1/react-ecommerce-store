

import { useState, useEffect } from "react";
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const OrdersPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const [startPage, setStartPage] = useState(1);

  useEffect(() => {
    if (currentPage < startPage) {
      setStartPage(currentPage);
    }
    else if (currentPage > startPage + 2) {
      setStartPage(currentPage - 2);
    }
  }, [currentPage, startPage]);

  const endPage = Math.min(totalPages, startPage + 2);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 text-sm text-[var(--color-text-secondary)]">
      <div>
        Page{" "}
        <span className="font-semibold text-[var(--color-text-primary)]">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[var(--color-text-primary)]">
          {totalPages}
        </span>
      </div>

      <PaginationUI className="mx-0 w-auto">
        <PaginationContent className="gap-2">
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={`border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-[var(--color-surface-secondary)]"
              }`}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {pages.map((page) => {
            const isActive = currentPage === page;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={isActive}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                  className={`size-8 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--color-primary)] font-bold text-white hover:bg-[var(--color-primary)]/90"
                      : "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)]"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Ellipsis */}
          {endPage < totalPages && (
            <PaginationItem>
              <PaginationEllipsis className="size-8 text-[var(--color-text-secondary)]" />
            </PaginationItem>
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={`border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-[var(--color-surface-secondary)]"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationUI>
    </div>
  );
};

export default OrdersPagination;