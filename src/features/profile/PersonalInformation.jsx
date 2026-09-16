import {useState } from "react";
import {
  Copy,
  Mail,
  Phone,
  User,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  

const handleSave = async () => {
const errors = validateProfile(formData , t);

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

  const handleCancel = () => {
    setFormData({
      username: user?.username ?? "",
      phone: user?.phone ?? "",
      avatar: user?.avatar ?? "",
    });

    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="font-display text-xl text-foreground">
              {t("profile.personal.title")}
            </CardTitle>

            <CardDescription>
              {t("profile.personal.description")}
            </CardDescription>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="size-4" />
             {t("profile.edit.edit")}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="size-4" />
                {isSaving ? t("profile.edit.saving") : t("profile.edit.save")}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <X className="size-4" />
               {t("profile.edit.cancel")}
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map(({ key, icon: Icon, label, value }) => (
            <div
              key={key}
              className="group flex items-center gap-4 rounded-xl border bg-muted/40 p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">
                  {label}
                </p>

                {isEditing && key === "username" ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        username: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  />
                ) : isEditing && key === "phone" ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCopy(value, key)}
                    disabled={!value}
                    className="mt-1 flex w-full items-center gap-1.5 text-start font-medium text-foreground hover:text-primary disabled:cursor-default disabled:hover:text-foreground"
                    aria-label={t("profile.personal.copyValue", {
                      value:
                        value ?? t("profile.personal.missing"),
                    })}
                  >
                    <span className="truncate">
                      {value
                        ? value
                        : t("profile.personal.missing")}
                    </span>

                    {value && (
                      <Copy
                        className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isEditing && (
            <div className="rounded-xl border bg-muted/40 p-4 sm:col-span-2">
              <p className="text-sm text-muted-foreground">
                Avatar URL
              </p>

              <input
                type="url"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    avatar: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}