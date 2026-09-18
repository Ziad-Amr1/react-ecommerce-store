import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";
import ProductImagePreview from "./ProductImagePreview";

function ProductGallery({
    images,
    newImages,
    productName,
    isSubmitting,
    onImageChange,
    onDeleteExistingImage,
    onRemoveNewImage,
}) {
    const { t } = useTranslation();
    const totalImages = images.length + newImages.length;

    return (
        <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm md:w-80 md:shrink-0">
            <h2 className="mb-4 font-display text-lg font-semibold text-card-foreground">{t("products.gallery")}</h2>

            <div className="space-y-4">
                <label
                    className={`flex min-h-45 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center 
                        transition ${totalImages >= 5 || isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-muted"
                        }`}
                >
                    <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{t("products.uploadImages")}</span>
                    <span className="mt-1 text-xs text-muted-foreground">{t("products.imageFormats")}</span>

                    <input type="file" accept="image/png,image/jpeg,image/webp" multiple
                        className="hidden" disabled={totalImages >= 5 || isSubmitting} onChange={onImageChange}
                    />
                </label>

                <p className="font-mono text-xs text-muted-foreground">{t("products.imageCount", { count: totalImages })}</p>

                {totalImages > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {images.map((image) => (
                            <div key={image.public_id} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                                <img src={image.url} alt={productName} className="h-full w-full object-cover" />

                                <button type="button" disabled={isSubmitting} aria-label={t("products.removeImage")}
                                    className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full 
                                    border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted"
                                    onClick={() => onDeleteExistingImage(image)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}

                        {newImages.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                                <ProductImagePreview file={file} alt={t("products.newProductImageAlt", { number: index + 1 })} />

                                <button type="button" disabled={isSubmitting} aria-label={t("products.removeImage")}
                                    className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted"
                                    onClick={() => onRemoveNewImage(index)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductGallery;