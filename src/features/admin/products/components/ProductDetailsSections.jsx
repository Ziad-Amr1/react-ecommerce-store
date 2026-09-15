import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductDetailsSections({ product }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="font-display">{t("products.sections.description")}</CardTitle>
      </CardHeader>

      <CardContent className="border-b border-border pb-5">
        <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
          {product.description || "—"}
        </p>
      </CardContent>

      <CardHeader className="pt-0">
        <CardTitle className="font-display">{t("products.sections.tags")}</CardTitle>
      </CardHeader>

      <CardContent className="border-b border-border pb-5">
        {product.tags?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="inline-flex rounded-full border border-supporting bg-accent px-2.5 py-1 text-xs font-medium text-foreground">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </CardContent>

      <CardHeader className="pt-0">
        <CardTitle className="font-display">{t("products.sections.productInformation")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">{t("products.fields.slug")}</p>
            <p className="mt-1 break-all font-mono text-sm font-medium text-foreground">{product.slug || "—"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t("products.fields.featured")}</p>
            <span className="mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium">
              {t(product.featured ? "common.yes" : "common.no")}
            </span>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t("products.fields.status")}</p>
            <span className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${product.isActive ? "border-success/30 bg-success-bg text-success" : "border-error/30 bg-error-bg text-error"}`}>
              {t(product.isActive ? "products.active" : "products.inactive")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}