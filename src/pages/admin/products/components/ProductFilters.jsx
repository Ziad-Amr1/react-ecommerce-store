import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

export default function ProductFilters({ filters, setFilters, handleApplyFilters, clearFilters, showFilters, isFetching }) {
    return (
        <div className={`grid transition-all duration-300 ease-in-out ${showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="mb-4">
                        <h2 className="font-display font-semibold text-card-foreground">Filters</h2>
                        <p className="text-sm text-muted-foreground">Filter and sort your products</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" placeholder="Category" value={filters.category}
                                onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value, }))} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subcategory">Subcategory</Label>
                            <Input id="subcategory" placeholder="Subcategory" value={filters.subcategory}
                                onChange={(event) => setFilters((current) => ({ ...current, subcategory: event.target.value, }))} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input id="brand" placeholder="Brand" value={filters.brand}
                                onChange={(event) => setFilters((current) => ({ ...current, brand: event.target.value, }))} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort">Sort</Label>
                            <select id="sort" value={filters.sort}
                                onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value, }))}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                            >
                                <option value="">Default</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minPrice">Min Price</Label>
                            <Input id="minPrice" type="number" min="0" placeholder="0.00" value={filters.minPrice}
                                onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value, }))} className="font-mono" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxPrice">Max Price</Label>
                            <Input id="maxPrice" type="number" min="0" placeholder="0.00" value={filters.maxPrice}
                                onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value, }))} className="font-mono" />
                        </div>

                        <div className="flex items-end justify-end gap-2 md:col-span-2 lg:col-span-2">
                            <Button variant="outline" className="w-32 cursor-pointer border-border bg-background text-foreground hover:bg-muted" onClick={clearFilters} disabled={isFetching}>
                                Clear Filters
                            </Button>

                            <Button className="w-32 cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover" onClick={handleApplyFilters} disabled={isFetching}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}