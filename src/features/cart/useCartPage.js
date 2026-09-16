
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProduct } from "@/services/product.service";
import { getApiErrorMessage } from "@/features/cart/cartUtils";

const useCartPage = ({
  items,
  itemIdsKey,
  isUpdating,
  removeItem,
  updateQuantity,
  clear,
  applyCoupon,
  removeCoupon,
  addItem,
  t,
}) => {
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isRemovingCoupon, setIsRemovingCoupon] = useState(false);

  const [savedItems, setSavedItems] = useState([]);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  const [stockCeilings, setStockCeilings] = useState({});

  const handleRemove = async (item) => {
    try {
      await removeItem(item.id);
      toast.success(t("cart.removed", { name: item.name }));
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("cart.removeFailed")));
    }
  };

  
const handleQuantityChange = async (item, quantity) => {
  if (isUpdating || quantity < 1) return;

  try {
    await updateQuantity(item.id, quantity);

    setStockCeilings((prev) => {
      if (!(item.id in prev)) return prev;

      const next = { ...prev };
      delete next[item.id];
      return next;
    });
  } catch (error) {
    const message = getApiErrorMessage(error, t("cart.updateFailed"));

    toast.error(message);

    if (quantity > item.quantity && /stock/i.test(message)) {
      const match = message.match(/(\d+)\s+items?\s+available/i);
      const extraAvailable = match ? Number(match[1]) : 0;
      const ceiling = item.quantity + extraAvailable;

      setStockCeilings((prev) => ({
        ...prev,
        [item.id]: ceiling,
      }));
    }
  }
};


  const handleClear = async () => {
    if (isClearing) return;

    setIsClearing(true);

    try {
      await clear();

      toast.success(t("cart.cleared"));
      setIsClearOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("cart.clearFailed")));
    } finally {
      setIsClearing(false);
    }
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();

    const code = promoCode.trim();

    if (!code || isApplyingPromo || !applyCoupon) return;

    setIsApplyingPromo(true);

    try {
      const result = await applyCoupon(code);

      toast.success(
        result?.message || t("cart.couponApplied", "Coupon applied"),
      );

      setPromoCode("");
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          t("cart.couponInvalid", "Invalid coupon or empty cart"),
        ),
      );
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemoveCoupon = async () => {
    if (isRemovingCoupon || !removeCoupon) return;

    setIsRemovingCoupon(true);

    try {
      const result = await removeCoupon();

      toast.success(
        result?.message || t("cart.couponRemoved", "Coupon removed"),
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          t("cart.couponRemoveFailed", "Couldn't remove coupon"),
        ),
      );
    } finally {
      setIsRemovingCoupon(false);
    }
  };

  const handleSaveForLater = async (item) => {
    try {
      await removeItem(item.id);

      setSavedItems((prev) => [...prev, item]);
      setIsSavedOpen(true);

      toast.success(t("cart.savedForLater", { name: item.name }));
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("cart.updateFailed")));
    }
  };

  const handleMoveToCart = async (item) => {
    if (!addItem) {
      toast.error(t("cart.updateFailed"));
      return;
    }

    try {
      await addItem(item);

      if (item.quantity > 1) {
        await updateQuantity(item.id, item.quantity);
      }

      setSavedItems((prev) => prev.filter((i) => i.id !== item.id));

      toast.success(t("cart.movedToCart", { name: item.name }));
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("cart.updateFailed")));
    }
  };

  useEffect(() => {
    if (items.length === 0) return undefined;

    const controller = new AbortController();
    let cancelled = false;

    Promise.allSettled(
      items.map((item) =>
        getProduct(item.id, controller.signal).then((result) => ({
          id: item.id,
          ceiling: item.quantity + (result?.product?.stock ?? 0),
        })),
      ),
    ).then((results) => {
      if (cancelled) return;

      setStockCeilings((prev) => {
        const next = { ...prev };

        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value.ceiling != null) {
            next[result.value.id] = result.value.ceiling;
          }
        });

        return next;
      });
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [itemIdsKey, items]);

  const itemsWithStock = items.map((item) => {
    const ceiling = stockCeilings[item.id];

    const inStock = ceiling === undefined || ceiling > 0;
    const canIncrease = ceiling === undefined || item.quantity < ceiling;

    const atMaxAvailable =
      inStock && ceiling !== undefined && item.quantity === ceiling;

    const overStockLimit =
      inStock && ceiling !== undefined && item.quantity > ceiling;

    return {
      ...item,
      inStock,
      ceiling,
      canIncrease,
      atMaxAvailable,
      overStockLimit,
    };
  });

  const hasBlockingStockIssue = itemsWithStock.some(
    (item) => !item.inStock || item.overStockLimit,
  );

  return {
    isClearOpen,
    setIsClearOpen,
    isClearing,

    promoCode,
    setPromoCode,
    isApplyingPromo,
    isRemovingCoupon,

    savedItems,
    isSavedOpen,
    setIsSavedOpen,

    itemsWithStock,
    hasBlockingStockIssue,

    handleRemove,
    handleQuantityChange,
    handleClear,
    handleApplyPromo,
    handleRemoveCoupon,
    handleSaveForLater,
    handleMoveToCart,
  };
};

export default useCartPage;