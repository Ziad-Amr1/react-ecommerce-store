import { useState, useEffect, createContext, useContext } from "react";
import api from "@/api/axios";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/products");
        setProducts(response.data.products);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);
  // Computing Featured Products ONLY
  const featuredProducts = products.filter(
    (product) => product.featured === true,
  );
  return (
    <ProductsContext.Provider
      value={{ products, featuredProducts, loading, error }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
export function useProducts() {
  const context = useContext(ProductsContext);
  return context;
}
