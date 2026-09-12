import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Check, Lock, Mail, ShieldPlus, UserRound, X } from "lucide-react";
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
import { createUser } from "../users.service";

const inputClassName =
  "h-11 rounded-lg border border-(--color-border) bg-card text-(--color-text-primary) placeholder:text-muted-foreground shadow-sm transition-all hover:border-(--color-border) focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50";
const errorMessageClassName = "mt-1 flex items-center gap-1 text-sm text-error";
const successMessageClassName = "mt-1 flex items-center gap-1 text-sm text-success";

export default function AddAdminDialog({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const usernameValue = useWatch({ control, name: "username" });
  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });

  const isUsernameValid = Boolean(usernameValue?.trim()) && !errors.username;
  const isEmailValid =
    Boolean(emailValue) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) && !errors.email;
  const isPasswordValid =
    Boolean(passwordValue) && passwordValue.length >= 6 && !errors.password;

  const onSubmit = async (data) => {
    try {
      await createUser({ ...data, role: "admin" });
      toast.success(t("users.dialogs.addSuccess"));
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t("users.dialogs.addFailed"));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[480px] overflow-hidden rounded-2xl border border-(--color-border) bg-card p-0 shadow-2xl">
        <DialogHeader className="border-b border-(--color-border) bg-muted/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldPlus className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="font-display text-xl font-semibold text-foreground">
                {t("users.dialogs.addTitle")}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                {t("users.dialogs.addDescription")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-6" noValidate>
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">
              {t("users.dialogs.username")}
            </Label>
            <div className="relative">
              <UserRound
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="username"
                type="text"
                placeholder={t("users.dialogs.usernamePlaceholder")}
                autoComplete="username"
                disabled={isSubmitting}
                aria-invalid={errors.username ? "true" : "false"}
                aria-describedby={
                  errors.username ? "username-error" : isUsernameValid ? "username-success" : undefined
                }
                className={`${inputClassName} pl-10 ${
                  errors.username
                    ? "border-error focus-visible:border-error focus-visible:ring-error"
                    : isUsernameValid
                      ? "border-success focus-visible:border-success focus-visible:ring-success"
                      : ""
                }`}
                {...register("username", { required: t("users.dialogs.usernameRequired") })}
              />
            </div>
            {errors.username && (
              <p id="username-error" className={errorMessageClassName} role="alert">
                {errors.username.message}
              </p>
            )}
            {isUsernameValid && (
              <p id="username-success" className={successMessageClassName}>
                <Check className="size-3.5" aria-hidden="true" /> {t("users.dialogs.usernameValid")}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              {t("users.dialogs.email")}
            </Label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="email"
                type="email"
                placeholder={t("users.dialogs.emailPlaceholder")}
                autoComplete="email"
                disabled={isSubmitting}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={
                  errors.email ? "email-error" : isEmailValid ? "email-success" : undefined
                }
                className={`${inputClassName} pl-10 ${
                  errors.email
                    ? "border-error focus-visible:border-error focus-visible:ring-error"
                    : isEmailValid
                      ? "border-success focus-visible:border-success focus-visible:ring-success"
                      : ""
                }`}
                {...register("email", {
                  required: t("users.dialogs.emailRequired"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("users.dialogs.emailInvalid"),
                  },
                })}
              />
            </div>
            {errors.email && (
              <p id="email-error" className={errorMessageClassName} role="alert">
                {errors.email.message}
              </p>
            )}
            {isEmailValid && (
              <p id="email-success" className={successMessageClassName}>
                <Check className="size-3.5" aria-hidden="true" /> {t("users.dialogs.emailValid")}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              {t("users.dialogs.password")}
            </Label>
            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="password"
                type="password"
                placeholder={t("users.dialogs.passwordPlaceholder")}
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : isPasswordValid ? "password-success" : undefined
                }
                className={`${inputClassName} pl-10 ${
                  errors.password
                    ? "border-error focus-visible:border-error focus-visible:ring-error"
                    : isPasswordValid
                      ? "border-success focus-visible:border-success focus-visible:ring-success"
                      : ""
                }`}
                {...register("password", {
                  required: t("users.dialogs.passwordRequired"),
                  minLength: { value: 6, message: t("users.dialogs.passwordMinLength") },
                })}
              />
            </div>
            {errors.password && (
              <p id="password-error" className={errorMessageClassName} role="alert">
                {errors.password.message}
              </p>
            )}
            {isPasswordValid && (
              <p id="password-success" className={successMessageClassName}>
                <Check className="size-3.5" aria-hidden="true" /> {t("users.dialogs.passwordValid")}
              </p>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <X className="size-4" aria-hidden="true" /> {t("users.dialogs.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              <ShieldPlus className="size-4" aria-hidden="true" />
              {isSubmitting ? t("users.dialogs.adding") : t("users.dialogs.saveAdmin")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}