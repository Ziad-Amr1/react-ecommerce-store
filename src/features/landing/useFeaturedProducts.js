import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getProducts } from "@/services/product.service";

export default function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const controllerRef = useRef(null);

  const fetchFeatured = useCallback(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    getProducts({}, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setProducts(data.products || []);
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
  }, []);

  useEffect(() => {
    fetchFeatured();

    return () => controllerRef.current?.abort();
  }, [fetchFeatured, reloadKey]);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured === true),
    [products],
  );

  const retry = () => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  return { featuredProducts, isLoading, error, retry };
}