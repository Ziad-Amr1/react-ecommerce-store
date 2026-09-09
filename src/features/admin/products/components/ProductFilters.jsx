import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "../constants";

export default function ProductFilters({
  filters,
  setFilters,
  onApply,
  onClear,
  isFetching,
}) {
  const { t } = useTranslation();

  const updateField = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div>
        <h2 className="font-display font-semibold text-foreground">
          {t("products.filtersTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("products.filtersSubtitle")}
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="filter-category">
            {t("products.fields.category")}
          </Label>
          <Input
            id="filter-category"
            value={filters.category}
            onChange={(event) => updateField("category", event.target.value)}
            placeholder={t("products.filters.categoryPlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-brand">{t("products.fields.brand")}</Label>
          <Input
            id="filter-brand"
            value={filters.brand}
            onChange={(event) => updateField("brand", event.target.value)}
            placeholder={t("products.filters.brandPlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-minPrice">
            {t("products.fields.minPrice")}
          </Label>
          <Input
            id="filter-minPrice"
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) => updateField("minPrice", event.target.value)}
            placeholder="0.00"
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-maxPrice">
            {t("products.fields.maxPrice")}
          </Label>
          <Input
            id="filter-maxPrice"
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) => updateField("maxPrice", event.target.value)}
            placeholder="0.00"
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label>{t("products.fields.sort")}</Label>
          <Select
            value={filters.sort || undefined}
            onValueChange={(value) => updateField("sort", value)}
          >
            <SelectTrigger className="w-full" aria-label={t("products.fields.sort")}>
              <SelectValue placeholder={t("products.sort.default")} />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end justify-end gap-2 lg:col-span-2">
          <Button variant="outline" onClick={onClear} disabled={isFetching}>
            {t("products.filters.clear")}
          </Button>
          <Button onClick={onApply} disabled={isFetching}>
            {t("products.filters.apply")}
          </Button>
        </div>
      </div>
    </div>
  );
}