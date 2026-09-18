import { useState } from "react";
import { Copy, Mail, Pencil, Phone, Save, User, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserIdentity } from "@/features/auth/utils/userIdentity";
import { validateProfile } from "@/features/profile/utils/profileValidation";

export default function PersonalInformation({ user, updateUser }) {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username ?? "",
    phone: user?.phone ?? "",
    avatar: user?.avatar ?? "",
  });

  const name = getUserIdentity(user);
  const email = user?.email?.trim();
  const username = user?.username?.trim();
  const phone = user?.phone?.trim();

  const rows = [
    {
      key: "fullName",
      icon: User,
      label: t("profile.personal.fullName"),
      value: name,
    },
    {
      key: "email",
      icon: Mail,
      label: t("profile.personal.email"),
      value: email,
    },
    {
      key: "username",
      icon: User,
      label: t("profile.personal.username"),
      value: username,
    },
    {
      key: "phone",
      icon: Phone,
      label: t("profile.personal.phone"),
      value: phone,
    },
  ];

  const handleCopy = async (value, key) => {
    if (!value || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(value);

      toast.success(
        t("profile.personal.copied", {
          field: t(`profile.personal.${key}`),
        }),
      );
    } catch {
      toast.error(t("profile.personal.copyFailed"));
    }
  };

  const handleChange = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username ?? "",
      phone: user?.phone ?? "",
      avatar: user?.avatar ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    const errors = validateProfile(formData, t);

    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return;
    }

    setIsSaving(true);

    try {
      await updateUser({
        username: formData.username.trim(),
        phone: formData.phone.trim(),
        avatar: formData.avatar.trim(),
      });

      setIsEditing(false);
      toast.success(t("profile.edit.success"));
    } catch {
      toast.error(t("profile.edit.error"));
    } finally {
      setIsSaving(false);
    }
  };

  const renderValue = ({ key, value }) => {
    if (isEditing && (key === "username" || key === "phone")) {
      return (
        <Input
          type={key === "phone" ? "tel" : "text"}
          value={formData[key]}
          onChange={(event) => handleChange(key, event.target.value)}
          className="mt-0.5 h-8 text-xs sm:text-sm"
          aria-label={t(`profile.personal.${key}`)}
        />
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleCopy(value, key)}
        disabled={!value}
        className="mt-0.5 flex w-full items-center gap-1.5 text-start text-xs sm:text-sm font-medium text-foreground hover:text-primary disabled:cursor-default disabled:hover:text-foreground"
        aria-label={t("profile.personal.copyValue", {
          value: value ?? t("profile.personal.missing"),
        })}
      >
        <span className="truncate min-w-0 flex-1">
          {value ? value : t("profile.personal.missing")}
        </span>

        {value && (
          <Copy
            className="size-3.5 shrink-0 opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-60 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </button>
    );
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-display text-lg sm:text-xl text-foreground">
              {t("profile.personal.title")}
            </CardTitle>

            <CardDescription className="text-xs sm:text-sm">{t("profile.personal.description")}</CardDescription>
          </div>

          {isEditing ? (
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-1.5"
              >
                <Save className="size-4" aria-hidden="true" />
                {isSaving ? t("profile.edit.saving") : t("profile.edit.save")}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="gap-1.5"
              >
                <X className="size-4" aria-hidden="true" />
                {t("profile.edit.cancel")}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="shrink-0 gap-1.5"
            >
              <Pencil className="size-4" aria-hidden="true" />
              {t("profile.edit.edit")}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {rows.map(({ key, icon: Icon, label, value }) => (
            <div
              key={key}
              className="group flex items-center gap-3 sm:gap-4 rounded-xl border bg-muted/40 p-3.5 sm:p-4 min-w-0"
            >
              <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon className="size-4 sm:size-5" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>

                {renderValue({ key, value })}
              </div>
            </div>
          ))}

          {isEditing && (
            <div className="rounded-xl border bg-muted/40 p-3.5 sm:p-4 sm:col-span-2">
              <label
                htmlFor="profile-avatar"
                className="text-xs sm:text-sm text-muted-foreground"
              >
                {t("profile.personal.avatar")}
              </label>

              <Input
                id="profile-avatar"
                type="url"
                value={formData.avatar}
                onChange={(event) => handleChange("avatar", event.target.value)}
                className="mt-0.5 h-8 text-xs sm:text-sm"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
