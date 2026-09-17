import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useEditProduct from "@/features/admin/products/useEditProduct";
import ProductPageHeader from "@/features/admin/products/components/ProductPageHeader";
import ProductGallery from "@/features/admin/products/components/ProductGallery";
import ProductForm from "@/features/admin/products/components/ProductForm";

function LoadingCard() {
  return (
    <div className="space-y-6 p-4">
      <div className="mb-4 h-10 w-40 animate-pulse rounded-md bg-muted" />
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="h-96 w-full animate-pulse rounded-lg bg-muted md:w-80 md:shrink-0" />
        <div className="h-96 flex-1 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

function ErrorCard({ message, onRetry }) {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border bg-card shadow-sm">
        <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-error-bg">
          <TriangleAlert className="size-7 text-error" aria-hidden="true" />
        </div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          {t("products.loadErrorTitle")}
        </h2>
        <p className="mt-1 max-w-md text-center text-sm text-muted-foreground">
          {message}
        </p>
        <Button className="mt-4" onClick={onRetry}>
          {t("products.retry")}
        </Button>
      </div>
    </div>
  );
}

export default function EditProduct() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const {
    product,
    isLoading,
    error,
    retry,
    isSubmitting,
    formData,
    errors,
    images,
    newImages,
    isDirty,
    handleChange,
    handleTagsChange,
    handleImageChange,
    handleDeleteExistingImage,
    handleRemoveNewImage,
    handleSubmit,
  } = useEditProduct();

  const handleBack = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
      return;
    }

    navigate("/admin/products");
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  if (error) {
    return <ErrorCard message={t("products.loadProductFailed")} onRetry={retry} />;
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
      <ProductPageHeader
        titleKey="products.editTitle"
        descriptionKey="products.editDescription"
        onBack={handleBack}
      />

      <form
        id="edit-product-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-start">
          <ProductGallery
            images={images}
            newImages={newImages}
            productName={product.name}
            isSubmitting={isSubmitting}
            onImageChange={handleImageChange}
            onDeleteExistingImage={handleDeleteExistingImage}
            onRemoveNewImage={handleRemoveNewImage}
          />

          <ProductForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onTagsChange={handleTagsChange}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
            {t("products.cancel")}
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("products.saving") : t("products.saveChanges")}
          </Button>
        </div>
      </form>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              {t("products.unsavedTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("products.unsavedDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate("/admin/products")}>
              {t("products.discard")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                document.getElementById("edit-product-form")?.requestSubmit()
              }
            >
              {t("products.saveNow")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}