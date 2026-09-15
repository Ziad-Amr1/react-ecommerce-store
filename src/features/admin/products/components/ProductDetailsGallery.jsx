import { PackageOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MAX_IMAGES } from "../constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductDetailsGallery({ product, selectedImage, onSelectImage }) {
  const { t } = useTranslation();
  const images = (product.images || []).slice(0, MAX_IMAGES);
  const activeImage = images[selectedImage] || images[0];

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="font-display">{t("products.sections.gallery")}</CardTitle>
      </CardHeader>

      <CardContent>
        {activeImage ? (
          <div className="mx-auto flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border bg-muted/30 p-4 sm:h-56">
            <img src={activeImage.url} alt={product.name} className="h-full w-full object-contain" />
          </div>
        ) : (
          <div className="flex h-56 items-center justify-center rounded-xl border bg-muted/30">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <PackageOpen className="size-10" aria-hidden="true" />
              <span className="text-sm">{t("products.noImage")}</span>
            </div>
          </div>
        )}

        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.public_id || index}
                type="button"
                onClick={() => onSelectImage(index)}
                className={`size-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-border"}`}
                aria-label={t("products.selectImage", { index: index + 1 })}
              >
                <img src={image.url} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}