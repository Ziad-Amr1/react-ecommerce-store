import { CreditCard, Heart, MapPin, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sections = [
  {
    key: "orders",
    labelKey: "profile.activity.orders",
    icon: Package,
  },
  {
    key: "wishlist",
    labelKey: "profile.activity.wishlist",
    icon: Heart,
  },
  {
    key: "addresses",
    labelKey: "profile.activity.addresses",
    icon: MapPin,
  },
  {
    key: "payments",
    labelKey: "profile.activity.payments",
    icon: CreditCard,
  },
];

export default function AccountActivity() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl text-foreground">
          {t("profile.activity.title")}
        </CardTitle>
        <CardDescription>
          {t("profile.activity.description")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map(({ key, labelKey, icon: Icon }) => (
            <div
              key={key}
              aria-disabled="true"
              className="flex items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>

                <p className="truncate font-medium text-foreground">
                  {t(labelKey)}
                </p>
              </div>

              <Badge variant="secondary" className="shrink-0">
                {t("profile.activity.comingSoon")}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}