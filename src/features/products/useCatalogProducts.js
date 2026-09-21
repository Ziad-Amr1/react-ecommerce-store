import { useCallback, useRef, useState } from "react";
import { getProducts } from "@/services/product.service";

const useCatalogProducts = () => {
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(null);

  const catalogCacheRef = useRef(null);

  const fetchCatalogProducts = useCallback(async () => {
    if (catalogCacheRef.current) {
      setCatalogProducts(catalogCacheRef.current);
      return catalogCacheRef.current;
    }

    try {
      setIsCatalogLoading(true);
      setCatalogError(null);

      // First request: NO filters
      const firstResponse = await getProducts({
        page: 1,
        limit: 12,
      });

      const totalProducts = Number(firstResponse.totalProducts);

      if (!totalProducts) {
        return [];
      }

      // Get the complete catalog
      const response = await getProducts({
        page: 1,
        limit: totalProducts,
      });

      const products = Array.isArray(response.products)
        ? response.products
        : [];

      catalogCacheRef.current = products;
      setCatalogProducts(products);

      return products;
    } catch (error) {
      setCatalogError(error);
      return [];
    } finally {
      setIsCatalogLoading(false);
    }
  }, []);

  return {
    catalogProducts,
    isCatalogLoading,
    catalogError,
    fetchCatalogProducts,
  };
};

export default useCatalogProducts;
