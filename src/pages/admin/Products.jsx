import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { SlidersHorizontal, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProducts from "@/features/admin/products/useProducts";
import ProductSearch from "@/features/admin/products/components/ProductSearch";
import ProductFilters from "@/features/admin/products/components/ProductFilters";
import ProductsTable from "@/features/admin/products/components/ProductsTable";
import DeleteProductDialog from "@/features/admin/products/components/DeleteProductDialog";
import ProductDetailsDrawer from "@/features/admin/products/components/ProductDetailsDrawer";

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState(null);

  const {
    products,
    isLoading,
    isFetching,
    error,
    search,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    sortKey,
    sortDirection,
    currentPage,
    totalPages,
    totalProducts,
    productToDelete,
    setProductToDelete,
    deletingProductId,
    hasActiveQuery,
    handleSearchChange,
    handleApplyFilters,
    handleSort,
    handlePageChange,
    clearFilters,
    clearQuery,
    retry,
    handleDelete,
  } = useProducts();

  const handlePriceSort = () => {
    const nextSort =
      filters.sort === ""
        ? "price_asc"
        : filters.sort === "price_asc"
          ? "price_desc"
          : "";

    const nextFilters = {
      ...filters,
      sort: nextSort,
    };

    setFilters(nextFilters);
    handleApplyFilters(nextFilters);
  };

  if (error && !isLoading) {
    return (
      <div className="p-4">
        <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border bg-card shadow-sm">
          <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-error-bg">
            <TriangleAlert className="size-7 text-error" aria-hidden="true" />
          </div>

          <h2 className="font-display text-lg font-semibold text-foreground">
            {t("products.loadErrorTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("products.loadErrorHint")}
          </p>

          <Button className="mt-4" onClick={retry}>
            {t("products.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {t("products.title")}
            </h1>

            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold tabular-nums text-primary shadow-sm">
              {totalProducts}
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {t("products.description")}
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/products/add")}
          className="cursor-pointer"
        >
          {t("products.addProduct")}
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex w-full flex-col gap-3 md:flex-row">
          <ProductSearch search={search} onChange={handleSearchChange} />

          <Button
            variant="outline"
            onClick={() => setShowFilters((current) => !current)}
            disabled={isFetching}
            className="cursor-pointer"
          >
            <SlidersHorizontal
              className="size-4 rtl:-scale-x-100"
              aria-hidden="true"
            />
            {t("products.filtersButton")}
          </Button>
        </div>

        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showFilters ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                showFilters
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-4 scale-[0.98] opacity-0"
              }`}
            >
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                onApply={handleApplyFilters}
                onClear={clearFilters}
                isFetching={isFetching}
              />
            </div>
          </div>
        </div>
      </div>

      <ProductsTable
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        deletingProductId={deletingProductId}
        hasActiveQuery={hasActiveQuery}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onProductClick={setSelectedProductId}
        onView={(id) => setSelectedProductId(id)}
        onEdit={(id) => navigate(`/admin/products/${id}/edit`)}
        onDelete={setProductToDelete}
        onClearQuery={clearQuery}
        onPriceSort={handlePriceSort}
        priceSort={filters.sort}
      />

      <DeleteProductDialog
        productToDelete={productToDelete}
        deletingProductId={deletingProductId}
        onClose={() => setProductToDelete(null)}
        onDelete={handleDelete}
      />

      <ProductDetailsDrawer
        productId={selectedProductId}
        open={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
}