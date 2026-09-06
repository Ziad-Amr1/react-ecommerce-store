function ProductDetailsSections({ product }) {
    return (
        <>
            {/* Description */}
            <div className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-card-foreground">Description</h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                    {product.description || "No description available."}
                </p>
            </div>

            {/* Tags */}
            <div className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-card-foreground">Tags</h2>

                <div className="mt-3 flex flex-wrap gap-2">
                    {product.tags?.length > 0 ? (
                        product.tags.map((tag, index) => (
                            <span key={index} className="rounded-full border border-supporting bg-accent px-3 py-1 text-sm text-foreground">{tag}</span>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No tags</p>
                    )}
                </div>
            </div>

            {/* Product Information */}
            <div className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-card-foreground">Product Information</h2>

                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Slug</p>
                        <p className="mt-1 break-all font-mono text-sm font-medium text-foreground">{product.slug || "N/A"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Featured</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{product.featured ? "Yes" : "No"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className={`mt-1 text-sm font-medium ${product.isActive ? "text-success" : "text-error"}`}>
                            {product.isActive ? "Active" : "Inactive"}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetailsSections;