import { Mail, Phone, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { getUserIdentity } from "@/features/auth/utils/userIdentity";

export default function PersonalInformation() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const name = getUserIdentity(user);
  const email = user?.email?.trim();
  const username = user?.username?.trim();
  const phone = user?.phone?.trim();

  const rows = [
    { icon: User, label: t("profile.personal.fullName"), value: name },
    { icon: Mail, label: t("profile.personal.email"), value: email },
    { icon: User, label: t("profile.personal.username"), value: username },
    { icon: Phone, label: t("profile.personal.phone"), value: phone },
  ];

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
          {rows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-xl border bg-muted/40 p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 truncate font-medium text-foreground">
                  {value ? value : t("profile.personal.missing")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}