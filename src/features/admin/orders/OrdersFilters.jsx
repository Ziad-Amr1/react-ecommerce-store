
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const OrdersFilters = ( {search,
    status,
  payment,
  method,
  onSearch,
  onStatusChange,
  onPaymentChange,
  onMethodChange}

) => {

    const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative min-w-[260px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />

        <Input
          type="search"
          value={search}
          onChange={onSearch}
          placeholder={t("orders.searchPlaceholder")}
          className="border-[var(--color-border)] bg-[var(--color-surface)] pl-9 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
        />
      </div>

      {/* Status Filter */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px] border-[var(--color-border)] bg-[var(--color-surface)]">
          <SelectValue placeholder={t("orders.filters.status.placeholder")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all-statuses">
            {t("orders.filters.status.all")}
          </SelectItem>
          <SelectItem value="delivered">
            {t("orders.filters.status.delivered")}
          </SelectItem>
          <SelectItem value="shipped">
            {t("orders.filters.status.shipped")}
          </SelectItem>
          <SelectItem value="confirmed">
            {t("orders.filters.status.confirmed")}
          </SelectItem>
          <SelectItem value="processing">
            {t("orders.filters.status.processing")}
          </SelectItem>
          <SelectItem value="cancelled">
            {t("orders.filters.status.cancelled")}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Payment Filter */}
      <Select value={payment} onValueChange={onPaymentChange}>
        <SelectTrigger className="w-[140px] border-[var(--color-border)] bg-[var(--color-surface)]">
          <SelectValue placeholder={t("orders.filters.payment.placeholder")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all-payments">
            {t("orders.filters.payment.all")}
          </SelectItem>
          <SelectItem value="pending">
            {t("orders.filters.payment.pending")}
          </SelectItem>
          <SelectItem value="paid">
            {t("orders.filters.payment.paid")}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Payment Method Filter */}
      <Select value={method} onValueChange={onMethodChange}>
        <SelectTrigger className="w-[140px] border-[var(--color-border)] bg-[var(--color-surface)]">
          <SelectValue placeholder={t("orders.filters.method.placeholder")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all-methods">
            {t("orders.filters.method.all")}
          </SelectItem>
          <SelectItem value="cash">
            {t("orders.filters.method.cash")}
          </SelectItem>
          <SelectItem value="card">
            {t("orders.filters.method.card")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default OrdersFilters
