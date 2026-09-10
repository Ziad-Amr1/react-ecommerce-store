import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProducts from "@/features/admin/products/useProducts";
import ProductSearch from "@/features/admin/products/components/ProductSearch";
import ProductFilters from "@/features/admin/products/components/ProductFilters";
import ProductsTable from "@/features/admin/products/components/ProductsTable";
import DeleteProductDialog from "@/features/admin/products/components/DeleteProductDialog";
import { TriangleAlert } from "lucide-react";

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    products,
    isLoading,
    isFetching,
    error,
    search,
    appliedSearch,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    currentPage,
    totalPages,
    productToDelete,
    setProductToDelete,
    deletingProductId,
    hasActiveQuery,
    handleSearchChange,
    handleSelectSearchResult,
    handleApplyFilters,
    handlePageChange,
    clearFilters,
    clearQuery,
    retry,
    handleDelete,
  } = useProducts();

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
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("products.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("products.description")}
          </p>
        </div>

        <Button onClick={() => navigate("/admin/products/add")}>
          {t("products.addProduct")}
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex w-full flex-col gap-3 md:flex-row">
          <ProductSearch
            search={search}
            appliedSearch={appliedSearch}
            products={products}
            onChange={handleSearchChange}
            onSelect={handleSelectSearchResult}
          />

          <Button
            variant="outline"
            onClick={() => setShowFilters((current) => !current)}
            disabled={isFetching}
          >
            <SlidersHorizontal className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            {t("products.filtersButton")}
          </Button>
        </div>

        {showFilters && (
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
            onClear={clearFilters}
            isFetching={isFetching}
          />
        )}
      </div>

      <ProductsTable
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        deletingProductId={deletingProductId}
        hasActiveQuery={hasActiveQuery}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onView={(id) => navigate(`/admin/products/${id}`)}
        onEdit={(id) => navigate(`/admin/products/${id}/edit`)}
        onDelete={setProductToDelete}
        onClearQuery={clearQuery}
      />

      <DeleteProductDialog
        productToDelete={productToDelete}
        deletingProductId={deletingProductId}
        onClose={() => setProductToDelete(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}