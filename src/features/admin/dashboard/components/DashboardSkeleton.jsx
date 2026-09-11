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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-56 max-w-full" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-7 w-28" />
                </div>
              ))}
            </div>

            <Skeleton className="h-56 w-full sm:h-64" />
          </CardContent>
        </Card>

        <div className="hidden lg:col-span-4 lg:flex lg:flex-col lg:gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="flex-1">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>

              <CardContent className="space-y-2">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>

              <CardContent className="space-y-2">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-6">
            <Skeleton className="h-48 w-48 rounded-full" />

            <div className="w-full space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>

          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="size-11 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-6 border-b border-(--color-border) py-3 [&:last-child]:border-b-0"
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}