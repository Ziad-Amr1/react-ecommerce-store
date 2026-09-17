import { CreditCard, Heart, MapPin, Package, ChevronLeft } from "lucide-react";
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
    to: null,
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
    to: null,
  },
  {
    key: "payments",
    labelKey: "profile.activity.payments",
    icon: CreditCard,
    to: null,
  },
];

export default function AccountActivity() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-4">
        <CardTitle className="font-display text-lg text-foreground sm:text-xl">
          {t("profile.activity.title")}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {t("profile.activity.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {sections.map(({ key, labelKey, icon: Icon, to }) => {
            const content = (
              <>
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary sm:size-10">
                    <Icon className="size-4 sm:size-5" aria-hidden="true" />
                  </div>

                  <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                    {t(labelKey)}
                  </p>
                </div>

                {to ? (
                  <ChevronLeft
                    className="size-4 shrink-0 text-muted-foreground rtl:rotate-180"
                    aria-hidden="true"
                  />
                ) : (
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[10px] sm:text-xs"
                  >
                    {t("profile.activity.comingSoon")}
                  </Badge>
                )}
              </>
            );

            return to ? (
              <Link
                key={key}
                to={to}
                className="flex min-w-0 items-center justify-between gap-3 rounded-xl border bg-muted/40 p-3.5 transition-colors hover:bg-muted sm:gap-4 sm:p-4"
              >
                {content}
              </Link>
            ) : (
              <div
                key={key}
                aria-disabled="true"
                className="flex min-w-0 items-center justify-between gap-3 rounded-xl border bg-muted/40 p-3.5 sm:gap-4 sm:p-4"
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