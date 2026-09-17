import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartStatsGrid } from "@/features/admin/carts/CartStatsGrid";
import { CartFiltersBar } from "@/features/admin/carts/CartFiltersBar";
import { CartList } from "@/features/admin/carts/Cartlist";
import { CartPagination } from "@/features/admin/carts/CartPagination";
import { CartDetailsSidebar } from "@/features/admin/carts/CartDetailsSidebar";
import { mockCarts } from "@/lib/mock-carts";
import { searchCarts } from "@/lib/cart-search";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const PAGE_SIZE = 10;

export default function Carts() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated_desc");
  const [page, setPage] = useState(1);

  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadedSignature, setLoadedSignature] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [selectedCart, setSelectedCart] = useState(null);

  const debouncedQuery = useDebouncedValue(query, 350);

  const filterSignature = `${debouncedQuery}|${status}|${sort}`;
  const prevFilterSignature = useRef(filterSignature);

  useEffect(() => {
    if (filterSignature !== prevFilterSignature.current) {
      prevFilterSignature.current = filterSignature;
      setPage(1);
    }
  }, [filterSignature]);

  const requestSignature = `${debouncedQuery}|${status}|${sort}|${page}`;
  const isLoading = loadedSignature !== requestSignature;

  useEffect(() => {
    const controller = new AbortController();

    searchCarts(
      {
        query: debouncedQuery,
        status,
        sort,
        page,
        pageSize: PAGE_SIZE,
      },
      controller.signal
    )
      .then(({ items, total: totalCount }) => {
        setCarts(items);
        setTotal(totalCount);
        setLoadedSignature(requestSignature);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;

        console.error("Failed to load carts:", err);
        setLoadedSignature(requestSignature);
      });

    return () => controller.abort();
  }, [debouncedQuery, status, sort, page, requestSignature]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key !== "Escape") return;
      if (selectedCart) return;
      if (expandedId) setExpandedId(null);
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [expandedId, selectedCart]);

  const toggleExpanded = (id) =>
    setExpandedId((current) => (current === id ? null : id));

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Admin
        </p>

        <h1 className="mt-1 font-display text-xl font-bold text-foreground sm:text-2xl">
          Carts
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View customer carts and their current items.
        </p>
      </div>

      <CartStatsGrid carts={mockCarts} />

      <CartFiltersBar
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-b bg-muted/30 py-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="size-4.5" />
            Customer Carts
          </CardTitle>

          <span className="text-xs text-muted-foreground">
            {isLoading ? "Searching…" : `${total} total`}
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <CartList
            carts={carts}
            expandedId={expandedId}
            onToggleExpanded={toggleExpanded}
            onOpenDetails={setSelectedCart}
          />
        </CardContent>

        <CartPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>

      <CartDetailsSidebar
        cart={selectedCart}
        open={Boolean(selectedCart)}
        onOpenChange={(open) => {
          if (!open) setSelectedCart(null);
        }}
      />
    </div>
  );
}