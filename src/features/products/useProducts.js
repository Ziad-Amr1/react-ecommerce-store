import { useState, useCallback } from "react";
import { getAllProducts } from "./products.service";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setApiError(null);

      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsPaginationLoading(true);
      }

      const data = await getAllProducts({
        page,
        limit: 12,
      });

      setProducts(data.products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalProducts(data.totalProducts);
    } catch (error) {
      setApiError(error);
    } finally {
      setIsLoading(false);
      setIsPaginationLoading(false);
    }
  }, []);

  //   useEffect(() => {
  //     fetchProducts(1);
  //   }, [fetchProducts]);

  return {
    products,
    currentPage,
    totalPages,
    totalProducts,
    isLoading,
    isPaginationLoading,
    apiError,
    fetchProducts,
  };
};

export default useProducts;
