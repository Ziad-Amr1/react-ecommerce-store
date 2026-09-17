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

export default function DeleteUserDialog({
  userToDelete,
  deletingUserId,
  onClose,
  onDelete,
}) {
  const { t } = useTranslation();
  const isDeleting = deletingUserId === userToDelete?._id;

  return (
    <AlertDialog
      open={Boolean(userToDelete)}
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          onClose();
        }
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-error-bg text-error">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-display">
            {t("users.dialogs.deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("users.dialogs.deleteQuestion", {
              name: userToDelete?.username,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("users.dialogs.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t("users.dialogs.deleting") : t("users.dialogs.deleteUser")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}