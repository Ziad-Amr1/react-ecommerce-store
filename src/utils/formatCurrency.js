const DEFAULT_CURRENCY = "USD";
const DEFAULT_LOCALE = "en-US";

// The backend prices cart items and settles orders in EGP (docs: shipping
// free above 1000 EGP, 14% tax). Order/cart amounts must use this, never the
// USD default.
export const ORDER_CURRENCY = "EGP";

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