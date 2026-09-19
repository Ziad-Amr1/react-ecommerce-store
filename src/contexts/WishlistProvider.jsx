import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import {
  addToWishlist as addToWishlistRequest,
  clearWishlist as clearWishlistRequest,
  getMyWishlist,
  removeFromWishlist as removeFromWishlistRequest,
} from "@/services/wishlist.service";
import WishlistContext from "./WishlistContext";

const EMPTY_WISHLIST = [];

function getProductId(item) {
  if (!item) return null;
  if (typeof item === "string") return item;
  return item._id ?? item.id ?? null;
}

function sameProductId(item, productId) {
  return String(getProductId(item)) === String(productId);
}

const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const controllerRef = useRef(null);
  const userId = user?._id ?? null;

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      controllerRef.current?.abort();
      return undefined;
    }

    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    getMyWishlist(controller.signal)
      .then((products) => {
        if (!controller.signal.aborted) {
          setWishlistItems(products);
          setError(null);
        }
      })
      .catch((fetchError) => {
        if (!controller.signal.aborted) {
          setError(fetchError);
          setWishlistItems([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isAuthLoading, isAuthenticated, userId, reloadKey]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  const visibleItems = isAuthenticated ? wishlistItems : EMPTY_WISHLIST;

  const isInWishlist = useCallback(
    (productId) => {
      if (!isAuthenticated || !productId) return false;

      return visibleItems.some((item) => sameProductId(item, productId));
    },
    [isAuthenticated, visibleItems],
  );

  const addToWishlist = useCallback(async (productOrId) => {
    const productId =
      typeof productOrId === "string" ? productOrId : getProductId(productOrId);
    if (!productId) return;

    const marker =
      productOrId && typeof productOrId === "object"
        ? productOrId
        : { _id: productId };

    setWishlistItems((current) =>
      current.some((item) => sameProductId(item, productId))
        ? current
        : [...current, marker],
    );

    try {
      await addToWishlistRequest(productId);
    } catch (err) {
      setWishlistItems((current) =>
        current.filter((item) => !sameProductId(item, productId)),
      );
      throw err;
    }
  }, []);

  const removeFromWishlist = useCallback(
    async (productOrId) => {
      const productId =
        typeof productOrId === "string" ? productOrId : getProductId(productOrId);
      if (!productId) return;

      const removed = wishlistItems.find((item) =>
        sameProductId(item, productId),
      );

      setWishlistItems((current) =>
        current.filter((item) => !sameProductId(item, productId)),
      );

      try {
        await removeFromWishlistRequest(productId);
      } catch (err) {
        if (removed) {
          setWishlistItems((current) =>
            current.some((item) => sameProductId(item, productId))
              ? current
              : [...current, removed],
          );
        }
        throw err;
      }
    },
    [wishlistItems],
  );

  const clearWishlist = useCallback(async () => {
    const snapshot = wishlistItems;
    setWishlistItems([]);

    try {
      await clearWishlistRequest();
    } catch (err) {
      setWishlistItems(snapshot);
      throw err;
    }
  }, [wishlistItems]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: visibleItems,
        isLoading: isAuthenticated && isLoading,
        error: isAuthenticated ? error : null,
        refresh,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
