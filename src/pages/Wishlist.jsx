import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ArrowRight, Heart, LoaderCircle, TriangleAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

import AccountPageHeader from "@/components/layout/AccountPageHeader";
import SEO from "@/components/SEO/SEO";
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
    <div className="min-h-[70vh] py-8 font-body text-foreground">
      <div className="mx-auto max-w-4xl space-y-6">
        <SEO
          title={t("wishlist.title")}
          description={t("wishlist.subtitle")}
          url="/wishlist"
          noindex
        />
        <AccountPageHeader
          title={t("wishlist.title")}
          description={t("wishlist.subtitle")}
          count={showGrid ? wishlistItems.length : undefined}
          actions={
            showGrid ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsClearOpen(true)}
                className="gap-2 cursor-pointer"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                {t("wishlist.clearAll")}
              </Button>
            ) : null
          }
        />

        {isLoading ? (
          <div
            role="status"
            className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-xs"
          >
            <LoaderCircle
              className="size-8 animate-spin text-muted-foreground"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm text-muted-foreground">
              {t("wishlist.loading")}
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-xs"
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-(--color-error-bg) text-(--color-error)">
              <TriangleAlert className="size-8" aria-hidden="true" />
            </div>

            <h2 className="font-display text-lg font-semibold text-foreground">
              {t("wishlist.loadError")}
            </h2>

            <Button onClick={refresh} className="mt-6 rounded-full cursor-pointer">
              {t("wishlist.retry")}
            </Button>
          </div>
        ) : showEmpty ? (
          <Empty className="border border-dashed bg-card p-8 sm:p-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Heart className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{t("wishlist.emptyTitle")}</EmptyTitle>
              <EmptyDescription>{t("wishlist.emptyDescription")}</EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
              <Button asChild className="gap-2 cursor-pointer rounded-full">
                <Link to="/products">
                  {t("wishlist.browseProducts")}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
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
