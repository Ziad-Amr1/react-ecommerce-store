import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/utils/formatNumber";
import AdminTablePagination from "./AdminTablePagination";

// Shared table footer: standardized edge spacing + optional "showing X to Y
// of Z" summary line + the shared prev/next pagination. Every admin table uses
// this single footer so spacing stays consistent across features.
export default function AdminTableFooter({
  currentPage,
  totalPages,
  loading,
  onPageChange,
  labelPrefix,
  summary,
  className,
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en-US";

  if (totalPages <= 1) {
    return null;
  }

  const summaryText = summary
    ? t(summary.i18nKey, {
        from: formatNumber(summary.from, locale),
        to: formatNumber(summary.to, locale),
        count: formatNumber(summary.count, locale),
      })
    : "";

  return (
    <footer
      className={cn(
        "border-t border-(--color-border) px-4 py-3",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {summaryText ? (
          <p className="text-sm tabular-nums text-muted-foreground">
            {summaryText}
          </p>
        ) : (
          <span aria-hidden="true" />
        )}

        <AdminTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          onPageChange={onPageChange}
          labelPrefix={labelPrefix}
        />
      </div>
    </footer>
  );
}