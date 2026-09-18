import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";

function Money({ value, locale }) {
  const amount = typeof value === "number" ? value : Number(value || 0);
  return formatCurrency(amount, ORDER_CURRENCY, locale);
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border pb-2 text-xs last:border-b-0 last:pb-0">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-end font-medium text-foreground">{value}</span>
    </div>
  );
}

function CartDetailsContent({ cart }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en-US";

  const user = cart.user || {};
  const items = cart.items || [];
  const itemCount =
    typeof cart.itemCount === "number" ? cart.itemCount : items.length;

  return (
    <div className="space-y-6">
      <SheetHeader className="border-b border-border pb-4">
        <p className="text-xs font-medium text-muted-foreground">
          {t("carts.sheet.title")}
        </p>
        <SheetTitle className="font-mono text-lg font-bold">
          #{cart._id ? cart._id.slice(0, 8) : t("carts.notAvailable")}
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground">
          {t("carts.sheet.customerInformation")}
        </p>
        <DetailRow
          label={t("carts.sheet.customer")}
          value={user.username || t("carts.notAvailable")}
        />
        <DetailRow
          label={t("carts.sheet.email")}
          value={user.email || t("carts.notAvailable")}
        />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground">
          {t("carts.sheet.items")} ({formatNumber(itemCount, locale)})
        </p>

        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, index) => {
              const price = Number(item?.price) || 0;
              const quantity = Number(item?.quantity) || 0;

              return (
                <div
                  key={item?._id || item?.product || index}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item?.name || t("carts.sheet.product")}
                        className="size-12 shrink-0 rounded-md border border-border object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                        <Package className="size-5" aria-hidden="true" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {item?.name || t("carts.sheet.product")}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {"\u00D7"} {formatNumber(quantity, locale)} {"\u2022"}{" "}
                        <Money value={price} locale={locale} />
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-bold tabular-nums text-foreground">
                    <Money value={price * quantity} locale={locale} />
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-border p-4 text-center text-xs text-muted-foreground">
            {t("carts.sheet.noItems")}
          </div>
        )}

        <div className="flex justify-between rounded-lg border border-border bg-card p-4 text-sm font-bold">
          <span className="text-foreground">{t("carts.sheet.total")}</span>
          <span className="tabular-nums text-foreground">
            <Money value={cart.subtotal} locale={locale} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CartDetailsSheet({ selectedCart, isOpen, onClose }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {selectedCart && (
          <CartDetailsContent key={selectedCart._id} cart={selectedCart} />
        )}
      </SheetContent>
    </Sheet>
  );
}
