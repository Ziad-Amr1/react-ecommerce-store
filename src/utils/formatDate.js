const MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// LRI/PDI isolate the Latin date into a single left-to-right run, keeping it
// readable when the surrounding document is RTL. Invisible in LTR renders.
const LRI = "\u2066";
const PDI = "\u2069";

export function formatDisplayDate(value) {
  const date = value == null ? null : new Date(value);

  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const formatted = `${day} ${MONTH_ABBREVIATIONS[date.getMonth()]} ${date.getFullYear()}`;

  return `${LRI}${formatted}${PDI}`;
}