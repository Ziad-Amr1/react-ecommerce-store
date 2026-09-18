const DEFAULT_LOCALE = "en-US";

export const CURRENCIES = {
  EGP: "EGP",
  USD: "USD",
};

// The backend prices products, prices cart items and settles orders in EGP
// (docs: shipping free above 1000 EGP, 14% tax). EGP is therefore the
// store-wide default DISPLAY currency; any other currency is an optional
// display-only conversion of the EGP-denominated amount, never a change to
// the underlying stored value.
export const DEFAULT_CURRENCY = CURRENCIES.EGP;

// Display-only exchange rate configuration. The authoritative source for the
// rate is the Admin Settings feature, which is not implemented yet, so this is
// a placeholder value until that backend contract lands. Do not treat it as a
// live rate — wire this module to the settings service when available.
export const CURRENCY_CONFIG = {
  defaultCurrency: DEFAULT_CURRENCY,
  exchangeRate: {
    [CURRENCIES.USD]: 30.5, // 1 USD = 30.5 EGP (placeholder)
  },
  exchangeRateSource: "admin-settings-pending",
};

// Backward-compatible alias used by order/cart code (cart items and order
// totals are always settled in EGP).
export const ORDER_CURRENCY = CURRENCIES.EGP;

// Convert an EGP-denominated amount into the requested display currency.
// Returns null when no rate is configured for the target currency so callers
// never render a silently-wrong conversion.
function toDisplayAmount(value, currency) {
  if (currency === DEFAULT_CURRENCY) {
    return value;
  }

  const rate = CURRENCY_CONFIG.exchangeRate?.[currency];
  if (typeof rate !== "number" || rate <= 0) {
    return null;
  }

  return value / rate;
}

export function formatCurrency(value, currency = DEFAULT_CURRENCY, locale = DEFAULT_LOCALE) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return value;
  }

  const displayAmount = toDisplayAmount(value, currency);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(displayAmount ?? value);
}
