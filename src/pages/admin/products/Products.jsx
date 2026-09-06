import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { SlidersHorizontal } from "lucide-react";
import api from "../../../api/axios";
import { Button } from "../../../components/ui/button";
import ProductSearch from "./components/ProductSearch";
import ProductFilters from "./components/ProductFilters";
import ProductsTable from "./components/ProductsTable";
import ProductPagination from "./components/ProductPagination";
import DeleteProductDialog from "./components/DeleteProductDialog";

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const skipSearchEffect = useRef(false);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    else setIsFetching(true);

    setError(null);

    try {
      const response = await api.get("/products", {
        params: {
          search: appliedSearch,
          category: appliedFilters.category,
          subcategory: appliedFilters.subcategory,
          brand: appliedFilters.brand,
          minPrice: appliedFilters.minPrice,
          maxPrice: appliedFilters.maxPrice,
          sort: appliedFilters.sort,
          page: currentPage,
          limit: 5,
        },
      });

      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error.response?.data?.message || "Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      try {
        const response = await api.get("/products", {
          params: {
            search: appliedSearch,
            category: appliedFilters.category,
            subcategory: appliedFilters.subcategory,
            brand: appliedFilters.brand,
            minPrice: appliedFilters.minPrice,
            maxPrice: appliedFilters.maxPrice,
            sort: appliedFilters.sort,
            page: currentPage,
            limit: 5,
          },
        });

        if (ignore) return;

        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
        setError(null);
      } catch (error) {
        if (ignore) return;

        console.error("Failed to fetch products:", error);
        setError(error.response?.data?.message || "Failed to load products. Please try again.");
      } finally {
        if (!ignore) {
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [currentPage, appliedSearch, appliedFilters]);

  // search
  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }

    if (search.length < 3) {
      return;
    }

    const getSearchResults = async () => {
      try {
        const response = await api.get("/products", {
          params: { search, page: 1, limit: 5 },
        });

        const results = response.data.products || [];
        setSearchResults(results);
        setShowSearchResults(results.length > 0);
      } catch (error) {
        console.error("Failed to search products:", error);
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };

    const timer = setTimeout(getSearchResults, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    skipSearchEffect.current = false;
    setSearch(value);

    if (value === "") {
      setSearchResults([]);
      setAppliedSearch("");
      setCurrentPage(1);
      setShowSearchResults(false);
    }
  };

  const handleSearch = () => {
    setShowSearchResults(false);
    setCurrentPage(1);
    setAppliedSearch(search);
  };

  const handleSelectSearchResult = (product) => {
    skipSearchEffect.current = true;
    setSearch(product.name);
    setAppliedSearch(product.name);
    setCurrentPage(1);
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: "",
      subcategory: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
  };

  const handleDelete = async (productId) => {
    setDeletingProductId(productId);

    try {
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");

      if (products.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchProducts();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);

      const apiMessage = error.response?.data?.message || "";
      toast.error(apiMessage || "Failed to delete product. Please try again.");
    } finally {
      setDeletingProductId(null);
      setProductToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="mb-6">
          <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <div className="p-4">
            <div className="mb-4 h-10 animate-pulse rounded-md bg-muted" />

            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 border-b border-border py-4">
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-muted" />
                <div className="h-4 flex-1 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border border-border bg-card shadow-sm">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-error-bg">
            <span className="text-2xl text-error">!</span>
          </div>

          <h2 className="font-display text-lg font-semibold text-foreground">Failed to load products</h2>
          <p className="mt-1 text-sm text-muted-foreground">Something went wrong while loading the products.</p>
          <Button className="mt-4 cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover" onClick={() => fetchProducts(true)}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("Products")}</h1>
        <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover" onClick={() => navigate("/admin/products/add")}>Add Product</Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex w-full flex-col gap-3 md:flex-row">
          <ProductSearch search={search} searchResults={searchResults}
            showSearchResults={showSearchResults} setShowSearchResults={setShowSearchResults}
            handleSearchChange={handleSearchChange} handleSearch={handleSearch}
            handleSelectSearchResult={handleSelectSearchResult} isFetching={isFetching}
          />

          <Button variant="outline" className="cursor-pointer border-border bg-background text-foreground hover:bg-muted"
            onClick={() => setShowFilters((current) => !current)} disabled={isFetching}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />Filters
          </Button>
        </div>

        <ProductFilters
          filters={filters} setFilters={setFilters} handleApplyFilters={handleApplyFilters}
          clearFilters={clearFilters} showFilters={showFilters} isFetching={isFetching}
        />
      </div>

      <ProductsTable
        products={products} isFetching={isFetching} deletingProductId={deletingProductId}
        navigate={navigate} setProductToDelete={setProductToDelete}
      />

      <ProductPagination
        currentPage={currentPage} totalPages={totalPages}
        isFetching={isFetching} setCurrentPage={setCurrentPage}
      />

      <DeleteProductDialog productToDelete={productToDelete} deletingProductId={deletingProductId}
        setProductToDelete={setProductToDelete} handleDelete={handleDelete}
      />
    </div>
  );
}