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

export default function ProductGallery({
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
  const isFull = totalImages >= MAX_IMAGES;

  return (
    <Card className="w-full self-start md:w-80 md:shrink-0">
      <CardHeader>
        <CardTitle className="font-display">
          {t("products.sections.gallery")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <label
          className={`flex min-h-45 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center transition ${
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
          {t("products.imageCount", { count: totalImages, max: MAX_IMAGES })}
        </p>

        {totalImages > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {images.map((image) => (
              <div
                key={image.public_id}
                className="relative aspect-square overflow-hidden rounded-lg border bg-background shadow-sm"
              >
                <img
                  src={image.url}
                  alt={productName}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  disabled={isSubmitting}
                  className="absolute end-2 top-2 flex size-7 cursor-pointer items-center justify-center rounded-full border bg-background text-foreground shadow-sm transition-colors hover:bg-muted"
                  onClick={() => onDeleteExistingImage(image)}
                  aria-label={t("products.removeImage")}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            ))}

            {newImages.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg border bg-background shadow-sm"
              >
                <ProductImagePreview
                  file={file}
                  alt={t("products.newImagePreviewAlt", { index: index + 1 })}
                />

                <button
                  type="button"
                  disabled={isSubmitting}
                  className="absolute end-2 top-2 flex size-7 cursor-pointer items-center justify-center rounded-full border bg-background text-foreground shadow-sm transition-colors hover:bg-muted"
                  onClick={() => onRemoveNewImage(index)}
                  aria-label={t("products.removeImage")}
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