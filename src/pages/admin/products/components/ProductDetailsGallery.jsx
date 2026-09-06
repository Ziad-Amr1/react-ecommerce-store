function ProductDetailsGallery({ product, selectedImage, onSelectImage }) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="overflow-hidden rounded-lg">
                {product.images?.length > 0 ? (
                    <div className="aspect-square w-full overflow-hidden rounded-lg">
                        <img src={product.images[selectedImage]?.url} alt={product.name} 
                            className="h-full w-full object-contain transition-opacity duration-500" 
                        />
                    </div> 
                ) : ( 
                    <div className="flex h-100 items-center justify-center">
                        <span className="text-sm text-muted-foreground">No Image Available</span>
                    </div>
                )}
            </div>

            {product.images?.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                        <button key={image.public_id || index} type="button" onClick={() => onSelectImage(index)}
                            className={`h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 ${selectedImage === index ? "border-primary" : "border-border"}`}
                        >
                            <img src={image.url} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductDetailsGallery;