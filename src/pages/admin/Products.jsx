import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { AlertTriangle, CheckCircle2, Package, PackageX, Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/formatNumber";
import useProducts from "@/features/admin/products/useProducts";
import ProductSearch from "@/features/admin/products/components/ProductSearch";
import ProductFilters from "@/features/admin/products/components/ProductFilters";
import ProductsTable from "@/features/admin/products/components/ProductsTable";
import DeleteProductDialog from "@/features/admin/products/components/DeleteProductDialog";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import AdminErrorState from "@/features/admin/components/AdminErrorState";
import StatCard from "@/features/admin/dashboard/components/StatCard";
import {
  STOCK_OK_THRESHOLD,
  STOCK_WARNING_THRESHOLD,
} from "@/features/admin/products/constants";

export default function Products() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language || "en-US";

  const {
    products,
    isLoading,
    isFetching,
    error,
    search,
    appliedSearch,
    filters,
    setFilters,
    sortKey,
    sortDirection,
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
    handleSort,
    handlePageChange,
    clearFilters,
    clearQuery,
    retry,
    handleDelete,
  } = useProducts();

  const inStockCount = useMemo(
    () => products.filter((p) => Number(p?.stock) > STOCK_OK_THRESHOLD).length,
    [products],
  );
  const lowStockCount = useMemo(
    () =>
      products.filter((p) => {
        const stock = Number(p?.stock);
        return stock > STOCK_WARNING_THRESHOLD && stock <= STOCK_OK_THRESHOLD;
      }).length,
    [products],
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => Number(p?.stock) <= STOCK_WARNING_THRESHOLD).length,
    [products],
  );

  const kpis = [
    {
      id: "total",
      title: t("products.kpis.totalProducts", { defaultValue: "Total Products" }),
      description: t("products.kpis.totalProductsDesc", { defaultValue: "Active & inactive catalog items" }),
      value: formatNumber(products.length, locale),
      icon: Package,
    },
    {
      id: "inStock",
      title: t("products.kpis.inStock", { defaultValue: "In Stock" }),
      description: t("products.kpis.inStockDesc", { defaultValue: "Well supplied (>20 units)" }),
      value: formatNumber(inStockCount, locale),
      icon: CheckCircle2,
    },
    {
      id: "lowStock",
      title: t("products.kpis.lowStock", { defaultValue: "Low Stock" }),
      description: t("products.kpis.lowStockDesc", { defaultValue: "Restock recommended (6–20 units)" }),
      value: formatNumber(lowStockCount, locale),
      icon: AlertTriangle,
    },
    {
      id: "outOfStock",
      title: t("products.kpis.outOfStock", { defaultValue: "Out of Stock" }),
      description: t("products.kpis.outOfStockDesc", { defaultValue: "Depleted stock (≤5 units)" }),
      value: formatNumber(outOfStockCount, locale),
      icon: PackageX,
    },
  ];

  if (error && !isLoading) {
    return (
      <div className="p-4">
        <AdminErrorState
          title={t("products.loadErrorTitle")}
          hint={t("products.loadErrorHint")}
          onRetry={retry}
          retryLabel={t("products.retry")}
          className="min-h-75 rounded-lg border bg-card shadow-sm"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker={t("products.subtitle", { defaultValue: "Inventory Management" })}
        title={t("products.title")}
        description={t("products.description", { defaultValue: "Manage your product catalog, stock levels, categories, and pricing." })}
        action={
          <Button onClick={() => navigate("/admin/products/add")} className="gap-2">
            <Plus className="size-4" aria-hidden="true" />
            {t("products.addProduct")}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            title={kpi.title}
            description={kpi.description}
            value={kpi.value}
            icon={kpi.icon}
            className="gap-0 py-4"
          />
        ))}
      </div>

      <div className="space-y-4">
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
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
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