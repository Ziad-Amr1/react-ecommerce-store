import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function DeleteAccountDialog({ deleteAccount }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const CONFIRM_WORD = "DELETE";

  const handleOpenChange = (open) => {
    if (!isDeleting) {
      setIsOpen(open);
      if (!open) {
        setConfirmText("");
      }
    }
  };

  const handleDelete = async () => {
    if (confirmText.trim() !== CONFIRM_WORD) return;

    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success(t("profile.deleteAccount.success", { defaultValue: "Account deleted successfully." }));
      setIsOpen(false);
    } catch (error) {
      const msg = error.response?.data?.message || t("profile.deleteAccount.failed", { defaultValue: "Failed to delete account. Please try again." });
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1.5 cursor-pointer">
          <Trash2 className="size-4" aria-hidden="true" />
          {t("profile.deleteAccount.button", { defaultValue: "Delete Account" })}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-(--color-error-bg) text-(--color-error)">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center font-display text-lg text-foreground">
            {t("profile.deleteAccount.dialogTitle", { defaultValue: "Delete Account" })}
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm text-muted-foreground">
            {t("profile.deleteAccount.dialogDescription", {
              defaultValue:
                "This action is permanent and cannot be undone. Your user account will be removed, but past fulfillment and order history records will be retained for business & compliance requirements.",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-xs font-medium text-foreground">
            {t("profile.deleteAccount.confirmPrompt", {
              defaultValue: "To confirm, type \"DELETE\" in the box below:",
            })}
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="h-9 text-xs font-mono"
            disabled={isDeleting}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
            size="sm"
          >
            {t("common.cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText.trim() !== CONFIRM_WORD || isDeleting}
            size="sm"
            className="gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {t("profile.deleteAccount.deleting", { defaultValue: "Deleting..." })}
              </>
            ) : (
              t("profile.deleteAccount.confirmButton", { defaultValue: "Permanently Delete" })
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
