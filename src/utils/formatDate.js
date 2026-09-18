// LRI/PDI isolate a Latin date into a single left-to-right run, keeping it
// readable when the surrounding document is RTL. Invisible in LTR renders.
const LRI = "\u2066";
const PDI = "\u2069";

export function formatLocaleDate(value, locale = "en-US", options = {}) {
  const date = value == null ? null : new Date(value);

  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  const formatted = new Intl.DateTimeFormat(locale, options).format(date);

  return `${LRI}${formatted}${PDI}`;
}

export function formatDisplayDate(value, locale = "en-US") {
  return formatLocaleDate(value, locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}