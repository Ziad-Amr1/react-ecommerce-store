import { useTranslation } from "react-i18next";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";

function AddProductForm({ formData, errors, isSubmitting, onChange, onCancel }) {
    const { t } = useTranslation();

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 font-display text-lg font-semibold text-card-foreground">{t("products.productInformation")}</h2>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">{t("products.productName")}</Label>
                    <Input id="name" type="text" placeholder={t("products.productNamePlaceholder")} value={formData.name} onChange={onChange} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shortDescription">{t("products.shortDescription")}</Label>
                    <Input id="shortDescription" type="text" placeholder={t("products.shortDescriptionPlaceholder")} value={formData.shortDescription} onChange={onChange} />
                    {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">{t("products.description")}</Label>
                    <Textarea id="description" placeholder={t("products.descriptionPlaceholder")} className="min-h-35 resize-none" value={formData.description} onChange={onChange} />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="price">{t("products.price")}</Label>
                        <Input id="price" type="number" min="0" placeholder={t("products.pricePlaceholder")} value={formData.price} onChange={onChange} className="font-mono" />
                        {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="discountPrice">{t("products.discountPrice")}</Label>
                        <Input id="discountPrice" type="number" min="0" placeholder={t("products.discountPricePlaceholder")} value={formData.discountPrice} onChange={onChange} className="font-mono" />
                        {errors.discountPrice && <p className="text-sm text-destructive">{errors.discountPrice}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stock">{t("products.stock")}</Label>
                        <Input id="stock" type="number" min="0" placeholder={t("products.stockPlaceholder")} value={formData.stock} onChange={onChange} className="font-mono" />
                        {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sku">{t("products.sku")}</Label>
                        <Input id="sku" type="text" placeholder={t("products.skuPlaceholder")} value={formData.sku} onChange={onChange} />
                        {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category">{t("products.category")}</Label>
                            <Input id="category" type="text" placeholder={t("products.categoryPlaceholder")} value={formData.category} onChange={onChange} />
                            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brand">{t("products.brand")}</Label>
                            <Input id="brand" type="text" placeholder={t("products.brandPlaceholder")} value={formData.brand} onChange={onChange} />
                            {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 md:col-span-2">
                        <button type="button" onClick={onCancel} className="cursor-pointer rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                            {t("products.cancel")}
                        </button>

                        <button type="submit" disabled={isSubmitting} className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                            {isSubmitting ? t("products.creating") : t("products.createProduct")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProductForm;