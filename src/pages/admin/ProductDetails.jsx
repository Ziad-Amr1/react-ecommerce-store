import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Pencil, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProduct from "@/features/admin/products/useProduct";
import ProductDetailsGallery from "@/features/admin/products/components/ProductDetailsGallery";
import ProductDetailsInfo from "@/features/admin/products/components/ProductDetailsInfo";
import ProductDetailsSections from "@/features/admin/products/components/ProductDetailsSections";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const { product, isLoading, error, retry } = useProduct(id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <div className="mb-4 h-10 w-40 animate-pulse rounded-md bg-muted" />
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="aspect-square animate-pulse rounded-lg bg-muted" />
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
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
            {t("products.loadProductFailed")}
          </p>
          <Button className="mt-4" onClick={retry}>
            {t("products.retry")}
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4">
        <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border bg-card shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {t("products.notFound")}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/products")}
          aria-label={t("products.backToList")}
        >
          <ArrowLeft className="size-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
          {t("products.backToList")}
        </Button>

        <Button
          onClick={() => navigate(`/admin/products/${product._id}/edit`)}
        >
          <Pencil className="size-4" aria-hidden="true" />
          {t("products.editProduct")}
        </Button>
      </div>

      <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
        {t("products.detailsTitle")}
      </h1>

      <div className="mt-5 grid gap-5 lg:grid-cols-[450px_1fr]">
        <ProductDetailsGallery
          key={product._id}
          product={product}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
        />

        <ProductDetailsInfo product={product} />
      </div>

      <ProductDetailsSections product={product} />
    </div>
  );
}