import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ClearCartDialog({
  isOpen,
  setIsOpen,
  isClearing,
  onConfirm,
}) {
  const { t } = useTranslation();

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => !open && !isClearing && setIsOpen(false)}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-(--color-error-bg) text-(--color-error)">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>

          <AlertDialogTitle className="font-display">
            {t("cart.clearTitle", "Clear Cart")}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t(
              "cart.clearDescription",
              "Are you sure you want to remove all items from your cart?",
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClearing}>
            {t("cart.cancel", "Cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isClearing}
          >
            {isClearing
              ? t("cart.clearing", "Clearing...")
              : t("cart.clearConfirm", "Clear")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
