import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StatCard({
  title,
  description,
  value,
  subline,
  icon: Icon,
  borderClass,
  iconClass,
}) {
  return (
    <Card className={`overflow-hidden border-t-4 shadow-sm ${borderClass}`}>
      <CardHeader>
        <CardTitle className="font-display">{title}</CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display wrap-break-word text-2xl font-bold tabular-nums">
            {value}
          </h2>

          {subline && (
            <p className="text-xs text-(--color-text-secondary)">
              {subline}
            </p>
          )}
        </div>

        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="size-8" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}