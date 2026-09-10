import React from "react";
import { useForm, useWatch} from "react-hook-form";
import { toast } from "sonner";
import { ShieldPlus, Trash2, User, Mail, Lock, IdCard, X, Check } from "lucide-react";
import api from "@/api/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* Shared Styles */
const inputClassName = "h-11 rounded-lg border border-[var(--color-supporting)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] shadow-sm transition-all hover:border-[var(--color-supporting-decorative)] focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-secondary)] disabled:opacity-50";
const cancelButtonClassName = "border-[var(--color-supporting-decorative)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] transition-colors";
const primaryButtonClassName = "bg-[var(--color-primary)] text-[var(--color-surface)] hover:bg-[var(--color-secondary)] transition-colors";
const errorMessageClassName = "mt-1 flex items-center gap-1 text-sm text-[var(--color-error)]";
const successMessageClassName = "mt-1 flex items-center gap-1 text-sm text-[var(--color-success)]";

/* Toast Helpers */
const showSuccessToast = (message) => {
  toast.success(message, {
    style: {
      background: "var(--color-success-bg)",
      color: "var(--color-success)",
      border: "1px solid var(--color-success)",
    },
  });
};

const showErrorToast = (message) => {
  toast.error(message, {
    style: {
      background: "var(--color-error-bg)",
      color: "var(--color-error)",
      border: "1px solid var(--color-error)",
    },
  });
};

