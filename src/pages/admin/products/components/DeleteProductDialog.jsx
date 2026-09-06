import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "../../../../components/ui/alert-dialog";

export default function DeleteProductDialog({ productToDelete, deletingProductId, setProductToDelete, handleDelete }) {
    const isDeleting = deletingProductId === productToDelete?._id;

    return (
        <AlertDialog
            open={!!productToDelete}
            onOpenChange={(open) => {
                if (!open && !isDeleting) {
                    setProductToDelete(null);
                }
            }}
        >
            <AlertDialogContent className="border-border bg-card shadow-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-card-foreground">Delete Product</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        Are you sure you want to delete <span className="font-medium text-foreground">{productToDelete?.name}</span>? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer border-border bg-background text-foreground hover:bg-muted" disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(productToDelete._id)} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}