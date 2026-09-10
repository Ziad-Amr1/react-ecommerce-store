import { useTranslation } from "react-i18next";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "../../../../components/ui/alert-dialog";

export default function DeleteProductDialog({ productToDelete, deletingProductId, setProductToDelete, handleDelete }) {
    const isDeleting = deletingProductId === productToDelete?._id;
    const { t } = useTranslation();

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
                    <AlertDialogTitle className="font-display text-card-foreground">{t("products.deleteProduct")}</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        {t("products.deleteConfirmation", {name: productToDelete?.name})} 
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer border-border bg-background text-foreground hover:bg-muted" disabled={isDeleting}>{t("common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(productToDelete._id)} disabled={isDeleting}>
                        {isDeleting ? t("common.deleting") : t("common.delete")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}