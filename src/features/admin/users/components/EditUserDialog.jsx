import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LoaderCircle, Save, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES } from "../constants";
import { changeUserRole } from "../users.service";

// Role is the only user attribute an admin may change through a documented
// admin endpoint (PATCH /auth/change-role). Profile fields (username, phone,
// avatar) are only editable by the user themselves via PATCH /users/{id}, so
// they are not exposed to the admin edit dialog.
export default function EditUserDialog({ user, isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [role, setRole] = useState(user?.role || "customer");
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return null;
  }

  const hasRoleChanged = role !== user.role;

  const handleClose = () => {
    if (!isSaving) {
      setRole(user.role || "customer");
      onClose();
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!hasRoleChanged || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await changeUserRole({ userId: user._id, role });
      toast.success(t("users.dialogs.roleUpdateSuccess"));
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t("users.dialogs.roleChangeFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[480px] overflow-hidden rounded-2xl border border-(--color-border) bg-card p-0 shadow-2xl">
        <DialogHeader className="border-b border-(--color-border) bg-muted/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="font-display text-xl font-semibold text-foreground">
                {t("users.dialogs.editTitle")}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                {t("users.dialogs.editDescription", { name: user.username })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 px-6 py-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="edit-role" className="text-sm font-medium text-foreground">
              {t("users.dialogs.role")}
            </Label>
            <Select value={role} onValueChange={setRole} disabled={isSaving}>
              <SelectTrigger id="edit-role" className="w-full">
                <SelectValue placeholder={t("users.dialogs.rolePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(`users.roles.${value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasRoleChanged && (
              <p className="text-xs text-muted-foreground">{t("users.dialogs.roleChangeHint")}</p>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {t("users.dialogs.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !hasRoleChanged}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="size-4" aria-hidden="true" />
              )}
              {isSaving ? t("users.dialogs.saving") : t("users.dialogs.saveRole")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}