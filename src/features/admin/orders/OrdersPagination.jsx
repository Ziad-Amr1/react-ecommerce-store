// import { useTranslation } from "react-i18next";

// import {
//   Pagination as PaginationUI,
//   PaginationContent,
//   PaginationItem,
//   PaginationPrevious,
//   PaginationNext,
//   PaginationLink,
//   PaginationEllipsis,
// } from "@/components/ui/pagination";

// const OrdersPagination = ({ currentPage, totalPages, onPageChange }) => {
//   const { t } = useTranslation();

//   if (totalPages <= 1) {
//     return null;
//   }

//   const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 2));
//   const endPage = Math.min(totalPages, startPage + 2);
//   const pages = [];
//   for (let i = startPage; i <= endPage; i++) {
//     pages.push(i);
//   }

//   return (
//     <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 text-sm text-[var(--color-text-secondary)]">
//       <div>
//         {t("orders.pagination.pageLabel")}{" "}
//         <span className="font-semibold text-[var(--color-text-primary)]">
//           {currentPage}
//         </span>{" "}
//         {t("orders.pagination.ofLabel")}{" "}
//         <span className="font-semibold text-[var(--color-text-primary)]">
//           {totalPages}
//         </span>
//       </div>

//       <PaginationUI className="mx-0 w-auto">
//         <PaginationContent className="gap-2">
//           {/* Previous */}
//           <PaginationItem>
//             <PaginationPrevious
//               href="#"
//               aria-label={t("orders.pagination.previous")}
//               aria-disabled={currentPage === 1}
//               tabIndex={currentPage === 1 ? -1 : undefined}
//               onClick={(e) => {
//                 e.preventDefault();
//                 if (currentPage > 1) {
//                   onPageChange(currentPage - 1);
//                 }
//               }}
//               className={`border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] ${
//                 currentPage === 1
//                   ? "pointer-events-none opacity-50"
//                   : "hover:bg-[var(--color-surface-secondary)]"
//               }`}
//             />
//           </PaginationItem>

//           {pages.map((page) => {
//             const isActive = currentPage === page;

//             return (
//               <PaginationItem key={page}>
//                 <PaginationLink
//                   href="#"
//                   isActive={isActive}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     onPageChange(page);
//                   }}
//                   className={`size-8 rounded-md text-xs font-medium transition-colors ${
//                     isActive
//                       ? "bg-[var(--color-primary)] font-bold text-white hover:bg-[var(--color-primary)]/90"
//                       : "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)]"
//                   }`}
//                 >
//                   {page}
//                 </PaginationLink>
//               </PaginationItem>
//             );
//           })}

//           {/* Ellipsis */}
//           {endPage < totalPages && (
//             <PaginationItem>
//               <PaginationEllipsis className="size-8 text-[var(--color-text-secondary)]" />
//             </PaginationItem>
//           )}

//           {/* Next */}
//           <PaginationItem>
//             <PaginationNext
//               href="#"
//               aria-label={t("orders.pagination.next")}
//               aria-disabled={currentPage === totalPages}
//               tabIndex={currentPage === totalPages ? -1 : undefined}
//               onClick={(e) => {
//                 e.preventDefault();
//                 if (currentPage < totalPages) {
//                   onPageChange(currentPage + 1);
//                 }
//               }}
//               className={`border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] ${
//                 currentPage === totalPages
//                   ? "pointer-events-none opacity-50"
//                   : "hover:bg-[var(--color-surface-secondary)]"
//               }`}
//             />
//           </PaginationItem>
//         </PaginationContent>
//       </PaginationUI>
//     </div>
//   );
// };

// export default OrdersPagination;

import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react"; // أو أي أيقونات بتستخدمها أصلاً

import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";


const OrdersPagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  if (totalPages <= 1) {
    return null;
  }

  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 2));
  const endPage = Math.min(totalPages, startPage + 2);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 text-sm text-[var(--color-text-secondary)]">
      <div>
        {t("orders.pagination.pageLabel")}{" "}
        <span className="font-semibold text-[var(--color-text-primary)]">
          {currentPage}
        </span>{" "}
        {t("orders.pagination.ofLabel")}{" "}
        <span className="font-semibold text-[var(--color-text-primary)]">
          {totalPages}
        </span>
      </div>

      <PaginationUI className="mx-0 w-auto">
        <PaginationContent className="gap-2">
          {/* Previous - بدل PaginationPrevious */}
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label={t("orders.pagination.previous")}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={`flex items-center gap-1 border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-[var(--color-surface-secondary)]"
              }`}
            >
              <ChevronRight className="size-4 rtl:hidden" />
              <ChevronLeft className="size-4 hidden rtl:block" />
              {t("orders.pagination.previous")}
            </PaginationLink>
          </PaginationItem>

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

          {endPage < totalPages && (
            <PaginationItem>
              <PaginationEllipsis className="size-8 text-[var(--color-text-secondary)]" />
            </PaginationItem>
          )}

          {/* Next - بدل PaginationNext */}
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label={t("orders.pagination.next")}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={`flex items-center gap-1 border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-[var(--color-surface-secondary)]"
              }`}
            >
              {t("orders.pagination.next")}
              <ChevronLeft className="size-4 rtl:hidden" />
              <ChevronRight className="size-4 hidden rtl:block" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </PaginationUI>
    </div>
  );
};

export default OrdersPagination;