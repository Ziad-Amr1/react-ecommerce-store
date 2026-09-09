import { Card, CardContent } from "@/components/ui/card";
import { TriangleAlert, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, hint }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="flex min-h-68 flex-col items-center justify-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <Inbox className="size-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="font-semibold text-foreground">{title ?? t("landing.featured.emptyTitle")}</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {hint ?? t("landing.featured.emptyHint")}
        </p>
      </CardContent>
    </Card>
  );
}

export function ErrorState({ title, hint, onRetry }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="flex min-h-68 flex-col items-center justify-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-error-bg">
          <TriangleAlert className="size-7 text-error" aria-hidden="true" />
        </div>
        <p className="font-semibold text-foreground">
          {title ?? t("landing.featured.errorTitle")}
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {hint ?? t("landing.featured.errorHint")}
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-1">
            {t("landing.featured.retry")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}