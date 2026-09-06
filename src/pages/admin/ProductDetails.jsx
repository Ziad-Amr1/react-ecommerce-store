import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "../../components/ui/button";
import useProduct from "./products/hooks/useProduct";
import ProductDetailsGallery from "./products/components/ProductDetailsGallery";
import ProductDetailsInfo from "./products/components/ProductDetailsInfo";
import ProductDetailsSections from "./products/components/ProductDetailsSections";

export default function ProductDetails() {
    const navigate = useNavigate();
    const { product, isLoading, error } = useProduct();
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
        return <div className="p-6 text-sm text-error">{error}</div>;
    }

    if (!product) {
        return <div className="p-6 text-sm text-muted-foreground">Product not found.</div>;
    }

    return (
        <div className="bg-background p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="outline" className="cursor-pointer border-border bg-background text-foreground hover:bg-muted" onClick={() => navigate("/admin/products")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />Back to Products
                </Button>

                <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover" onClick={() => navigate(`/admin/products/${product._id}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" />Edit Product
                </Button>
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Product Details</h1>

            <div className="mt-5 grid gap-5 lg:grid-cols-[450px_1fr]">
                <ProductDetailsGallery product={product} selectedImage={selectedImage} onSelectImage={setSelectedImage} />

                <ProductDetailsInfo product={product} />
            </div>

            <ProductDetailsSections product={product} />

        </div>
    );
}