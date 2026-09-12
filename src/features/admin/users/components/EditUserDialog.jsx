import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LoaderCircle, Mail, Phone, Save, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHONE_PATTERN, USER_ROLES } from "../constants";
import { changeUserRole, updateUserProfile } from "../users.service";

const inputClassName =
  "h-11 rounded-lg border border-(--color-border) bg-card text-(--color-text-primary) placeholder:text-muted-foreground shadow-sm transition-all hover:border-(--color-border) focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50";
const errorMessageClassName = "mt-1 flex items-center gap-1 text-sm text-error";

export default function EditUserDialog({ user, isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      phone: user?.phone || "",
    },
  });

  const [role, setRole] = useState(user?.role || "customer");
  const [isBusy, setIsBusy] = useState(false);

  if (!user) {
    return null;
  }

  const onSubmit = async ({ username, phone }) => {
    if (isBusy) {
      return;
    }

    setIsBusy(true);

    const payload = {
      username: username.trim(),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
    };

    try {
      await updateUserProfile(user._id, payload);

      if (role !== user.role) {
        try {
          await changeUserRole({ userId: user._id, role });
        } catch (error) {
          toast.error(
            error.response?.data?.message || t("users.dialogs.roleChangeFailed"),
          );
          toast.success(t("users.dialogs.updateSuccess"));
          onSuccess();
          onClose();
          return;
        }
      }

      toast.success(t("users.dialogs.updateSuccess"));
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t("users.dialogs.updateFailed"));
    } finally {
      setIsBusy(false);
    }
  };

  const handleClose = () => {
    if (!isBusy && !isSubmitting) {
      reset({
        username: user.username || "",
        phone: user.phone || "",
      });
      setRole(user.role || "customer");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[480px] overflow-hidden rounded-2xl border border-(--color-border) bg-card p-0 shadow-2xl">
        <DialogHeader className="border-b border-(--color-border) bg-muted/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UserRound className="size-5" aria-hidden="true" />
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-6" noValidate>
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="edit-username" className="text-sm font-medium text-foreground">
              {t("users.dialogs.username")}
            </Label>
            <div className="relative">
              <UserRound
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="edit-username"
                type="text"
                placeholder={t("users.dialogs.usernamePlaceholder")}
                autoComplete="username"
                disabled={isBusy}
                aria-invalid={errors.username ? "true" : "false"}
                aria-describedby={errors.username ? "edit-username-error" : undefined}
                className={`${inputClassName} pl-10 ${
                  errors.username
                    ? "border-error focus-visible:border-error focus-visible:ring-error"
                    : ""
                }`}
                {...register("username", {
                  required: t("users.dialogs.usernameRequired"),
                })}
              />
            </div>
            {errors.username && (
              <p id="edit-username-error" className={errorMessageClassName} role="alert">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Phone (optional) */}
          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-sm font-medium text-foreground">
              {t("users.dialogs.phone")}
            </Label>
            <div className="relative">
              <Phone
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="edit-phone"
                type="tel"
                placeholder={t("users.dialogs.phonePlaceholder")}
                autoComplete="tel"
                disabled={isBusy}
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "edit-phone-error" : undefined}
                className={`${inputClassName} pl-10 ${
                  errors.phone ? "border-error focus-visible:border-error focus-visible:ring-error" : ""
                }`}
                {...register("phone", {
                  pattern: {
                    value: PHONE_PATTERN,
                    message: t("users.dialogs.phoneInvalid"),
                  },
                })}
              />
            </div>
            {errors.phone && (
              <p id="edit-phone-error" className={errorMessageClassName} role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email — read-only per the API */}
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-sm font-medium text-foreground">
              {t("users.dialogs.email")}
            </Label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="edit-email"
                type="email"
                value={user.email || ""}
                disabled
                aria-describedby="edit-email-hint"
                className={`${inputClassName} pl-10`}
              />
            </div>
            <p id="edit-email-hint" className="text-xs text-muted-foreground">
              {t("users.dialogs.emailReadOnly")}
            </p>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="edit-role" className="text-sm font-medium text-foreground">
              {t("users.dialogs.role")}
            </Label>
            <Select value={role} onValueChange={setRole} disabled={isBusy}>
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
            {role !== user.role && (
              <p className="text-xs text-muted-foreground">{t("users.dialogs.roleChangeHint")}</p>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isBusy}
              className="w-full sm:w-auto"
            >
              {t("users.dialogs.cancel")}
            </Button>
            <Button type="submit" disabled={isBusy} className="w-full sm:w-auto">
              {isBusy ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="size-4" aria-hidden="true" />
              )}
              {isBusy ? t("users.dialogs.saving") : t("users.dialogs.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}