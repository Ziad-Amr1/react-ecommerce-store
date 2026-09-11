import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
    
export default function DashboardSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="w-full space-y-6" role="status" aria-busy="true">
      <span className="sr-only">{t("dashboard.loading")}</span>

      <Card>
        <CardHeader className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-64 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden border-t-4 border-t-(--color-accent)"
          >
            <CardHeader className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>

            <CardContent className="flex items-end justify-between gap-3">
              <Skeleton className="h-8 w-14" />
              <Skeleton className="size-11 shrink-0 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-48 rounded-full" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>

          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Skeleton className="size-12 shrink-0 rounded-lg" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>

                <Skeleton className="h-4 w-14" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
