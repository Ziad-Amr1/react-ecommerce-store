const DEFAULT_CURRENCY = "USD";
const DEFAULT_LOCALE = "en-US";

export function formatCurrency(value, currency = DEFAULT_CURRENCY, locale = DEFAULT_LOCALE) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return value;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}