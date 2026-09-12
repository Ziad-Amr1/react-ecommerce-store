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

const FETCH_LOADING = "loading";
const FETCH_READY = "ready";

const CartProvider = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [serverCart, setServerCart] = useState(EMPTY_CART);
  const [guestCart, setGuestCart] = useState(EMPTY_CART);
  const [serverFetchState, setServerFetchState] = useState(FETCH_LOADING);
  const [serverLoadError, setServerLoadError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const controllerRef = useRef(null);
  const isSignedIn = !isAuthLoading && Boolean(user);

  const syncFromServer = useCallback((data) => {
    setServerCart(normalizeServerCart(data));
    setServerLoadError(null);
  }, []);

  // Load the signed-in user's server cart. Guests keep an ephemeral
  // in-memory cart (separate state) — there is no fake persistence.
  useEffect(() => {
    if (isAuthLoading || !user) {
      return undefined;
    }

    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    // Flip to "loading" as a microtask (not synchronously) so the effect
    // body only starts async work — the same pattern the rest of the app uses.
    Promise.resolve().then(() => {
      if (controller.signal.aborted) {
        return;
      }
      setServerFetchState(FETCH_LOADING);
      setServerLoadError(null);
    });

    getCart(controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) {
          syncFromServer(response.data);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          // A fresh account simply has no cart yet (404 = empty cart).
          if (error?.response?.status !== 404) {
            setServerLoadError(error);
          }
          setServerCart(EMPTY_CART);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setServerFetchState(FETCH_READY);
        }
      });

    return () => controller.abort();
  }, [isAuthLoading, user, syncFromServer]);

  const cart = isSignedIn ? serverCart : guestCart;
  const isLoading = isAuthLoading || (isSignedIn && serverFetchState === FETCH_LOADING);
  const loadError = isSignedIn ? serverLoadError : null;

  // Server mutations return the full updated cart, which keeps the server
  // response as the single source of truth for signed-in sessions.
  const mutate = useCallback(
    async (operation) => {
      setIsUpdating(true);
      try {
        const data = await operation();
        syncFromServer(data);
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

      await mutate(() =>
        addCartItem({ productId, quantity: 1 }).then((response) => response.data),
      );
    },
    [isSignedIn, mutate],
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (!isSignedIn) {
        setGuestCart((current) => setGuestQuantity(current, productId, quantity));
        return;
      }

      await mutate(() =>
        updateCartItem({ productId, quantity }).then((response) => response.data),
      );
    },
    [isSignedIn, mutate],
  );

  const removeItem = useCallback(
    async (productId) => {
      if (!isSignedIn) {
        setGuestCart((current) => removeGuestItem(current, productId));
        return;
      }

      await mutate(() =>
        removeCartItem(productId).then((response) => response.data),
      );
    },
    [isSignedIn, mutate],
  );

  const clear = useCallback(async () => {
    if (!isSignedIn) {
      setGuestCart(clearGuestCart());
      return;
    }

    await mutate(() => clearCart().then((response) => response.data));
  }, [isSignedIn, mutate]);

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