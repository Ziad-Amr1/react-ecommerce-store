import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

export default function TopProducts({ products = [] }) {
  const { t, i18n } = useTranslation();
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("dashboard.topProducts")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.noProducts")}
          </p>
        ) : (
          products.map((product, index) => (
            <div
              key={product._id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <span className="w-5 shrink-0 text-sm font-bold text-muted-foreground">
                #{index + 1}
              </span>

              <img
                src={product.image || "/product-placeholder.png"}
                alt={product.name}
                onError={(event) => {
                  event.currentTarget.src = "/product-placeholder.png";
                }}
                className="size-12 shrink-0 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {product.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {t("dashboard.totalSold", { count: product.totalSold })}
                </p>
              </div>

              <span className="text-sm font-semibold tabular-nums">
                {formatCurrency(product.revenue, "USD", i18n.language)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}