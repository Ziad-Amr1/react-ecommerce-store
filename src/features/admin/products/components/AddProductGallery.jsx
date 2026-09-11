import { Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductImagePreview from "./ProductImagePreview";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGES } from "../constants";

export default function AddProductGallery({
  images,
  errors,
  isSubmitting,
  onImageChange,
  onRemoveImage,
}) {
  const { t } = useTranslation();
  const isFull = images.length >= MAX_IMAGES;

  return (
    <Card className="self-start lg:col-span-1">
      <CardHeader>
        <CardTitle className="font-display">
          {t("products.sections.gallery")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <label
          className={`flex min-h-45 flex-col items-center justify-center rounded-lg border border-dashed border-border transition ${
            isFull || isSubmitting
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-muted"
          }`}
        >
          <Upload className="mb-3 size-8 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">
            {t("products.uploadImages")}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            {t("products.uploadImagesHint")}
          </span>

          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            multiple
            className="hidden"
            disabled={isFull || isSubmitting}
            onChange={onImageChange}
          />
        </label>

        <p className="font-mono text-xs text-muted-foreground">
          {t("products.imageCount", { count: images.length, max: MAX_IMAGES })}
        </p>

        {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {images.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg border bg-background shadow-sm"
              >
                <ProductImagePreview
                  file={file}
                  alt={t("products.imagePreviewAlt", { index: index + 1 })}
                />

                {index === 0 && (
                  <span className="absolute start-2 top-2 rounded-md border border-supporting bg-background px-2 py-1 text-xs font-medium text-foreground shadow-sm">
                    {t("products.mainImage")}
                  </span>
                )}

                <button
                  type="button"
                  className="absolute end-2 top-2 flex size-7 cursor-pointer items-center justify-center rounded-full border bg-background text-foreground shadow-sm transition-colors hover:bg-muted"
                  onClick={() => onRemoveImage(index)}
                  aria-label={t("products.removeImage")}
                  disabled={isSubmitting}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}