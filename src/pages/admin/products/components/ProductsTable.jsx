import { Eye, Pencil, Trash2, PackageOpen } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";

export default function ProductsTable({ products, isFetching, deletingProductId, navigate, setProductToDelete }) {
    return (
        <div className="relative overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Category</TableHead>
                        <TableHead className="text-center">Brand</TableHead>
                        <TableHead className="text-center">Price</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isFetching ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-muted" />
                                        <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="mx-auto h-4 w-24 animate-pulse rounded-md bg-muted" />
                                </TableCell>
                                <TableCell>
                                    <div className="mx-auto h-4 w-20 animate-pulse rounded-md bg-muted" />
                                </TableCell>
                                <TableCell>
                                    <div className="mx-auto h-4 w-16 animate-pulse rounded-md bg-muted" />
                                </TableCell>
                                <TableCell>
                                    <div className="mx-auto h-4 w-12 animate-pulse rounded-md bg-muted" />
                                </TableCell>
                                <TableCell>
                                    <div className="mx-auto h-8 w-24 animate-pulse rounded-md bg-muted" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                            {product.images?.length > 0 ? (
                                                <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No Image</div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-foreground">{product.name}</p>
                                            {product.tags?.length > 0 && <span className="text-xs text-muted-foreground">{product.tags[0]}</span>}
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="text-center text-muted-foreground">{product.category || "No Category"}</TableCell>
                                <TableCell className="text-center text-muted-foreground">{product.brand || "No Brand"}</TableCell>
                                <TableCell className="text-center font-mono font-medium text-foreground">${product.price}</TableCell>

                                <TableCell className="text-center">
                                    <span className={`font-mono font-medium ${product.stock > 20 ? "text-success" : product.stock > 5 ? "text-warning" : "text-error"}`}>
                                        {product.stock}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <div className="flex justify-center gap-4">
                                        <Button variant="outline" size="icon" className="cursor-pointer border-border bg-background text-foreground hover:bg-muted"
                                            onClick={() => navigate(`/admin/products/${product._id}`)}
                                            disabled={isFetching} aria-label="View product"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>

                                        <Button variant="outline" size="icon" className="cursor-pointer border-border bg-background text-foreground hover:bg-muted" disabled={isFetching}
                                            onClick={() => navigate(`/admin/products/${product._id}/edit`)} aria-label="Edit product"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button variant="destructive" size="icon"
                                            className="cursor-pointer" onClick={() => setProductToDelete(product)}
                                            disabled={deletingProductId === product._id || isFetching} aria-label="Delete product"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <div className="flex h-52 flex-col items-center justify-center gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                        <PackageOpen className="h-7 w-7 text-muted-foreground" />
                                    </div>

                                    <div className="text-center">
                                        <p className="font-medium text-foreground">No products found</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Try changing your search or filters.</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}