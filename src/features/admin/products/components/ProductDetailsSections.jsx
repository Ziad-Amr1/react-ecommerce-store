import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
                  className="rounded-full border border-(--color-supporting) bg-accent px-3 py-1 text-sm text-foreground"
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
              <Badge
                variant="secondary"
                className="mt-1 border border-(--color-supporting)/60 bg-(--color-supporting)/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground"
              >
                {t(product.featured ? "common.yes" : "common.no")}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {t("products.fields.status")}
              </p>
              <Badge
                variant={product.isActive ? "outline" : "destructive"}
                className={
                  product.isActive
                    ? "mt-1 border-(--color-success)/40 bg-(--color-success-bg) px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-(--color-success)"
                    : "mt-1 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
                }
              >
                {t(product.isActive ? "products.active" : "products.inactive")}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}