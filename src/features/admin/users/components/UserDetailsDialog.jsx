import { useTranslation } from "react-i18next";
import { IdCard, Mail, UserRound, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UserDetailsDialog({ user, isOpen, onClose }) {
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "admin";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[480px] overflow-hidden rounded-2xl border border-(--color-border) bg-card p-0 shadow-2xl">
        <DialogHeader className="border-b border-(--color-border) bg-accent px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UserRound className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="font-display text-xl font-semibold text-foreground">
                {t("users.dialogs.detailsTitle")}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                {t("users.dialogs.detailsDescription")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 px-6 py-6">
          {/* ID */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/50 p-4 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-2">
              <IdCard className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("users.dialogs.detailsId")}
              </span>
            </div>
            <span className="min-w-0 break-all font-mono text-sm text-foreground">
              {user._id}
            </span>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-2">
              <UserRound className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("users.dialogs.detailsName")}
              </span>
            </div>
            <span className="min-w-0 break-all text-sm font-semibold text-foreground">
              {user.name || user.username}
            </span>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-2">
              <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("users.dialogs.detailsEmail")}
              </span>
            </div>
            <span className="min-w-0 break-all text-sm font-semibold text-foreground">
              {user.email}
            </span>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <span className="text-sm font-medium text-muted-foreground">
              {t("users.dialogs.detailsRole")}
            </span>
            <span
              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                isAdmin
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-transparent bg-secondary text-secondary-foreground"
              }`}
            >
              {t(`users.roles.${user.role}`, { defaultValue: user.role })}
            </span>
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-muted/50 px-6 py-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="size-4" aria-hidden="true" /> {t("users.dialogs.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}