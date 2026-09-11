// import { useState, useEffect } from "react";
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

//   const [startPage, setStartPage] = useState(1);

//   useEffect(() => {
//     if (currentPage < startPage) {
//       setStartPage(currentPage);
//     } else if (currentPage > startPage + 2) {
//       setStartPage(currentPage - 2);
//     }
//   }, [currentPage, startPage]);

//   if (totalPages <= 1) {
//     return null;
//   }

//   const endPage = Math.min(totalPages, startPage + 2);
//   const pages = [];
//   for (let i = startPage; i <= endPage; i++) {
//     pages.push(i);
//   }

//   return (
//     <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 text-sm text-[var(--color-text-secondary)]">
//       <div>
//         Page{" "}
//         <span className="font-semibold text-[var(--color-text-primary)]">
//           {currentPage}
//         </span>{" "}
//         of{" "}
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

//           {/* Page Numbers */}
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

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const OrdersPagination = ({ currentPage, totalPages, onPageChange }) => {
  const [startPage, setStartPage] = useState(1);

  // ✅ ضبط قيمة startPage أثناء الـ render بدلاً من الاستعانة بـ useEffect لمنع أخطاء ESLint
  let targetStartPage = startPage;
  if (currentPage < startPage) {
    targetStartPage = currentPage;
  } else if (currentPage > startPage + 2) {
    targetStartPage = currentPage - 2;
  }

  if (targetStartPage !== startPage) {
    setStartPage(targetStartPage);
  }

  if (totalPages <= 1) return null;

  const visiblePages = Array.from(
    { length: Math.min(3, totalPages - targetStartPage + 1) },
    (_, i) => targetStartPage + i,
  );

  return (
    <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
      <p className="text-xs text-[var(--color-text-secondary)]">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </p>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={`cursor-pointer text-xs ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-[var(--color-surface)]"
              }`}
            />
          </PaginationItem>

          {targetStartPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className="cursor-pointer text-xs hover:bg-[var(--color-surface)]"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {targetStartPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className={`cursor-pointer text-xs ${
                  currentPage === page
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] hover:text-white"
                    : "hover:bg-[var(--color-surface)]"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {targetStartPage + 2 < totalPages && (
            <>
              {targetStartPage + 3 < totalPages && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  className="cursor-pointer text-xs hover:bg-[var(--color-surface)]"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              className={`cursor-pointer text-xs ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-[var(--color-surface)]"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default OrdersPagination;