/* Add Admin Dialog */
export function AddAdminDialog({ isOpen, onClose, onSuccess }) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm({ mode: "onChange" });
  const usernameValue = useWatch({ control, name: "username",});
  const emailValue = useWatch({ control, name: "email",});
  const passwordValue = useWatch({ control, name:"password",});
  const isUsernameValid = Boolean(usernameValue?.trim()) && !errors.username;
  const isEmailValid = Boolean(emailValue) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) && !errors.email;
  const isPasswordValid = Boolean(passwordValue) && passwordValue.length >= 6 && !errors.password;

  const onSubmit = async (data) => {
    try {
      await api.post("/users/add", { ...data, role: "admin" });
      showSuccessToast("Admin has been added successfully");
      reset();
      onSuccess();
      onClose();
    } catch(error){
      showErrorToast(error.response?.data?.message || "Failed to add admin");
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
      <DialogContent className="w-[calc(100%-2rem)] max-w-[480px] overflow-hidden rounded-2xl border border-[var(--color-supporting)] bg-[var(--color-surface)] p-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="border-b border-[var(--color-supporting)] bg-[var(--color-surface-muted)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-[var(--color-surface)]">
              <ShieldPlus size={22} />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl font-semibold text-[var(--color-text-primary)]">Add New Admin</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-[var(--color-text-secondary)]">Create a new administrator account.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-6" noValidate>
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-[var(--color-text-primary)]">Username</Label>
            <div className="relative">
              <User size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <Input id="username" type="text" placeholder="Enter username" autoComplete="username" disabled={isSubmitting} aria-invalid={errors.username ? "true" : "false"}
                aria-describedby={errors.username ? "username-error" : isUsernameValid ? "username-success" : undefined}
                className={`${inputClassName} pl-10 ${
                  errors.username
                    ? "border-[var(--color-error)] focus-visible:border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
                    : isUsernameValid
                    ? "border-[var(--color-success)] focus-visible:border-[var(--color-success)] focus-visible:ring-[var(--color-success)]"
                    : ""
                }`}
                {...register("username", { required: "Username is required" })}
              />
            </div>
            {errors.username && (<p id="username-error" className={errorMessageClassName} role="alert">{errors.username.message}</p>)}
            {isUsernameValid && (<p id="username-success" className={successMessageClassName}><Check size={14} /> Username is valid.</p>)}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)]">Email</Label>
            <div className="relative">
              <Mail size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <Input id="email" type="email" placeholder="admin@example.com" autoComplete="email" disabled={isSubmitting} aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : isEmailValid ? "email-success" : undefined}
                className={`${inputClassName} pl-10 ${
                  errors.email
                    ? "border-[var(--color-error)] focus-visible:border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
                    : isEmailValid
                    ? "border-[var(--color-success)] focus-visible:border-[var(--color-success)] focus-visible:ring-[var(--color-success)]"
                    : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                })}
              />
            </div>
            {errors.email && (<p id="email-error" className={errorMessageClassName} role="alert">{errors.email.message}</p>)}
            {isEmailValid && (<p id="email-success" className={successMessageClassName}><Check size={14} /> Email is valid.</p>)}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[var(--color-text-primary)]">Password</Label>
            <div className="relative">
              <Lock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <Input id="password" type="password" placeholder="Enter password" autoComplete="new-password" disabled={isSubmitting} aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : isPasswordValid ? "password-success" : undefined}
                className={`${inputClassName} pl-10 ${
                  errors.password
                    ? "border-[var(--color-error)] focus-visible:border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
                    : isPasswordValid
                    ? "border-[var(--color-success)] focus-visible:border-[var(--color-success)] focus-visible:ring-[var(--color-success)]"
                    : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
            </div>
            {errors.password && (<p id="password-error" className={errorMessageClassName} role="alert">{errors.password.message}</p>)}
            {isPasswordValid && (<p id="password-success" className={successMessageClassName}><Check size={14} /> Password is valid.</p>)}
          </div>

          {/* Footer */}
          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className={`${cancelButtonClassName} w-full sm:w-auto`}>
              <X size={17} /> Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className={`${primaryButtonClassName} w-full sm:w-auto`}>
              <ShieldPlus size={17} /> {isSubmitting ? "Adding..." : "Save Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* Delete Confirmation Dialog */
export function DeleteConfirmDialog({ isOpen, onClose, user, onSuccess }){
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!user || isDeleting) return;
    setIsDeleting(true);

    try {
      await api.delete(`/users/${user._id}`);
      showSuccessToast("User deleted successfully");
      onSuccess();
      onClose();
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return(
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[440px] overflow-hidden rounded-2xl border border-[var(--color-supporting)] bg-[var(--color-surface)] p-0 shadow-2xl">
        <DialogHeader className="border-b border-[var(--color-supporting)] bg-[var(--color-error-bg)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-error)] text-[var(--color-surface)]">
              <Trash2 size={21} />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl font-semibold text-[var(--color-text-primary)]">Confirm Delete</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-[var(--color-text-secondary)]">This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-6">
          <div className="rounded-xl border border-[var(--color-supporting)] bg-[var(--color-surface-secondary)] p-4">
            <p className="text-sm leading-6 text-[var(--color-text-secondary)]">Are you sure you want to delete this user?</p>
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-[var(--color-supporting-decorative)] bg-[var(--color-surface)] px-3 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] text-[var(--color-on-accent)]">
                <User size={18} />
              </div>
              <span className="min-w-0 truncate font-semibold text-[var(--color-text-primary)]">
                {user?.name || user?.username}
              </span>
            </div>
          </div>

          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting} className={`${cancelButtonClassName} w-full sm:w-auto`}>
              <X size={17} /> Cancel
            </Button>
            <Button type="button" onClick={handleDelete} disabled={isDeleting} className="w-full bg-[var(--color-error)] text-[var(--color-surface)] transition-colors hover:opacity-90 sm:w-auto">
              <Trash2 size={17} /> {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* User Details Dialog */
export function UserDetailsDialog({ isOpen, onClose, user }){
  if (!user) return null;
  const isAdmin = user.role === "admin";

  return(
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[480px] overflow-hidden rounded-2xl border border-[var(--color-supporting)] bg-[var(--color-surface)] p-0 shadow-2xl">
        <DialogHeader className="border-b border-[var(--color-supporting)] bg-[var(--color-accent)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-[var(--color-surface)]">
              <User size={21} />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl font-semibold text-[var(--color-text-primary)]">User Details</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-[var(--color-text-secondary)]">View information about this account.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 px-6 py-6">
          {/* ID */}
          <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-supporting)] bg-[var(--color-surface-secondary)] p-4 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-2">
              <IdCard size={16} className="text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">ID:</span>
            </div>
            <span className="min-w-0 break-all font-mono text-sm text-[var(--color-text-primary)]">{user._id}</span>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-supporting)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-2">
              <User size={17} className="text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Name:</span>
            </div>
            <span className="min-w-0 break-all text-sm font-semibold text-[var(--color-text-primary)]">{user.name || user.username}</span>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-supporting)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-2">
              <Mail size={17} className="text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Email:</span>
            </div>
            <span className="min-w-0 break-all text-sm font-semibold text-[var(--color-text-primary)]">{user.email}</span>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-supporting)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Role:</span>
            <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              isAdmin
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-surface)]"
                : "border-[var(--color-supporting-decorative)] bg-[var(--color-accent)] text-[var(--color-on-accent)]"
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        <DialogFooter className="border-t border-[var(--color-supporting)] bg-[var(--color-surface-secondary)] px-6 py-4">
          <Button variant="outline" onClick={onClose} className={`${cancelButtonClassName} w-full sm:w-auto`}>
            <X size={17} /> Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 