import { Copy, Mail, Phone, User } from "lucide-react";
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

export default function PersonalInformation({ user }) {
  const { t } = useTranslation();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl text-foreground">
          {t("profile.personal.title")}
        </CardTitle>

        <CardDescription>{t("profile.personal.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map(({ key, icon: Icon, label, value }) => (
            <div
              key={key}
              className="group flex items-center gap-4 rounded-xl border bg-muted/40 p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">{label}</p>

                <button
                  type="button"
                  onClick={() => handleCopy(value, key)}
                  disabled={!value}
                  className="mt-1 flex w-full items-center gap-1.5 text-start font-medium text-foreground hover:text-primary disabled:cursor-default disabled:hover:text-foreground"
                  aria-label={t("profile.personal.copyValue", {
                    value: value ?? t("profile.personal.missing"),
                  })}
                >
                  <span className="truncate">
                    {value ? value : t("profile.personal.missing")}
                  </span>

                  {value && (
                    <Copy
                      className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
