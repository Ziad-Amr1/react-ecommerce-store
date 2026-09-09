import { useCallback, useEffect, useRef, useState } from "react";
import { getProduct } from "./product.service";

export default function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const controllerRef = useRef(null);

  const fetchProduct = useCallback(() => {
    if (!productId) {
      return;
    }

    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    getProduct(productId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setProduct(data.product);
        }
      })
      .catch((fetchError) => {
        if (!controller.signal.aborted) {
          setError(fetchError);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
  }, [productId]);

  useEffect(() => {
    fetchProduct();

    return () => controllerRef.current?.abort();
  }, [fetchProduct, reloadKey]);

  const retry = () => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  return { product, isLoading, error, retry };
}