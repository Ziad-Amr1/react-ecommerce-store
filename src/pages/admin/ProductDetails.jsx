// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import { ArrowLeft, Pencil } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import useProduct from "./products/hooks/useProduct";
// import ProductDetailsGallery from "./products/components/ProductDetailsGallery";
// import ProductDetailsInfo from "./products/components/ProductDetailsInfo";
// import ProductDetailsSections from "./products/components/ProductDetailsSections";

// export default function ProductDetails() {
//     const navigate = useNavigate();
//     const { product, isLoading, error } = useProduct();
//     const [selectedImage, setSelectedImage] = useState(0);

//     useEffect(() => {
//         if (!product?.images || product.images.length <= 1) {
//             return;
//         }

//         const interval = setInterval(() => {
//             setSelectedImage((currentImage) =>
//                 currentImage === product.images.length - 1 ? 0 : currentImage + 1
//             );
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [product]);

//     if (isLoading) {
//         return <div className="p-6 text-sm text-muted-foreground">Loading product...</div>;
//     }

//     if (error) {
//         return <div className="p-6 text-sm text-error">{error}</div>;
//     }

//     if (!product) {
//         return <div className="p-6 text-sm text-muted-foreground">Product not found.</div>;
//     }

//     return (
//         <div className="bg-background p-4 md:p-6">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                 <Button variant="outline" className="cursor-pointer border-border bg-background text-foreground hover:bg-muted" onClick={() => navigate("/admin/products")}>
//                     <ArrowLeft className="mr-2 h-4 w-4" />Back to Products
//                 </Button>

//                 <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover" onClick={() => navigate(`/admin/products/${product._id}/edit`)}>
//                     <Pencil className="mr-2 h-4 w-4" />Edit Product
//                 </Button>
//             </div>

//             <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Product Details</h1>

//             <div className="mt-5 grid gap-5 lg:grid-cols-[450px_1fr]">
//                 <ProductDetailsGallery product={product} selectedImage={selectedImage} onSelectImage={setSelectedImage} />

//                 <ProductDetailsInfo product={product} />
//             </div>

//             <ProductDetailsSections product={product} />

//         </div>
//     );
// <<<<<<< HEAD
// =======
//   }

//   if (error) {
//     return (
//       <div className="p-4">
//         <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border bg-card shadow-sm">
//           <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-error-bg">
//             <TriangleAlert className="size-7 text-error" aria-hidden="true" />
//           </div>
//           <h2 className="font-display text-lg font-semibold text-foreground">
//             {t("products.loadErrorTitle")}
//           </h2>
//           <p className="mt-1 text-sm text-muted-foreground">
//             {t("products.loadProductFailed")}
//           </p>
//           <Button className="mt-4" onClick={retry}>
//             {t("products.retry")}
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="p-4">
//         <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border bg-card shadow-sm">
//           <h2 className="font-display text-lg font-semibold text-foreground">
//             {t("products.notFound")}
//           </h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <Button
//           variant="outline"
//           onClick={() => navigate("/admin/products")}
//           aria-label={t("products.backToList")}
//         >
//           <ArrowLeft className="size-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
//           {t("products.backToList")}
//         </Button>

//         <Button onClick={() => navigate(`/admin/products/${product._id}/edit`)}>
//           <Pencil className="size-4" aria-hidden="true" />
//           {t("products.editProduct")}
//         </Button>
//       </div>

//       <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
//         {t("products.detailsTitle")}
//       </h1>

//       <div className="mt-5 grid gap-5 lg:grid-cols-[450px_1fr]">
//         <ProductDetailsGallery
//           key={product._id}
//           product={product}
//           selectedImage={selectedImage}
//           onSelectImage={setSelectedImage}
//         />

//         <ProductDetailsInfo product={product} />
//       </div>

//       <ProductDetailsSections product={product} />
//     </div>
//   );
// >>>>>>> d859b48 (W2-03: complete product management)
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Pencil, TriangleAlert } from "lucide-react";
import { Button } from "../../components/ui/button";
import useProduct from "./products/hooks/useProduct";
import ProductDetailsGallery from "./products/components/ProductDetailsGallery";
import ProductDetailsInfo from "./products/components/ProductDetailsInfo";
import ProductDetailsSections from "./products/components/ProductDetailsSections";

export default function ProductDetails() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { product, isLoading, error, retry } = useProduct();
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (!product?.images || product.images.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setSelectedImage((currentImage) =>
                currentImage === product.images.length - 1 ? 0 : currentImage + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [product]);

    if (isLoading) {
        return <div className="p-6 text-sm text-muted-foreground">Loading product...</div>;
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
                    <Button className="mt-4 cursor-pointer" onClick={retry}>
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
        <div className="bg-background p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    variant="outline"
                    className="cursor-pointer border-border bg-background text-foreground hover:bg-muted"
                    onClick={() => navigate("/admin/products")}
                    aria-label={t("products.backToList")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                    {t("products.backToList")}
                </Button>

                <Button
                    className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover"
                    onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                >
                    <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
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
