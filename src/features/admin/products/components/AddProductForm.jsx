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
import { Button } from "@/components/ui/button";
import ProductTagsInput from "./ProductTagsInput";

function FieldError({ error }) {
  if (!error) {
    return null;
  }

  return <p className="text-sm text-destructive">{error}</p>;
}

export default function AddProductForm({
  formData,
  errors,
  isSubmitting,
  onChange,
  onTagsChange,
  onCancel,
}) {
  const { t } = useTranslation();

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-display">
          {t("products.sections.productInformation")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="shortDescription">
              {t("products.fields.shortDescription")}
            </Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={onChange}
              placeholder={t("products.placeholders.shortDescription")}
              aria-invalid={!!errors.shortDescription}
            />
            <FieldError error={errors.shortDescription} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("products.fields.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={onChange}
              placeholder={t("products.placeholders.description")}
              className="min-h-35 resize-none"
              aria-invalid={!!errors.description}
            />
            <FieldError error={errors.description} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
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

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {t("products.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("products.creating") : t("products.createProduct")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}