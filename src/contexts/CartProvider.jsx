import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import CartContext from "./CartContext";
import {
  addGuestItem,
  clearGuestCart,
  EMPTY_CART,
  normalizeServerCart,
  removeGuestItem,
  setGuestQuantity,
} from "@/features/cart/cartUtils";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/features/cart/cart.service";

// The server cart is owned by a specific user id. It is only ever rendered
// for signed-in users whose id matches the tag, so logging out or switching
// accounts can never leak a previous account's cart into the guest/view.
// All transitions happen in async callbacks (never synchronously in effects).
const CartProvider = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [serverState, setServerState] = useState({
    cart: EMPTY_CART,
    userId: null,
    loading: true,
  });
  const [serverLoadError, setServerLoadError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [guestCart, setGuestCart] = useState({ ...EMPTY_CART });

  const controllerRef = useRef(null);
  const currentUserId = user?._id ?? null;
  const isSignedIn = !isAuthLoading && Boolean(user);

  const syncFromServer = useCallback((data, userId) => {
    setServerState({
      cart: normalizeServerCart(data),
      userId,
      loading: false,
    });
    setServerLoadError(null);
  }, []);

  // Load the signed-in user's server cart. Guests keep an ephemeral
  // in-memory cart (separate state) — there is no fake persistence.
  useEffect(() => {
    if (isAuthLoading || !user || !currentUserId) {
      return undefined;
    }

    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    // Mark the load as pending in a microtask (not synchronously), matching
    // the async-only pattern the rest of the app follows.
    Promise.resolve().then(() => {
      if (controller.signal.aborted) {
        return;
      }
      setServerState((previous) => ({ ...previous, loading: true, userId: currentUserId }));
      setServerLoadError(null);
    });

    getCart(controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }
        syncFromServer(response.data, currentUserId);
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }
        // A fresh account simply has no cart yet (404 = empty cart).
        if (error?.response?.status !== 404) {
          setServerLoadError(error);
        }
        syncFromServer(null, currentUserId);
      });

    return () => controller.abort();
  }, [isAuthLoading, user, currentUserId, syncFromServer]);

  // Single derived source of truth. A signed-in user sees only the server cart
  // tagged with their own id; until that fetch lands they see the loading state
  // (never a different user's cart). Guests see their own in-memory cart.
  const canShowServerCart = isSignedIn && serverState.userId === currentUserId;
  const cart = isSignedIn
    ? canShowServerCart
      ? serverState.cart
      : EMPTY_CART
    : guestCart;
  const isLoading =
    isAuthLoading || (isSignedIn && (serverState.loading || !canShowServerCart));
  const loadError = isSignedIn ? serverLoadError : null;

  // Server mutations return the full updated cart, which keeps the server
  // response as the single source of truth for signed-in sessions.
  const mutate = useCallback(
    async (operation, userId) => {
      setIsUpdating(true);
      try {
        const data = await operation();
        syncFromServer(data, userId);
        return data;
      } finally {
        setIsUpdating(false);
      }
    },
    [syncFromServer],
  );

  const addItem = useCallback(
    async (product) => {
      const productId = product?._id ?? product?.id;
      if (!productId) {
        return;
      }

      if (!isSignedIn) {
        setGuestCart((current) => addGuestItem(current, product));
        return;
      }

      await mutate(
        () => addCartItem({ productId, quantity: 1 }).then((response) => response.data),
        currentUserId,
      );
    },
    [isSignedIn, mutate, currentUserId],
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (!isSignedIn) {
        setGuestCart((current) => setGuestQuantity(current, productId, quantity));
        return;
      }

      await mutate(
        () => updateCartItem({ productId, quantity }).then((response) => response.data),
        currentUserId,
      );
    },
    [isSignedIn, mutate, currentUserId],
  );

  const removeItem = useCallback(
    async (productId) => {
      if (!isSignedIn) {
        setGuestCart((current) => removeGuestItem(current, productId));
        return;
      }

      await mutate(
        () => removeCartItem(productId).then((response) => response.data),
        currentUserId,
      );
    },
    [isSignedIn, mutate, currentUserId],
  );

  const clear = useCallback(async () => {
    if (!isSignedIn) {
      setGuestCart(clearGuestCart());
      return;
    }

    await mutate(
      () => clearCart().then((response) => response.data),
      currentUserId,
    );
  }, [isSignedIn, mutate, currentUserId]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isUpdating,
        loadError,
        isSignedIn,
        addItem,
        updateQuantity,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;