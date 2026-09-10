import { useTranslation } from "react-i18next";

function ProductDetailsSections({ product }) { 
    const { t } = useTranslation();

    return ( 
        <> 
            {/* Description */} 
            <div className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm"> 
                <h2 className="font-display text-lg font-semibold text-card-foreground">{t("products.description")}</h2> 
 
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground"> 
                    {product.description || t("products.noDescription")} 
                </p> 
            </div> 
 
            {/* Tags */} 
            <div className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm"> 
                <h2 className="font-display text-lg font-semibold text-card-foreground">{t("products.tags")}</h2> 
 
                <div className="mt-3 flex flex-wrap gap-2"> 
                    {product.tags?.length > 0 ? ( 
                        product.tags.map((tag, index) => ( 
                            <span key={index} className="rounded-full border border-supporting bg-accent px-3 py-1 text-sm text-foreground">{tag}</span> 
                        )) 
                    ) : ( 
                        <p className="text-sm text-muted-foreground">{t("products.noTags")}</p> 
                    )} 
                </div> 
            </div> 
 
            {/* Product Information */} 
            <div className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm"> 
                <h2 className="font-display text-lg font-semibold text-card-foreground">{t("products.productInformation")}</h2> 
 
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"> 
                    <div> 
                        <p className="text-sm text-muted-foreground">{t("products.slug")}</p> 
                        <p className="mt-1 break-all font-mono text-sm font-medium text-foreground">{product.slug || t("products.notAvailable")}</p> 
                    </div> 
 
                    <div> 
                        <p className="text-sm text-muted-foreground">{t("products.featured")}</p> 
                        <p className="mt-1 text-sm font-medium text-foreground">{product.featured ? t("common.yes") : t("common.no")}</p> 
                    </div> 
 
                    <div> 
                        <p className="text-sm text-muted-foreground">{t("products.status")}</p> 
                        <p className={`mt-1 text-sm font-medium ${product.isActive ? "text-success" : "text-error"}`}> 
                            {product.isActive ? t("products.active") : t("products.inactive")} 
                        </p> 
                    </div> 
                </div> 
            </div> 
        </> 
    ); 
} 
 
export default ProductDetailsSections;