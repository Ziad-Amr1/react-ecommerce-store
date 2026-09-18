import { Package2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProductTagsInput from "./ProductTagsInput";

function FieldError({ error }) {
  if (!error) {
    return null;
  }

  return <p className="text-sm text-destructive">{error}</p>;
}

export default function ProductForm({
  formData,
  errors,
  onChange,
  onTagsChange,
}) {
  const { t } = useTranslation();

  return (
    <Card className="w-full flex-1">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
            <Package2 className="size-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="font-display">
              {t("products.sections.basicInformation")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("products.sections.basicInformationHint")}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">{t("products.fields.name")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={onChange}
              placeholder={t("products.placeholders.name")}
              aria-invalid={!!errors.name}
            />
            <FieldError error={errors.name} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shortDescription">
              {t("products.fields.shortDescription")}
            </Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={onChange}
              placeholder={t("products.placeholders.shortDescription")}
              rows={2}
              aria-invalid={!!errors.shortDescription}
            />
            <FieldError error={errors.shortDescription} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">{t("products.fields.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={onChange}
              placeholder={t("products.placeholders.description")}
              rows={5}
              className="resize-none"
              aria-invalid={!!errors.description}
            />
            <FieldError error={errors.description} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">{t("products.fields.price")}</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={onChange}
              placeholder="0.00"
              className="font-mono"
              aria-invalid={!!errors.price}
            />
            <FieldError error={errors.price} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountPrice">
              {t("products.fields.discountPrice")}
            </Label>
            <Input
              id="discountPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.discountPrice}
              onChange={onChange}
              placeholder="0.00"
              className="font-mono"
              aria-invalid={!!errors.discountPrice}
            />
            <FieldError error={errors.discountPrice} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">{t("products.fields.stock")}</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={onChange}
              placeholder="0"
              className="font-mono"
              aria-invalid={!!errors.stock}
            />
            <FieldError error={errors.stock} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">{t("products.fields.sku")}</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={onChange}
              placeholder={t("products.placeholders.sku")}
              className="font-mono"
            />
            <FieldError error={errors.sku} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t("products.fields.category")}</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={onChange}
              placeholder={t("products.placeholders.category")}
              aria-invalid={!!errors.category}
            />
            <FieldError error={errors.category} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">
              {t("products.fields.subcategory")}
            </Label>
            <Input
              id="subcategory"
              value={formData.subcategory}
              onChange={onChange}
              placeholder={t("products.placeholders.subcategory")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">{t("products.fields.brand")}</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={onChange}
              placeholder={t("products.placeholders.brand")}
            />
          </div>

          <ProductTagsInput tags={formData.tags} onChange={onTagsChange} />
        </div>
      </CardContent>
    </Card>
  );
}