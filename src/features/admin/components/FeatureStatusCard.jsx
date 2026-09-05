import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminFeatures } from "@/config/adminFeatures";

const statusStyles = {
  planned: {
    border: "border-t-(--color-info)",
    icon: "bg-(--color-info-bg) text-(--color-info)",
    badge: "border-(--color-info)/30 bg-(--color-info-bg) text-(--color-info)",
  },
  inProgress: {
    border: "border-t-(--color-supporting)",
    icon: "bg-(--color-surface-secondary) text-(--color-secondary)",
    badge:
      "border-(--color-supporting)/30 bg-(--color-surface-secondary) text-(--color-secondary)",
  },
  polishing: {
    border: "border-t-(--color-warning)",
    icon: "bg-(--color-warning-bg) text-(--color-warning)",
    badge:
      "border-(--color-warning)/30 bg-(--color-warning-bg) text-(--color-warning)",
  },
  doneWaitingPR: {
    border: "border-t-(--color-supporting)",
    icon: "bg-(--color-supporting) text-(--color-on-primary)",
    badge:
      "border-(--color-supporting)/30 bg-(--color-surface-secondary) text-(--color-secondary)",
  },
  done: {
    border: "border-t-(--color-success)",
    icon: "bg-(--color-success-bg) text-(--color-success)",
    badge:
      "border-(--color-success)/30 bg-(--color-success-bg) text-(--color-success)",
  },
};

export default function FeatureStatusCard({ featureKey }) {
  const { t } = useTranslation();

  const feature = adminFeatures.find((item) => item.key === featureKey);

  if (!feature) {
    return null;
  }

  const Icon = feature.icon;
  const styles = statusStyles[feature.status];

  return (
    <Card
      className={`w-full items-center border-t-4 py-10 shadow-sm ${styles.border}`}
    >
      <CardContent className="flex w-full flex-col items-center justify-center gap-4">
        <div
          className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
        >
          <Icon className="size-8" aria-hidden="true" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="font-display text-2xl font-bold text-(--color-text-primary)">
            {t(feature.labelKey)}
          </h2>

          <Badge variant="outline" className={styles.badge}>
            {t(`admin.status.${feature.status}`)}
          </Badge>
        </div>

        <p className="max-w-md text-center text-sm leading-6 text-(--color-text-secondary)">
          {t("admin.comingSoon")}
        </p>
      </CardContent>
    </Card>
  );
}