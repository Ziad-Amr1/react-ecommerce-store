import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

export default function ProductFilters({ filters, setFilters, handleApplyFilters, clearFilters, showFilters, isFetching }) {
    const { t } = useTranslation();

    return (
        <div className={`grid transition-all duration-300 ease-in-out ${showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="mb-4">
                        <h2 className="font-display font-semibold text-card-foreground">{t("products.filterTitle")}</h2>
                        <p className="text-sm text-muted-foreground">{t("products.filterDescription")}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">{t("products.category")}</Label>
                            <Input id="category" placeholder={t("products.category")} value={filters.category}
                                onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value, }))} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subcategory">{t("products.subcategory")}</Label>
                            <Input id="subcategory" placeholder={t("products.subcategory")} value={filters.subcategory}
                                onChange={(event) => setFilters((current) => ({ ...current, subcategory: event.target.value, }))} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brand">{t("products.brand")}</Label>
                            <Input id="brand" placeholder={t("products.brand")} value={filters.brand}
                                onChange={(event) => setFilters((current) => ({ ...current, brand: event.target.value, }))} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort">{t("products.sort")}</Label>
                            <select id="sort" value={filters.sort}
                                onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value, }))}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm 
                                text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                            >
                                <option value="">{t("products.defaultSort")}</option>
                                <option value="price_asc">{t("products.priceLowToHigh")}</option>
                                <option value="price_desc">{t("products.priceHighToLow")}</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minPrice">{t("products.minPrice")}</Label>
                            <Input id="minPrice" type="number" min="0" placeholder="0.00" value={filters.minPrice}
                                onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value, }))} className="font-mono" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxPrice">{t("products.maxPrice")}</Label>
                            <Input id="maxPrice" type="number" min="0" placeholder="0.00" value={filters.maxPrice}
                                onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value, }))} className="font-mono" />
                        </div>

                        <div className="flex items-end justify-end gap-2 md:col-span-2 lg:col-span-2">
                            <Button variant="outline" className="w-32 cursor-pointer border-border bg-background text-foreground hover:bg-muted" onClick={clearFilters} disabled={isFetching}>
                                {t("products.clearFilters")}
                            </Button>

                            <Button className="w-32 cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover" onClick={handleApplyFilters} disabled={isFetching}>
                                {t("products.applyFilters")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}