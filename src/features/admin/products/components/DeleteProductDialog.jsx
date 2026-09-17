import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteProductDialog({
  productToDelete,
  deletingProductId,
  onClose,
  onDelete,
}) {
  const { t } = useTranslation();
  const isDeleting = deletingProductId === productToDelete?._id;

  return (
    <AlertDialog
      open={!!productToDelete}
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">
            {t("products.deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("products.deleteDescription", {
              name: productToDelete?.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("products.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t("products.deleting") : t("products.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}