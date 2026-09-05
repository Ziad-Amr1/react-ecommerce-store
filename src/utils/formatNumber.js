const DEFAULT_LOCALE = "en-US";

export function formatNumber(value, locale = DEFAULT_LOCALE) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return value;
  }

  return new Intl.NumberFormat(locale).format(value);
}