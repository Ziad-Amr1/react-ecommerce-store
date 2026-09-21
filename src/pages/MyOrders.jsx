import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import AccountPageHeader from "@/components/layout/AccountPageHeader";
import SEO from "@/components/SEO/SEO";
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
    <div className="min-h-[70vh] py-8 font-body text-foreground">
      <div className="mx-auto max-w-4xl space-y-6">
        <SEO
          title={t("myOrders.title")}
          description={t("myOrders.subtitle")}
          url="/my-orders"
          noindex
        />
        <AccountPageHeader
          title={t("myOrders.title")}
          description={t("myOrders.subtitle")}
        />

        {isLoading ? (
          <MyOrdersSkeleton />
        ) : status === "error" ? (
          <MyOrdersError onRetry={refetch} />
        ) : orders.length === 0 ? (
          <Empty className="border border-dashed bg-card p-8 sm:p-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBag className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{t("myOrders.emptyTitle")}</EmptyTitle>
              <EmptyDescription>{t("myOrders.emptyDescription")}</EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
              <Button asChild className="gap-2 cursor-pointer rounded-full">
                <Link to="/products">
                  {t("myOrders.browseProducts")}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
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
