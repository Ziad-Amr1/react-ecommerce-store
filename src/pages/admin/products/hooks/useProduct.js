import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../../api/axios";

function useProduct() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await api.get(`/products/${id}`);
                setProduct(response.data.product);
            } catch (error) {
                console.error("Failed to load product:", error);
                setError("Failed to load product. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return { id, product, isLoading, error };
}

export default useProduct;