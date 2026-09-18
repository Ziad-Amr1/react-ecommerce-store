import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";
import ProductImagePreview from "./ProductImagePreview";

function AddProductGallery({ images, errors, isSubmitting, onImageChange, onRemoveImage }) {
    const { t } = useTranslation();

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-1">
            <h2 className="mb-4 font-display text-lg font-semibold text-card-foreground">{t("products.gallery")}</h2>

            <div className="space-y-4">
                <label className={`flex min-h-45 flex-col items-center justify-center rounded-lg border border-dashed border-border transition ${images.length >= 5 || isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-muted"}`}>
                    <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{t("products.uploadImages")}</span>
                    <span className="mt-1 text-xs text-muted-foreground">{t("products.imageFormats")}</span>

                    <input type="file" accept="image/png,image/jpeg,image/webp" multiple
                        className="hidden" disabled={images.length >= 5 || isSubmitting} onChange={onImageChange}
                    />
                </label>

                <p className="font-mono text-xs text-muted-foreground">{t("products.imageCount", { count: images.length })}</p>

                {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}

                {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {images.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                                <ProductImagePreview file={file} alt={t("products.productImageAlt", { number: index + 1 })} />

                                {index === 0 && (
                                    <span className="absolute left-2 top-2 rounded-md border border-supporting bg-background px-2 py-1 text-xs font-medium text-foreground shadow-sm">
                                        {t("products.mainImage")}
                                    </span>
                                )}

                                <button type="button" aria-label={t("products.removeImage")} onClick={() => onRemoveImage(index)}
                                    className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center 
                                    rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted"

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

export default AddProductGallery;