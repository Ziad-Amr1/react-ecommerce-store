import { useTranslation } from "react-i18next";
import { Eye, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";
import useAdminCarts from "@/features/admin/carts/useAdminCarts";
import CartDetailsSheet from "@/features/admin/carts/components/CartDetailsSheet";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import AdminErrorState from "@/features/admin/components/AdminErrorState";
import AdminTableFooter from "@/features/admin/components/AdminTableFooter";
import AdminTableEmptyState from "@/features/admin/components/AdminTableEmptyState";
import TableSkeletonRows from "@/features/admin/components/TableSkeletonRows";
import RowActionsMenu from "@/features/admin/components/RowActionsMenu";

const COLUMN_COUNT = 5;

export default function Carts() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en-US";

  const {
    carts,
    totalCarts,
    totalPages,
    currentPage,
    isLoading,
    isFetching,
    loadError,
    selectedCart,
    isDetailsOpen,
    handlePageChange,
    handleOpenDetails,
    handleCloseDetails,
    retry,
  } = useAdminCarts();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker={t("carts.subtitle")}
        title={t("carts.title")}
        description={t("carts.description")}
        statistics={[
          {
            id: "total",
            label: t("adminTable.total"),
            value: formatNumber(totalCarts, locale),
          },
        ]}
      />

      <Card className="gap-0 overflow-hidden py-0 shadow-sm">
        {loadError && !isFetching ? (
          <AdminErrorState
            title={t("carts.loadErrorTitle")}
            hint={t("carts.loadErrorHint")}
            onRetry={retry}
            retryLabel={t("carts.retry")}
          />
        ) : (
          <CardContent className="p-0">
            <Table edgePadding>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("carts.columns.customer")}</TableHead>
                  <TableHead>{t("carts.columns.cart")}</TableHead>
                  <TableHead className="text-end">
                    {t("carts.columns.items")}
                  </TableHead>
                  <TableHead className="text-end">
                    {t("carts.columns.total")}
                  </TableHead>
                  <TableHead className="text-end">
                    {t("carts.columns.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              {isLoading ? (
                <TableBody>
                  <TableSkeletonRows rows={5} columns={COLUMN_COUNT} />
                </TableBody>
              ) : (
                <TableBody>
                  {carts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={COLUMN_COUNT} className="p-0">
                        <AdminTableEmptyState
                          icon={
                            <ShoppingCart
                              className="size-6 text-muted-foreground"
                              aria-hidden="true"
                            />
                          }
                          title={t("carts.noCartsFound")}
                          hint={t("carts.noCartsFoundHint")}
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    carts.map((cart, index) => {
                      const cartId = cart?._id || "";
                      const name = cart?.user?.username || "";
                      const email = cart?.user?.email || "";
                      const itemCount = Number(cart?.itemCount) || 0;
                      const initials = name.trim()
                        ? name.trim().slice(0, 2).toUpperCase()
                        : "";

                      return (
                        <TableRow key={cartId || index} className="group">
                          <TableCell
                            className="cursor-pointer"
                            onClick={() => handleOpenDetails(cart)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar size="sm">
                                <AvatarFallback>
                                  {initials || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p
                                  className="truncate font-medium text-foreground"
                                  title={name}
                                >
                                  {name || t("carts.notAvailable")}
                                </p>
                                {email && (
                                  <p
                                    className="truncate text-xs text-muted-foreground"
                                    title={email}
                                  >
                                    {email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell
                            className="cursor-pointer font-mono text-sm text-muted-foreground"
                            onClick={() => handleOpenDetails(cart)}
                          >
                            #
                            {cartId
                              ? cartId.slice(0, 8)
                              : t("carts.notAvailable")}
                          </TableCell>

                          <TableCell
                            className="cursor-pointer text-end tabular-nums text-foreground"
                            onClick={() => handleOpenDetails(cart)}
                          >
                            {formatNumber(itemCount, locale)}
                          </TableCell>

                          <TableCell
                            className="cursor-pointer text-end font-bold tabular-nums text-foreground"
                            onClick={() => handleOpenDetails(cart)}
                          >
                            {formatCurrency(
                              Number(cart?.subtotal) || 0,
                              ORDER_CURRENCY,
                              locale,
                            )}
                          </TableCell>

                          <TableCell className="text-end">
                            <RowActionsMenu
                              disabled={isFetching}
                              ariaLabel={t("carts.columns.actions")}
                              items={[
                                {
                                  icon: (
                                    <Eye
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  ),
                                  label: t("carts.viewDetails"),
                                  onClick: () => handleOpenDetails(cart),
                                },
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              )}
            </Table>

            {!isFetching && carts.length > 0 && (
              <AdminTableFooter
                currentPage={currentPage}
                totalPages={totalPages}
                loading={isFetching}
                onPageChange={handlePageChange}
                labelPrefix="carts.pagination"
              />
            )}
          </CardContent>
        )}
      </Card>

      <CartDetailsSheet
        selectedCart={selectedCart}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
