import { useTranslation } from "react-i18next";

export default function ProsCard({ icon: Icon, titleKey, descriptionKey }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm select-none">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
        <Icon className="size-7" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{t(titleKey)}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t(descriptionKey)}
        </p>
      </div>
    </div>
  );
}