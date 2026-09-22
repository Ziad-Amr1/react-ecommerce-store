import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  Copy,
  Edit3,
  Loader2,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getUserIdentity } from "@/features/auth/utils/userIdentity";
import { validateProfile } from "@/features/profile/utils/profileValidation";

export default function PersonalInformation({
  user,
  updateUser,
  isEditing: controlledIsEditing,
  onEditingChange,
}) {
  const { t } = useTranslation();

  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const isEditing =
    controlledIsEditing !== undefined ? controlledIsEditing : internalIsEditing;

  const setIsEditing = (value) => {
    if (onEditingChange) {
      onEditingChange(value);
    } else {
      setInternalIsEditing(value);
    }
  };

  const identity = getUserIdentity(user);

  const [formData, setFormData] = useState({
    username: user?.username ?? "",
    phone: user?.phone ?? "",
  });

  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setFormData({
        username: user.username ?? "",
        phone: user.phone ?? "",
      });
    }
  }

  const email = user?.email ?? "";

  const handleChange = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username ?? "",
      phone: user?.phone ?? "",
    });

    setIsEditing(false);
  };

  const handleSave = async () => {
    const validation = validateProfile({
      username: formData.username,
      phone: formData.phone,
    });

    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    try {
      setIsSaving(true);

      await updateUser({
        username: formData.username,
        phone: formData.phone,
      });

      toast.success(t("profile.personalInformation.saveSuccess"));
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.message || t("profile.personalInformation.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async (value, field) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      setCopiedField(field);

      window.setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    } catch {
      toast.error(t("profile.personalInformation.copyError"));
    }
  };

  const renderCopyButton = (value, field, label) => {
    if (!value) return null;

    const isCopied = copiedField === field;

    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        onClick={() => handleCopy(value, field)}
        aria-label={label}
      >
        {isCopied ? (
          <Check className="size-4 text-green-600" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle>{t("profile.personalInformation.title")}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("profile.personalInformation.description")}
            </p>
          </div>

          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="shrink-0"
            >
              <Edit3 className="me-2 size-4" />
              {t("profile.personalInformation.edit")}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="space-y-5">
          {/* Full name */}
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">
                {t("profile.personalInformation.fullName")}
              </p>

              <p className="mt-1 break-words font-medium">
                {identity || t("profile.personalInformation.notProvided")}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">
                {t("profile.personalInformation.email")}
              </p>

              <div className="mt-1 flex items-center gap-1">
                <p className="min-w-0 flex-1 break-all font-medium">
                  {email || t("profile.personalInformation.notProvided")}
                </p>

                {renderCopyButton(
                  email,
                  "email",
                  t("profile.personalInformation.copyEmail"),
                )}
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">
                {t("profile.personalInformation.username")}
              </p>

              {isEditing ? (
                <Input
                  value={formData.username}
                  onChange={handleChange("username")}
                  className="mt-2"
                  autoComplete="username"
                />
              ) : (
                <div className="mt-1 flex items-center gap-1">
                  <p className="min-w-0 flex-1 break-words font-medium">
                    {formData.username ||
                      t("profile.personalInformation.notProvided")}
                  </p>

                  {renderCopyButton(
                    formData.username,
                    "username",
                    t("profile.personalInformation.copyUsername"),
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Phone className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">
                {t("profile.personalInformation.phone")}
              </p>

              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  className="mt-2"
                  type="tel"
                  autoComplete="tel"
                />
              ) : (
                <div className="mt-1 flex items-center gap-1">
                  <p className="min-w-0 flex-1 break-words font-medium">
                    {formData.phone ||
                      t("profile.personalInformation.notProvided")}
                  </p>

                  {renderCopyButton(
                    formData.phone,
                    "phone",
                    t("profile.personalInformation.copyPhone"),
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {isEditing && (
            <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="me-2 size-4" />
                {t("profile.personalInformation.cancel")}
              </Button>

              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="me-2 size-4 animate-spin" />
                ) : (
                  <Check className="me-2 size-4" />
                )}

                {isSaving
                  ? t("profile.personalInformation.saving")
                  : t("profile.personalInformation.save")}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
