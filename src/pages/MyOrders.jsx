import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminTablePagination from "@/features/admin/components/AdminTablePagination";
import useMyOrders from "@/features/my-orders/hooks/useMyOrders";
import OrderCard from "@/features/my-orders/components/OrderCard";
import MyOrdersSkeleton from "@/features/my-orders/components/MyOrdersSkeleton";
import MyOrdersError from "@/features/my-orders/components/MyOrdersError";

export default function MyOrders() {
  const { t } = useTranslation();
  const { orders, status, refetch, currentPage, totalPages, goToPage } =
    useMyOrders();

  const isLoading = status === "loading";

  return (
    <div className="min-h-[70vh] bg-(--color-surface-secondary) py-12 font-body text-(--color-text-primary)">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-(--color-text-primary)">
            {t("myOrders.title")}
          </h1>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            {t("myOrders.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <MyOrdersSkeleton />
        ) : status === "error" ? (
          <MyOrdersError onRetry={refetch} />
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center shadow-xs">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-(--color-surface-secondary) text-(--color-text-secondary)">
              <ShoppingBag className="size-8 opacity-60" aria-hidden="true" />
            </div>

            <h2 className="font-display text-lg font-semibold text-(--color-text-primary)">
              {t("myOrders.emptyTitle")}
            </h2>

            <p className="mt-1 max-w-md text-sm text-(--color-text-secondary)">
              {t("myOrders.emptyDescription")}
            </p>

            <Button asChild className="mt-6 rounded-full gap-2 cursor-pointer">
              <Link to="/products">
                {t("myOrders.browseProducts")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>

            <AdminTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              loading={isLoading}
              onPageChange={goToPage}
              labelPrefix="myOrders.pagination"
            />
          </>
        )}
      </div>
    </div>
  );
}
