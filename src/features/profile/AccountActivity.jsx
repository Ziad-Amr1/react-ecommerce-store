import { CreditCard, Heart, MapPin, Package , ChevronLeft  } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
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
    to: "/profile/orders",
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
    to : null
  },
  {
    key: "payments",
    labelKey: "profile.activity.payments",
    icon: CreditCard,
    to : null
  },
];

export default function AccountActivity() {
  const { t } = useTranslation();
 return(
  <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl text-foreground">
          {t("profile.activity.title")}
        </CardTitle>
        <CardDescription>{t("profile.activity.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map(({ key, labelKey, icon: Icon, to }) => {
            const content = (
              <>
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <p className="truncate font-medium text-foreground">
                    {t(labelKey)}
                  </p>
                </div>

                {to ? (
                  <ChevronLeft
                    className="size-4 shrink-0 text-muted-foreground rtl:rotate-180"
                    aria-hidden="true"
                  />
                ) : (
                  <Badge variant="secondary" className="shrink-0">
                    {t("profile.activity.comingSoon")}
                  </Badge>
                )}
              </>
            );

            return to ? (
              <Link
                key={key}
                to={to}
                className="flex items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4 transition-colors hover:bg-muted"
              >
                {content}
              </Link>
            ) : (
              <div
                key={key}
                aria-disabled="true"
                className="flex items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4"
              >
                {content}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}