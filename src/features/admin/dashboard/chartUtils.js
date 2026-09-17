// Shared helpers for the Dashboard revenue chart.

// Measure a text run at the axis font size (12px). Uses canvas measurement
// when available (real browsers) and falls back to a deterministic estimate
// otherwise (e.g. jsdom unit tests) so the axis never clips values like
// "EGP 120K" or the wider Arabic compact-currency forms.
const AXIS_FONT = "12px Inter, system-ui, sans-serif";

export function measureAxisTextWidth(text) {
  try {
    if (typeof document !== "undefined" && typeof document.createElement === "function") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext?.("2d");
      if (ctx) {
        ctx.font = AXIS_FONT;
        return Math.ceil(ctx.measureText(text).width);
      }
    }
  } catch {
    // fall through to the estimate
  }

  return Math.ceil(
    Array.from(String(text)).reduce(
      (sum, ch) => sum + (/[\d.]/.test(ch) ? 8 : 7),
      0,
    ),
  );
}