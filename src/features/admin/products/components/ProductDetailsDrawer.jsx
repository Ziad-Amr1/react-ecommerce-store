import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
import ProductDetailsGallery from "./ProductDetailsGallery";
import ProductDetailsInfo from "./ProductDetailsInfo";
import ProductDetailsSections from "./ProductDetailsSections";
import ProductGallery from "./ProductGallery";
import ProductForm from "./ProductForm";
import useProduct from "../useProduct";
import useProductDrawer from "../useProductDrawer";

export default function ProductDetailsDrawer({ productId, open, onClose }) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const { product, isLoading, error, retry } = useProduct(productId);

  const {
    isEditing,
    isSubmitting,
    isDirty,
    formData,
    errors,
    images,
    newImages,
    startEditing,
    cancelEditing,
    handleChange,
    handleTagsChange,
    handleImageChange,
    handleDeleteExistingImage,
    handleRemoveNewImage,
    handleSubmit,
  } = useProductDrawer(product, retry);

  const requestClose = () => {
    if (isEditing && isDirty) {
      setShowDiscardDialog(true);
      return;
    }

    if (isEditing) cancelEditing();
    onClose();
  };

  const discardChanges = () => {
    cancelEditing();
    setShowDiscardDialog(false);
    onClose();
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) requestClose();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent className="z-[var(--z-dropdown)] w-full overflow-y-auto px-6 sm:max-w-2xl">
          <SheetHeader className="-mx-2 border-b px-2 pb-4">
            <div className="flex items-center justify-between gap-3">
              <SheetTitle className="font-display">
                {isEditing ? t("products.editProduct") : t("products.detailsTitle")}
              </SheetTitle>
            </div>
          </SheetHeader>

          {isLoading && (
            <div className="flex min-h-100 items-center justify-center">
              <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex min-h-100 flex-col items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">{t("products.loadProductFailed")}</p>
              <Button className="mt-4 cursor-pointer" onClick={retry}>
                {t("products.retry")}
              </Button>
            </div>
          )}

          {!isLoading && !error && product && (
            <>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6 py-6">
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

                  <div className="sticky bottom-0 z-10 flex justify-start gap-2 border-t bg-background py-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={requestClose}
                      disabled={isSubmitting}
                    >
                      {t("products.cancel")}
                    </Button>

                    <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                      <Save className="size-4" aria-hidden="true" />
                      {isSubmitting ? t("products.saving") : t("products.saveChanges")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 py-2">
                  <ProductDetailsGallery
                    product={product}
                    selectedImage={selectedImage}
                    onSelectImage={setSelectedImage}
                  />
                  <ProductDetailsInfo product={product} />
                  <ProductDetailsSections product={product} />

                  <div className="sticky bottom-0 flex justify-start border-t bg-background py-4">
                    <Button className="cursor-pointer" onClick={startEditing}>
                      <Pencil className="size-4" aria-hidden="true" />
                      {t("products.editProduct")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("products.unsavedTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("products.unsavedDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              {t("products.keepEditing")}
            </AlertDialogCancel>

            <AlertDialogAction onClick={discardChanges} className="cursor-pointer">
              {t("products.discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}