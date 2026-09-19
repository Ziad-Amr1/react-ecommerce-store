import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export default function AnonymousPrompt() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6 sm:p-10 text-center">
        <div className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-accent text-primary">
          <UserRound className="size-6 sm:size-7" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <CardTitle className="font-display text-lg sm:text-xl text-foreground">
            {t("profile.anonymous.title")}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {t("profile.anonymous.description")}
          </CardDescription>
        </div>

        <Button asChild className="w-full sm:w-auto">
          <Link to="/login" state={{ from: "/profile" }}>
            {t("profile.anonymous.signIn")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}