import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  BadgePercent,
  LogIn,
  Minus,
  PackageOpen,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import { formatCurrency } from "@/utils/formatCurrency";

function CartLineSkeleton() {
  return (
    <div className="flex gap-4 p-4">
      <div className="size-20 shrink-0 animate-pulse rounded-lg bg-(--color-surface-secondary)" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 w-1/2 animate-pulse rounded bg-(--color-surface-secondary)" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-(--color-surface-secondary)" />
      </div>
      <div className="h-8 w-20 animate-pulse self-end rounded bg-(--color-surface-secondary)" />
    </div>
  );
}

export default function Cart() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    cart,
    isLoading,
    isUpdating,
    isSignedIn,
    removeItem,
    updateQuantity,
    clear,
  } = useCart();
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const isGuest = !user;

  const handleRemove = async (item) => {
    try {
      await removeItem(item.id);
      toast.success(t("cart.removed", { name: item.name }));
    } catch {
      toast.error(t("cart.removeFailed"));
    }
  };

  const handleQuantityChange = async (item, quantity) => {
    if (isUpdating || quantity < 1) {
      return;
    }

    try {
      await updateQuantity(item.id, quantity);
    } catch {
      toast.error(t("cart.updateFailed"));
    }
  };

  const handleClear = async () => {
    if (isClearing) {
      return;
    }

    setIsClearing(true);

    try {
      await clear();
      toast.success(t("cart.cleared"));
      setIsClearOpen(false);
    } catch {
      toast.error(t("cart.clearFailed"));
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t("cart.title")}
        </h1>
        {cart.itemCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("cart.itemsCount", { count: cart.itemCount })}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="divide-y divide-border border-(--color-border)">
            <CartLineSkeleton />
            <CartLineSkeleton />
            <CartLineSkeleton />
          </Card>
          <Card className="h-56 animate-pulse border-(--color-border)" />
        </div>
      ) : cart.items.length === 0 ? (
        <Empty className="mt-6 border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingCart className="size-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{t("cart.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("cart.emptyDescription")}</EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Button asChild>
              <Link to="/products">{t("cart.browseProducts")}</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Lines */}
          <Card className="border-(--color-border)">
            <ul className="divide-y divide-(--color-border)">
              {cart.items.map((item) => (
                <li key={item.id}>
                  <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-(--color-surface-secondary)">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PackageOpen
                            className="size-5 text-(--color-text-disabled)"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${item.id}`}
                        className="line-clamp-2 font-medium text-(--color-text-primary) transition-colors hover:text-(--color-primary)"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("cart.unitPrice", {
                          price: formatCurrency(item.price),
                        })}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="cursor-pointer"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                          aria-label={t("cart.minus")}
                        >
                          <Minus className="size-3.5" aria-hidden="true" />
                        </Button>

                        <span
                          className="min-w-8 text-center text-sm font-semibold tabular-nums text-(--color-text-primary)"
                          aria-label={t("cart.quantity")}
                        >
                          {item.quantity}
                        </span>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="cursor-pointer"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          disabled={isUpdating}
                          aria-label={t("cart.plus")}
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end justify-between gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer text-muted-foreground hover:text-(--color-error)"
                        onClick={() => handleRemove(item)}
                        disabled={isUpdating}
                        aria-label={t("cart.removeItem", { name: item.name })}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                      <p className="font-semibold tabular-nums text-(--color-text-primary)">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Summary */}
          <div className="space-y-4">
            {isGuest && (
              <div className="flex items-start gap-3 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) p-4">
                <LogIn className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  {t("cart.guestNote")}
                </p>
              </div>
            )}

            <Card className="border-(--color-border)">
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCurrency(cart.subtotal)}
                  </span>
                </div>

                {isSignedIn && cart.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-success">
                      <BadgePercent className="size-4" aria-hidden="true" />
                      {t("cart.discount")}
                      {cart.coupon ? ` · ${cart.coupon}` : ""}
                    </span>
                    <span className="tabular-nums text-success">
                      -{formatCurrency(cart.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-(--color-border) pt-4">
                  <span className="font-medium text-foreground">{t("cart.total")}</span>
                  <span className="font-display text-xl font-bold tabular-nums text-foreground">
                    {formatCurrency(cart.total)}
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    asChild
                    className="bg-(--color-primary) text-primary-foreground hover:bg-(--color-secondary)"
                  >
                    <Link to="/products">{t("cart.continueShopping")}</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-(--color-border) text-muted-foreground hover:text-(--color-error)"
                    onClick={() => setIsClearOpen(true)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    {t("cart.clear")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Clear cart confirmation */}
      <AlertDialog
        open={isClearOpen}
        onOpenChange={(open) => !open && !isClearing && setIsClearOpen(false)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-error-bg text-error">
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="font-display">
              {t("cart.clearTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("cart.clearDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>
              {t("cart.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleClear}
              disabled={isClearing}
            >
              {isClearing ? t("cart.clearing") : t("cart.clearConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}