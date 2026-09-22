import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  ArrowRight,
  Bell,
  CreditCard,
  Heart,
  MapPin,
  Package,
  ShoppingCart,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const activityItems = [
  {
    key: "orders",
    icon: Package,
    href: "/my-orders",
  },
  {
    key: "wishlist",
    icon: Heart,
    href: "/wishlist",
  },
  {
    key: "cart",
    icon: ShoppingCart,
    href: "/cart",
  },
  {
    key: "notifications",
    icon: Bell,
    href: "/notifications",
  },
  {
    key: "addresses",
    icon: MapPin,
    comingSoon: true,
  },
  {
    key: "payments",
    icon: CreditCard,
    comingSoon: true,
  },
];

export default function AccountActivity() {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle>{t("profile.activity.title")}</CardTitle>

        <p className="text-sm text-muted-foreground">
          {t("profile.activity.description")}
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {activityItems.map(({ key, icon: Icon, href, comingSoon }) => {
            if (comingSoon) {
              return (
                <div
                  key={key}
                  aria-disabled="true"
                  className={cn(
                    "flex items-start gap-4 rounded-xl border border-border/60 p-4 transition-colors",
                    "bg-background/60 opacity-70 cursor-not-allowed",
                  )}
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground/80">
                        {t(`profile.activity.${key}.title`)}
                      </p>

                      <Badge
                        variant="secondary"
                        className="text-[11px] font-medium"
                      >
                        {t("profile.activity.comingSoon")}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {t(`profile.activity.${key}.description`)}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={key}
                to={href}
                className={cn(
                  "group flex items-center gap-4 rounded-xl border border-border p-4 transition-all",
                  "bg-background hover:border-primary/40 hover:bg-accent/30",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground transition-colors group-hover:text-primary">
                    {t(`profile.activity.${key}.title`)}
                  </p>

                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {t(`profile.activity.${key}.description`)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center">
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
