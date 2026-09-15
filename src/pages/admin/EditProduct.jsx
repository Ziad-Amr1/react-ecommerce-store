// import { Button } from "../../components/ui/button";
// import ProductPageHeader from "./products/components/ProductPageHeader";
// import ProductGallery from "./products/components/ProductGallery";
// import ProductForm from "./products/components/ProductForm";
// import useEditProduct from "./products/hooks/useEditProduct";
// import { toast } from "react-toastify";

// function EditProduct() {
//     const {
//         navigate,
//         product,
//         isLoading,
//         error,
//         isSubmitting,
//         images,
//         newImages,
//         errors,
//         formData,
//         isDirty,
//         handleChange,
//         // handleTagsChange,
//         handleImageChange,
//         handleDeleteExistingImage,
//         handleRemoveNewImage,
//         handleSubmit,
//     } = useEditProduct();

// <<<<<<< HEAD
//     if (isLoading) {
//         return (
//             <div className="p-6">
//                 <div className="rounded-xl border border-border bg-card p-6 text-foreground shadow-sm">
//                     Loading product...
//                 </div>
//             </div>
//         );
// =======
// function ErrorCard({ message, onRetry }) {
//   const { t } = useTranslation();

//   return (
//     <div className="p-4">
//       <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border bg-card shadow-sm">
//         <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-error-bg">
//           <TriangleAlert className="size-7 text-error" aria-hidden="true" />
//         </div>
//         <h2 className="font-display text-lg font-semibold text-foreground">
//           {t("products.loadErrorTitle")}
//         </h2>
//         <p className="mt-1 max-w-md text-center text-sm text-muted-foreground">
//           {message}
//         </p>
//         <Button className="mt-4 cursor-pointer" onClick={onRetry}>
//           {t("products.retry")}
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default function EditProduct() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

//   const {
//     product,
//     isLoading,
//     error,
//     retry,
//     isSubmitting,
//     formData,
//     errors,
//     images,
//     newImages,
//     isDirty,
//     handleChange,
//     handleTagsChange,
//     handleImageChange,
//     handleDeleteExistingImage,
//     handleRemoveNewImage,
//     handleSubmit,
//   } = useEditProduct();

//   const handleBack = () => {
//     if (isDirty) {
//       setShowUnsavedDialog(true);
//       return;
// >>>>>>> d859b48 (W2-03: complete product management)
//     }

//     if (error) {
//         return (
//             <div className="p-6">
//                 <div className="rounded-xl border border-error/30 bg-error-bg p-6 text-error">
//                     {error}
//                 </div>
//             </div>
//         );
//     }

//     if (!product) {
//         return (
//             <div className="p-6">
//                 <div className="rounded-xl border border-border bg-card p-6 text-foreground shadow-sm">
//                     Product not found.
//                 </div>
//             </div>
//         );
//     }

//     const handleBack = () => {
//         if (!isDirty) {
//             navigate("/admin/products");
//             return;
//         }

//         toast.warning(
//             <div className="space-y-3">
//                 <p className="font-medium text-foreground">You have unsaved changes.</p>
//                 <p className="text-sm text-muted-foreground">Do you want to save your changes?</p>

//                 <div className="flex justify-end gap-2">
//                     <button
//                         type="button"
//                         className="cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
//                         onClick={() => {
//                             toast.dismiss();
//                             navigate("/admin/products");
//                         }}
//                     >
//                         Discard
//                     </button>

//                     <button
//                         type="button"
//                         className="cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary-hover"
//                         onClick={() => {
//                             toast.dismiss();
//                             document.getElementById("edit-product-form")?.requestSubmit();
//                         }}
//                     >
//                         Save Changes
//                     </button>
//                 </div>
//             </div>,
//             {
//                 autoClose: false,
//                 closeOnClick: false,
//                 closeButton: true,
//             }
//         );
//     };

