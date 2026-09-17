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
        <CardTitle className="font-display text-base">
          {t("dashboard.topProducts")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("dashboard.noProducts")}
          </p>
        ) : (
          products.map((product, index) => (
            <div
              key={product._id}
              className="flex items-center gap-3 rounded-lg border border-(--color-border) bg-(--color-surface) p-3 transition-colors hover:bg-(--color-surface-secondary)"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-(--color-surface-secondary) text-xs font-semibold tabular-nums text-(--color-text-secondary)">
                {index + 1}
              </span>

              <img
                src={product.image || "/product-placeholder.png"}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.src = "/product-placeholder.png";
                }}
                className="size-11 shrink-0 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {product.name}
                </p>

                <p className="text-xs tabular-nums text-muted-foreground">
                  {t("dashboard.totalSold", { count: product.totalSold })}
                </p>
              </div>

              <span className="whitespace-nowrap text-end text-sm font-semibold tabular-nums">
                {formatCurrency(product.revenue, "USD", i18n.language)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}