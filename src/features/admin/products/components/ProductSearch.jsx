import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import ProductThumb from "./ProductThumb";

export default function ProductSearch({
  search,
  appliedSearch,
  products,
  onChange,
  onSelect,
}) {
  const { t } = useTranslation();

  const showResults =
    search.trim().length >= 3 &&
    search === appliedSearch &&
    products.length > 0;

  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        value={search}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("products.searchPlaceholder")}
        className="h-10 ps-9 pe-9"
      />
      {search !== "" && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t("products.clearSearch")}
          className="absolute end-2 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}

      {showResults && (
        <div className="absolute start-0 end-0 top-11 z-50 overflow-hidden rounded-md border bg-card shadow-lg">
          {products.map((product) => (
            <button
              key={product._id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(product.name)}
              className="flex w-full cursor-pointer items-center gap-3 border-b border-border p-3 text-start last:border-b-0 hover:bg-muted"
            >
              <ProductThumb
                url={product.images?.[0]?.url}
                alt={product.name}
                className="size-9"
              />
              <span className="truncate text-sm font-medium text-foreground">
                {product.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}