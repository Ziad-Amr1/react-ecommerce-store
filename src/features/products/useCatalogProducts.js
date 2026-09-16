import { useCallback, useRef, useState } from "react";
import { getProducts } from "@/services/product.service";

const useCatalogProducts = () => {
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(null);

  const hasFetchedCatalog = useRef(false);

  const fetchCatalogProducts = useCallback(async (totalProducts) => {
    if (hasFetchedCatalog.current) {
      return;
    }

    if (!totalProducts || totalProducts <= 0) {
      return;
    }

    try {
      setIsCatalogLoading(true);
      setCatalogError(null);

      const data = await getProducts({
        page: 1,
        limit: totalProducts,
      });

      const products = Array.isArray(data.products) ? data.products : [];

      setCatalogProducts(products);
      hasFetchedCatalog.current = true;

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
