import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StatCard({ title, description, value, icon: Icon }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-(--color-text-secondary)">
            {title}
          </CardTitle>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-secondary) text-(--color-text-secondary)">
            <Icon className="size-4" aria-hidden="true" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5">
        <p className="font-display text-2xl font-bold tabular-nums wrap-break-word text-(--color-text-primary)">
          {value}
        </p>

        <p className="text-xs leading-5 text-(--color-text-secondary)">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}