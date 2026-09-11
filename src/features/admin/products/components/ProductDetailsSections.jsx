import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProductDetailsSections({ product }) {
  const { t } = useTranslation();

  return (
    <>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="font-display">
            {t("products.sections.description")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {product.description || "—"}
          </p>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="font-display">
            {t("products.sections.tags")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-supporting bg-accent px-3 py-1 text-sm text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="font-display">
            {t("products.sections.productInformation")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("products.fields.slug")}
              </p>
              <p className="mt-1 break-all font-mono text-sm font-medium text-foreground">
                {product.slug || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {t("products.fields.featured")}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {t(product.featured ? "common.yes" : "common.no")}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {t("products.fields.status")}
              </p>
              <p
                className={`mt-1 text-sm font-medium ${
                  product.isActive ? "text-success" : "text-error"
                }`}
              >
                {t(product.isActive ? "products.active" : "products.inactive")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}