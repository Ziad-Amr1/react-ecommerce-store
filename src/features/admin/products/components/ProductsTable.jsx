import { Eye, Pencil, Trash2, PackageOpen, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/formatCurrency";
import ProductThumb from "./ProductThumb";
import ProductPagination from "./ProductPagination";
import { STOCK_OK_THRESHOLD, STOCK_WARNING_THRESHOLD } from "../constants";

const CURRENCY = "USD";

function stockClass(stock) {
  if (stock > STOCK_OK_THRESHOLD) {
    return "text-success";
  }
  if (stock > STOCK_WARNING_THRESHOLD) {
    return "text-warning";
  }
  return "text-error";
}

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

function SkeletonRows({ columns }) {
  return Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columns }).map((__, columnIndex) => (
        <TableCell key={columnIndex}>
          <div className="h-4 animate-pulse rounded-md bg-muted" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export default function ProductsTable({
  products,
  isLoading,
  isFetching,
  deletingProductId,
  hasActiveQuery,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onClearQuery,
}) {
  const { t, i18n } = useTranslation();

  if (isLoading || isFetching) {
    return (
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table density="compact">
          <TableHeader>
            <TableRow>
              <TableHead>{t("products.columns.product")}</TableHead>
              <TableHead>{t("products.columns.category")}</TableHead>
              <TableHead>{t("products.columns.brand")}</TableHead>
              <TableHead className="text-end">{t("products.columns.price")}</TableHead>
              <TableHead className="text-end">{t("products.columns.stock")}</TableHead>
              <TableHead className="text-end">{t("products.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows columns={6} />
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <TooltipProvider delayDuration={0}>
        <Table density="compact">
          <TableHeader>
            <TableRow>
              <TableHead>{t("products.columns.product")}</TableHead>
              <TableHead>{t("products.columns.category")}</TableHead>
              <TableHead>{t("products.columns.brand")}</TableHead>
              <TableHead className="text-end">{t("products.columns.price")}</TableHead>
              <TableHead className="text-end">{t("products.columns.stock")}</TableHead>
              <TableHead className="text-end">{t("products.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex h-52 flex-col items-center justify-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                      <PackageOpen
                        className="size-7 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        {t("products.noProductsFound")}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("products.noProductsHint")}
                      </p>
                    </div>

                    {hasActiveQuery && (
                      <Button variant="outline" onClick={onClearQuery}>
                        {t("products.clearQuery")}
                      </Button>
                    )}
                  </div>
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
                        : formatCurrency(product.price, CURRENCY, i18n.language)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-end">
                      <span
                        className={`tabular-nums font-medium ${stockClass(product.stock)}`}
                      >
                        {product.stock == null ? "—" : product.stock}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-end">
                      <div className="flex justify-end">
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 [@media(pointer:coarse)]:opacity-100">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={isFetching || isDeleting}
                                aria-label={t("products.columns.actions")}
                              >
                                <MoreHorizontal className="size-4" aria-hidden="true" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onView(product._id)}>
                                <Eye className="size-4" aria-hidden="true" />
                                {t("products.viewProduct")}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => onEdit(product._id)}>
                                <Pencil className="size-4" aria-hidden="true" />
                                {t("products.editProduct")}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onDelete(product)}
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                                {t("products.deleteProduct")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TooltipProvider>

      {totalPages > 1 && (
        <footer className="border-t border-(--color-border) px-3 py-3">
          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            isFetching={isFetching}
            onPageChange={onPageChange}
          />
        </footer>
      )}
    </div>
  );
}