import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ArrowRight, Heart, LoaderCircle, TriangleAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

import useWishlist from "@/hooks/useWishlist";
import ProductCard from "@/features/products/components/ProductCard";

export default function Wishlist() {
  const { t } = useTranslation();
  const { wishlistItems, isLoading, error, refresh, clearWishlist } =
    useWishlist();

  const [isClearOpen, setIsClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const hasItems = wishlistItems.length > 0;
  const showGrid = !isLoading && !error && hasItems;
  const showEmpty = !isLoading && !error && !hasItems;

  const handleClear = async () => {
    setIsClearing(true);

    try {
      await clearWishlist();
      toast.success(t("wishlist.removed"));
      setIsClearOpen(false);
    } catch {
      toast.error(t("wishlist.clearError"));
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-(--color-surface-secondary) py-12 font-body text-(--color-text-primary)">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-(--color-text-primary)">
              {t("wishlist.title")}
            </h1>

            <p className="mt-1 text-sm text-(--color-text-secondary)">
              {t("wishlist.subtitle")}
            </p>

            {showGrid && (
              <p className="mt-1 text-sm text-(--color-text-secondary)">
                {t("wishlist.totalItems", { total: wishlistItems.length })}
              </p>
            )}
          </div>

          {showGrid && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsClearOpen(true)}
              className="gap-2"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {t("wishlist.clearAll")}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div
            role="status"
            className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center shadow-xs"
          >
            <LoaderCircle
              className="size-8 animate-spin text-(--color-text-secondary)"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm text-(--color-text-secondary)">
              {t("wishlist.loading")}
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center shadow-xs"
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-(--color-error-bg) text-(--color-error)">
              <TriangleAlert className="size-8" aria-hidden="true" />
            </div>

            <h2 className="font-display text-lg font-semibold text-(--color-text-primary)">
              {t("wishlist.loadError")}
            </h2>

            <Button onClick={refresh} className="mt-6 rounded-full">
              {t("wishlist.retry")}
            </Button>
          </div>
        ) : showEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center shadow-xs">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-(--color-surface-secondary) text-(--color-text-secondary)">
              <Heart className="size-8 opacity-60" aria-hidden="true" />
            </div>

            <h2 className="font-display text-lg font-semibold text-(--color-text-primary)">
              {t("wishlist.emptyTitle")}
            </h2>

            <p className="mt-1 max-w-md text-sm text-(--color-text-secondary)">
              {t("wishlist.emptyDescription")}
            </p>

            <Button asChild className="mt-6 cursor-pointer gap-2 rounded-full">
              <Link to="/products">
                {t("wishlist.browseProducts")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                viewMode="grid"
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={isClearOpen}
        onOpenChange={(open) => {
          if (!open && !isClearing) {
            setIsClearOpen(false);
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-(--color-error-bg) text-(--color-error)">
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>

            <AlertDialogTitle className="font-display">
              {t("wishlist.clearAllTitle")}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {t("wishlist.clearAllDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>
              {t("wishlist.cancel")}
            </AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              onClick={handleClear}
              disabled={isClearing}
            >
              {isClearing ? t("wishlist.clearing") : t("wishlist.clearAllConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
