import { Package2 } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
// import ProductTagsInput from "./ProductTagsInput";

function ProductForm({ formData, errors, onChange }) {
    return (
        <div className="w-full flex-1 rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Package2 className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="font-display font-semibold text-card-foreground">Basic Information</h2>
                    <p className="text-sm text-muted-foreground">Update the main product details</p>
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" value={formData.name} onChange={onChange} placeholder="Enter product name" aria-invalid={!!errors.name} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea id="shortDescription" value={formData.shortDescription} onChange={onChange} placeholder="Enter a short description" rows={3} aria-invalid={!!errors.shortDescription} />
                    {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={onChange} placeholder="Enter product description" rows={6} aria-invalid={!!errors.description} />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" min="0" step="0.01" value={formData.price} onChange={onChange} placeholder="0.00" aria-invalid={!!errors.price} className="font-mono" />
                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="discountPrice">Discount Price</Label>
                    <Input id="discountPrice" type="number" min="0" step="0.01" value={formData.discountPrice} onChange={onChange} placeholder="0.00" aria-invalid={!!errors.discountPrice} className="font-mono" />
                    {errors.discountPrice && <p className="text-sm text-destructive">{errors.discountPrice}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" min="0" value={formData.stock} onChange={onChange} placeholder="0" aria-invalid={!!errors.stock} className="font-mono" />
                    {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" value={formData.sku} onChange={onChange} placeholder="e.g. PROD-12345" aria-invalid={!!errors.sku} className="font-mono" />
                    {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={formData.category} onChange={onChange} placeholder="Enter category" aria-invalid={!!errors.category} />
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" value={formData.brand} onChange={onChange} placeholder="Enter brand" aria-invalid={!!errors.brand} />
                    {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
                </div>

        
                {/* <ProductTagsInput tags={formData.tags} onChange={onTagsChange} /> */}
            </div>
        </div>
    );
}

export default ProductForm;