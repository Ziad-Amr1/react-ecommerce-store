import { Card, CardContent } from "@/components/ui/card";
import { TriangleAlert, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

function StateCard({
  icon: Icon,
  iconWrapperClass,
  iconClass,
  title,
  hint,
  action,
}) {
  return (
    <Card>
      <CardContent className="flex min-h-68 flex-col items-center justify-center gap-3 text-center">
        <div
          className={`flex size-14 items-center justify-center rounded-full ${iconWrapperClass}`}
        >
          <Icon className={`size-7 ${iconClass}`} aria-hidden="true" />
        </div>

        <p className="font-semibold text-foreground">{title}</p>

        <p className="max-w-sm text-sm text-muted-foreground">{hint}</p>

        {action}
      </CardContent>
    </Card>
  );
}

export function EmptyState({ title, hint }) {
  const { t } = useTranslation();

  return (
    <StateCard
      icon={Inbox}
      iconWrapperClass="bg-muted"
      iconClass="text-muted-foreground"
      title={title ?? t("landing.featured.emptyTitle")}
      hint={hint ?? t("landing.featured.emptyHint")}
    />
  );
}

export function ErrorState({ title, hint, onRetry }) {
  const { t } = useTranslation();

  return (
    <StateCard
      icon={TriangleAlert}
      iconWrapperClass="bg-(--color-error-bg)"
      iconClass="text-(--color-error)"
      title={title ?? t("landing.featured.errorTitle")}
      hint={hint ?? t("landing.featured.errorHint")}
      action={
        onRetry ? (
          <Button variant="outline" onClick={onRetry} className="mt-1">
            {t("landing.featured.retry")}
          </Button>
        ) : null
      }
    />
  );
}
