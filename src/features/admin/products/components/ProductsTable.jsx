import { Eye, Pencil, Trash2, PackageOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, CURRENCIES } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";
import { stockClass } from "./stockClass";
import ProductThumb from "./ProductThumb";
import RowActionsMenu from "@/features/admin/components/RowActionsMenu";
import TableSkeletonRows from "@/features/admin/components/TableSkeletonRows";
import AdminTableEmptyState from "@/features/admin/components/AdminTableEmptyState";
import AdminTableFooter from "@/features/admin/components/AdminTableFooter";
import SortableTableHeader from "@/features/admin/components/SortableTableHeader";

function TruncateWithTooltip({ value, className }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className={cn(
            "block truncate rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)",
            className,
          )}
        >
          {value}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="start">
        {value}
      </TooltipContent>
    </Tooltip>
  );
}

export default function ProductsTable({
  products,
  isLoading,
  isFetching,
  deletingProductId,
  hasActiveQuery,
  sortKey,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onClearQuery,
}) {
  const { t, i18n } = useTranslation();

  const columns = [
    { key: "product", label: t("products.columns.product"), sortable: true, sortKey: "name" },
    { key: "category", label: t("products.columns.category"), sortable: true, sortKey: "category" },
    { key: "brand", label: t("products.columns.brand"), sortable: true, sortKey: "brand" },
    { key: "price", label: t("products.columns.price"), align: "end", sortable: true, sortKey: "price" },
    { key: "stock", label: t("products.columns.stock"), align: "end", sortable: true, sortKey: "stock" },
    { key: "actions", label: t("products.columns.actions"), align: "end" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Table density="compact" edgePadding>
        <SortableTableHeader
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={onSort}
        />

        {isLoading || isFetching ? (
          <TableBody>
            <TableSkeletonRows columns={6} />
          </TableBody>
        ) : (
          <TooltipProvider delayDuration={0}>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <AdminTableEmptyState
                      icon={
                        <PackageOpen
                          className="size-7 text-muted-foreground"
                          aria-hidden="true"
                        />
                      }
                      title={t("products.noProductsFound")}
                      hint={t("products.noProductsHint")}
                      action={
                        hasActiveQuery ? (
                          <Button variant="outline" onClick={onClearQuery}>
                            {t("products.clearQuery")}
                          </Button>
                        ) : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const isDeleting = deletingProductId === product._id;

                  return (
                    <TableRow key={product._id} className="group">
                      <TableCell>
                        <div className="flex max-w-72 items-center gap-3">
                          <ProductThumb
                            url={product.images?.[0]?.url}
                            alt={product.name}
                          />

                          <div className="min-w-0">
                            <TruncateWithTooltip
                              value={product.name}
                              className="max-w-40 font-medium text-foreground"
                            />

                            {product.tags?.[0] && (
                              <p className="truncate text-xs text-muted-foreground">
                                {product.tags[0]}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        <TruncateWithTooltip
                          value={product.category || "—"}
                          className="max-w-36"
                        />
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        <TruncateWithTooltip
                          value={product.brand || "—"}
                          className="max-w-36"
                        />
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-end tabular-nums">
                        {product.price == null
                          ? "—"
                          : formatCurrency(
                              product.price,
                              CURRENCIES.EGP,
                              i18n.language,
                            )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-end">
                        <span
                          className={`tabular-nums font-medium ${stockClass(product.stock)}`}
                        >
                          {product.stock == null
                            ? "—"
                            : formatNumber(product.stock, i18n.language)}
                        </span>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-end">
                        <RowActionsMenu
                          disabled={isFetching || isDeleting}
                          ariaLabel={t("products.columns.actions")}
                          items={[
                            {
                              icon: (
                                <Eye className="size-4" aria-hidden="true" />
                              ),
                              label: t("products.viewProduct"),
                              onClick: () => onView(product._id),
                            },
                            {
                              icon: (
                                <Pencil className="size-4" aria-hidden="true" />
                              ),
                              label: t("products.editProduct"),
                              onClick: () => onEdit(product._id),
                            },
                            {
                              icon: (
                                <Trash2 className="size-4" aria-hidden="true" />
                              ),
                              label: t("products.deleteProduct"),
                              onClick: () => onDelete(product),
                              variant: "destructive",
                              separator: true,
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </TooltipProvider>
        )}
      </Table>

      {!isLoading && !isFetching && totalPages > 1 && (
        <AdminTableFooter
          currentPage={currentPage}
          totalPages={totalPages}
          loading={isFetching}
          onPageChange={onPageChange}
          labelPrefix="products.pagination"
        />
      )}
    </div>
  );
}