import { useTranslation } from "react-i18next";
import useMyOrders from "@/features/my-orders/hooks/useMyOrders";
import OrderCard from "@/features/my-orders/components/OrderCard";
import MyOrdersSkeleton from "@/features/my-orders/components/MyOrdersSkeleton";
import MyOrdersError from "@/features/my-orders/components/MyOrdersError";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

export default function MyOrders(){
  const { t } = useTranslation();
  const { orders, status, refetch, currentPage, totalPages, goToPage } = useMyOrders();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("orders.title", "My Orders")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("orders.description", "View and manage your orders.")}</p>
      </div>

      {status === "loading" ? (
        <MyOrdersSkeleton />
      ) : status === "error" ? (
        <MyOrdersError onRetry={refetch} />
      ) : orders.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-lg font-semibold"> {t("orders.emptyTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("orders.emptyDescription")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();

                      if(currentPage > 1){
                        goToPage(currentPage - 1);
                      }
                    }}
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : undefined}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : undefined
                    }
                  />
                </PaginationItem>

                {/* Page numbers */}
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        goToPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();

                      if(currentPage < totalPages){
                        goToPage(currentPage + 1);
                      }
                    }}
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? -1 : undefined}
                    className={
                      currentPage === totalPages ? "pointer-events-none opacity-50" : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </main>
  );
} 