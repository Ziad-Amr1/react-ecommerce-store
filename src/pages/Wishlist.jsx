import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Heart, Trash2, ArrowLeft, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import ProductCard from "@/features/products/components/ProductCard";

export default function WishlistPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wishlistItems, loding, error, loadWishlist, clearWishlist, removeFromWishlist } = useWishlist();
  
  const [isClearing, setIsClearing] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleClearAll = async () => {
    if (window.confirm(t("wishlist.confirmClear", "Are you sure you want to clear your wishlist?"))) {
      try {
        setIsClearing(true);
        await clearWishlist();
        toast.success(t("wishlist.cleared", "Wishlist cleared successfully"));
      } catch {
        toast.error(t("wishlist.clearError", "Failed to clear wishlist"));
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleCardClick = (e, product) => {
    const isWishlistButton = e.target.closest("button[aria-label*='wishlist'], button[aria-label*='Remove'], button[aria-label*='Add']");
    if (isWishlistButton) {
      e.preventDefault();
      setProductToRemove(product);
    }
  };

  const handleConfirmRemove = async () => {
    if (!productToRemove) return;
    const prodId = productToRemove._id || productToRemove.id;
    
    try {
      setIsRemoving(true);
      await removeFromWishlist(prodId);
      toast.success(t("wishlist.removed", "Removed from wishlist"));
      setProductToRemove(null);
    } catch {
      toast.error(t("wishlist.error", "Something went wrong"));
    } finally {
      setIsRemoving(false);
    }
  };

  if (loding && wishlistItems.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-secondary)] py-6 sm:py-10 font-body">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {wishlistItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] sm:size-default cursor-pointer"
                onClick={() => navigate("/products")}
              >
                <ArrowLeft className="size-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
                <span className="text-xs sm:text-sm">{t("products.backToList", "Back to Shop")}</span>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                disabled={isClearing}
                className="flex items-center gap-1.5 sm:size-default sm:gap-2 cursor-pointer"
              >
                {isClearing ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="size-4" aria-hidden="true" />
                )}
                <span className="text-xs sm:text-sm">{t("wishlist.clearAll", "Clear All")}</span>
              </Button>
            </div>

            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                {t("wishlist.title", "My Wishlist")}
              </h1>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
            <p className="text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={loadWishlist} className="mt-2 cursor-pointer">
              {t("products.retry", "Retry")}
            </Button>
          </div>
        )}

        {!loding && wishlistItems.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-sm">
              <Heart className="size-8 text-[var(--color-text-disabled)]" />
            </div>
            <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">
              {t("wishlist.emptyTitle", "Your wishlist is empty")}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-sm">
              {t("wishlist.emptySubtitle", "Save items you love to your wishlist. They'll be waiting for you here.")}
            </p>
            {/* Added cursor-pointer here */}
            <Button className="mt-6 cursor-pointer" onClick={() => navigate("/products")}>
              {t("wishlist.explore", "Explore Products")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {wishlistItems.map((item) => {
              const product = item.product || item;
              const prodId = product._id || product.id;
              if (!prodId) return null;

              return (
                <div 
                  key={prodId} 
                  onClick={(e) => handleCardClick(e, product)}
                >
                  <ProductCard 
                    product={product} 
                    showDetailsButton={false} 
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Modal بسيط وهادئ */}
        {productToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] p-6 shadow-lg space-y-5 border border-[var(--color-border)] text-center relative animate-fade-in">
              
              <button
                type="button"
                onClick={() => setProductToRemove(null)}
                className="absolute top-4 end-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
              >
                <X className="size-4" />
              </button>

              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--color-surface-secondary)] text-red-500">
                <Heart className="size-6 fill-current" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                  {t("wishlist.removeModalTitle", "Remove from Wishlist?")}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {t("wishlist.removeModalDesc", "Do you want to remove this item from your saved list?")}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl cursor-pointer"
                  onClick={() => setProductToRemove(null)}
                  disabled={isRemoving}
                >
                  {t("common.cancel", "Cancel")}
                </Button>

                <Button
                  className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                  onClick={handleConfirmRemove}
                  disabled={isRemoving}
                >
                  {isRemoving ? <LoaderCircle className="size-4 animate-spin" /> : t("common.yes", "Yes, Remove")}
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}







