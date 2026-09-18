import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorState({ onRetry }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6 sm:p-10 text-center">
        <div className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-(--color-error-bg) text-(--color-error)">
          <TriangleAlert className="size-6 sm:size-7" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">
            {t("profile.error.title")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("profile.error.description")}
          </p>
        </div>
        <Button variant="outline" onClick={onRetry} className="w-full sm:w-auto">
          {t("profile.error.retry")}
        </Button>
      </CardContent>
    </Card>
  );
}
