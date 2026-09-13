import { useEffect, useState } from "react";
import { getProducts } from "@/services/product.service";

const useRelatedProducts = (product) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!product?._id || !product?.category) {
      return;
    }

    const controller = new AbortController();

    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getProducts(
          {
            page: 1,
            limit: 9,
            category: product.category,
          },
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        const products = Array.isArray(data.products)
          ? data.products
          : [];

        const otherProducts = products.filter(
          (item) => item._id !== product._id,
        );

        setSimilarProducts(otherProducts.slice(0, 4));
        setRecommendedProducts(otherProducts.slice(4, 8));
      } catch {
        if (!controller.signal.aborted) {
          setSimilarProducts([]);
          setRecommendedProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchRelatedProducts();

    return () => controller.abort();
  }, [product?._id, product?.category]);

  return {
    similarProducts,
    recommendedProducts,
    isLoading,
  };
};

export default useRelatedProducts;