//     return (
//         <div className="bg-background p-4 md:p-6">
//             <ProductPageHeader title="Edit Product" description="Update your product information" onBack={handleBack} />

//             <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-6">
//                 <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-start">
//                     {/* Product Gallery */}
//                     <ProductGallery images={images} newImages={newImages} productName={product.name}
//                         isSubmitting={isSubmitting} onImageChange={handleImageChange}
//                         onDeleteExistingImage={handleDeleteExistingImage} onRemoveNewImage={handleRemoveNewImage}
//                     />
//                     <ProductForm formData={formData} errors={errors} onChange={handleChange}
//                         // onTagsChange={handleTagsChange}
//                     />
//                 </div>

//                 <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//                     <button type="button" onClick={handleBack} disabled={isSubmitting}
//                         className="cursor-pointer rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
//                         Cancel
//                     </button>

//                     <Button type="submit" disabled={isSubmitting} className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover">
//                         {isSubmitting ? "Saving..." : "Save Changes"}
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// <<<<<<< HEAD
// export default EditProduct;
// =======
//   return (
//     <div>
//       <ProductPageHeader
//         titleKey="products.editTitle"
//         descriptionKey="products.editDescription"
//         onBack={handleBack}
//       />

//       <form id="edit-product-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
//         <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-start">
//           <ProductForm
//             formData={formData}
//             errors={errors}
//             onChange={handleChange}
//             onTagsChange={handleTagsChange}
//           />

//           <ProductGallery
//             images={images}
//             newImages={newImages}
//             productName={product.name}
//             isSubmitting={isSubmitting}
//             onImageChange={handleImageChange}
//             onDeleteExistingImage={handleDeleteExistingImage}
//             onRemoveNewImage={handleRemoveNewImage}
//           />
//         </div>

//         <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//           <Button
//             variant="outline"
//             type="button"
//             className="cursor-pointer"
//             onClick={handleBack}
//             disabled={isSubmitting}
//           >
//             {t("products.cancel")}
//           </Button>

//           <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
//             {isSubmitting ? t("products.saving") : t("products.saveChanges")}
//           </Button>
//         </div>
//       </form>

//       <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="font-display">
//               {t("products.unsavedTitle")}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {t("products.unsavedDescription")}
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <AlertDialogFooter>
//             <AlertDialogCancel
//               onClick={() => navigate("/admin/products")}
//               className="cursor-pointer"
//             >
//               {t("products.discard")}
//             </AlertDialogCancel>

//             <AlertDialogAction
//               className="cursor-pointer"
//               onClick={() => document.getElementById("edit-product-form")?.requestSubmit()}
//             >
//               {t("products.saveNow")}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
// >>>>>>> d859b48 (W2-03: complete product management)


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
import ProductPageHeader from "./products/components/ProductPageHeader";
import ProductGallery from "./products/components/ProductGallery";
import ProductForm from "./products/components/ProductForm";
import useEditProduct from "./products/hooks/useEditProduct";

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
        <Button className="mt-4 cursor-pointer" onClick={onRetry}>
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
    return (
      <div className="p-6">
        <div className="rounded-xl border border-border bg-card p-6 text-foreground shadow-sm">
          Loading product...
        </div>
      </div>
    );
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
      <form id="edit-product-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-start">
          <ProductForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onTagsChange={handleTagsChange}
          />
          <ProductGallery
            images={images}
            newImages={newImages}
            productName={product.name}
            isSubmitting={isSubmitting}
            onImageChange={handleImageChange}
            onDeleteExistingImage={handleDeleteExistingImage}
            onRemoveNewImage={handleRemoveNewImage}
          />
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            type="button"
            className="cursor-pointer"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            {t("products.cancel")}
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
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
            <AlertDialogCancel
              onClick={() => navigate("/admin/products")}
              className="cursor-pointer"
            >
              {t("products.discard")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => document.getElementById("edit-product-form")?.requestSubmit()}
            >
              {t("products.saveNow")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}