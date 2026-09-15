import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

export default function ProductSearch({ search, onChange }) {
  const { t } = useTranslation();

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
    </div>
  );
}