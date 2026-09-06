function ProductDetailsInfo({ product }) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="font-display text-2xl font-bold text-card-foreground">{product.name}</h2>

                    {product.shortDescription && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
                    )}
                </div>

                <div className="flex shrink-0 gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${product.isActive ? "bg-success-bg text-success" : "bg-error-bg text-error"}`}>
                        {product.isActive ? "Active" : "Inactive"}
                    </span>

                    {product.featured && (
                        <span className="rounded-full border border-supporting bg-accent px-3 py-1 text-xs font-medium text-foreground">Featured</span>
                    )}
                </div>
            </div>

            <div className="border-b border-border py-5">
                <p className="text-sm text-muted-foreground">Price</p>

                <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-3xl font-bold text-foreground">${product.discountPrice || product.price}</span>

                    {product.discountPrice && (
                        <>
                            <span className="font-mono text-base text-muted-foreground line-through">${product.price}</span>

                            <span className="rounded-md bg-success-bg px-2 py-1 font-mono text-xs font-semibold text-success">
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="grid gap-5 border-b border-border py-5 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-muted-foreground">Stock</p>

                    <p className={`mt-1 font-mono text-lg font-semibold ${product.stock > 20 ? "text-success" : product.stock > 5 ? "text-warning" : "text-error"}`}>
                        {product.stock} units
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="mt-1 break-all font-mono text-lg font-semibold text-foreground">{product.sku || "N/A"}</p>
                </div>
            </div>

            <div className="grid gap-5 pt-5 sm:grid-cols-3">
                <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="mt-1 font-semibold text-foreground">{product.category || "N/A"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Subcategory</p>
                    <p className="mt-1 font-semibold text-foreground">{product.subcategory || "N/A"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="mt-1 font-semibold text-foreground">{product.brand || "N/A"}</p>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsInfo;