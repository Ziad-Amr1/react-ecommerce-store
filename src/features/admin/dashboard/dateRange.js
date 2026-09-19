/**
 * Client-side date range filtering for the dashboard revenue chart.
 *
 * The API returns `dailyRevenue` as `[{ _id: "YYYY-MM-DD", revenue, orders }]`.
 * Only real data points are returned — no zero-filled or forward-filled entries.
 * This module filters the array to entries within a chosen range.
 *
 * ## Product decisions (do not change without a spec update)
 * - Date ranges are client-side filters over the available `dailyRevenue`
 *   window. The backend serves a fixed window (last 7 days) with no range
 *   parameters, so this module never issues extra requests.
 * - Revenue is NEVER fabricated: no interpolation, no forward-filling, no
 *   extrapolation. A range with no real points renders the empty state.
 * - Backend revenue semantics are NOT invented here. Which statuses count
 *   toward `revenue` (e.g. are cancelled/returned orders included) is
 *   server-defined and out of this module's scope. If the backend narrows or
 *   widens that window later, this code simply filters whatever it receives.
 * - Consequently `prevMonth` (and any historical range outside the served
 *   window) legitimately shows an empty chart until the backend provides the
 *   underlying point data. That empty result is correct behavior, not a bug.
 *
 * All date arithmetic uses local midnight boundaries derived from the _id
 * string (YYYY-MM-DD) to avoid timezone drift.
 */

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function today() {
  return startOfDay(new Date());
}

/**
 * Date range presets. Each returns { start, end } as local-midnight Dates.
 * `start` is inclusive, `end` is inclusive (the last day to show).
 */
export const DATE_RANGE_PRESETS = {
  last3: () => {
    const now = today();
    const start = new Date(now);
    start.setDate(start.getDate() - 2);
    return { start, end: now };
  },
  last7: () => {
    const now = today();
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    return { start, end: now };
  },
  thisMonth: () => {
    const now = today();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start, end: now };
  },
  prevMonth: () => {
    const now = today();
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    return { start, end };
  },
  all: () => null,
};

/**
 * Filter `dailyRevenue` to the selected date range.
 *
 * - Only entries whose `_id` falls within [start, end] are included.
 * - No data points are fabricated. If only one real point exists in the range,
 *   it is rendered as a single-point line.
 * - Consecutive identical revenue values are preserved as-is.
 * - Missing dates are left as gaps — the line chart interpolates visually.
 *
 * @param {Array} dailyRevenue - raw API response `[{ _id, revenue, orders }]`
 * @param {string} rangeKey - one of "last3" | "last7" | "thisMonth" | "prevMonth" | "all"
 * @returns {Array} filtered subset of dailyRevenue
 */
export function filterDailyRevenue(dailyRevenue, rangeKey) {
  if (!Array.isArray(dailyRevenue) || dailyRevenue.length === 0) return [];
  if (rangeKey === "all") return dailyRevenue;

  const preset = DATE_RANGE_PRESETS[rangeKey];
  if (!preset) return dailyRevenue;

  const range = preset();
  if (!range) return dailyRevenue;

  const startKey = toDateKey(range.start);
  const endKey = toDateKey(range.end);

  return dailyRevenue.filter((item) => {
    if (item?._id == null) return false;
    return item._id >= startKey && item._id <= endKey;
  });
}
