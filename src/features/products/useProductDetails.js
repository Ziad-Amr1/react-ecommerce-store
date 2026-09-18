import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { getProduct } from "@/services/product.service";

export default function useProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const controllerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    getProduct(id, controller.signal)
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

    return () => controllerRef.current?.abort();
  }, [id, reloadKey]);

  const retry = () => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  return { product, isLoading, error, retry };
}