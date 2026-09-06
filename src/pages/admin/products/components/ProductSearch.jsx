import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

export default function ProductSearch({ search, searchResults, showSearchResults,
    setShowSearchResults, handleSearchChange, handleSearch, handleSelectSearchResult, isFetching }) {
    return (
        <div className="flex w-full flex-1 flex-col gap-3 md:flex-row">
            <div className="relative flex flex-1 gap-2">
                <div className="relative flex-1">
                    <Input value={search} onChange={handleSearchChange} placeholder="Search products..." className="h-10"
                        onFocus={() => {
                            if (search.length >= 3 && searchResults.length > 0) {
                                setShowSearchResults(true);
                            }
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />

                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-md border border-border bg-card shadow-lg">
                            {searchResults.map((product) => (
                                <button key={product._id} type="button" onClick={() => handleSelectSearchResult(product)}
                                    className="flex w-full cursor-pointer items-center gap-3 border-b border-border p-3 text-left text-foreground last:border-b-0 hover:bg-muted">
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-background">
                                        {product.images?.length > 0 ? (
                                            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No Image</div>
                                        )}
                                    </div>

                                    <span className="truncate text-sm font-medium">{product.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover" onClick={handleSearch} disabled={isFetching}>Search</Button>
            </div>
        </div>
    );
}