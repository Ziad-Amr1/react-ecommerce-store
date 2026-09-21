import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RevenueTrend from "../features/admin/dashboard/components/RevenueTrend";
import { measureAxisTextWidth } from "../features/admin/dashboard/chartUtils";

describe("RevenueTrend - axis label width", () => {
  it("allocates more room for wide compact-currency labels like EGP 120K than short ones like EGP 60K", () => {
    const wide = measureAxisTextWidth("EGP 120K");
    const short = measureAxisTextWidth("EGP 60K");
    expect(wide).toBeGreaterThan(short);
  });

  it("always leaves at least the minimum axis width and stays within the clamp window", () => {
    expect(measureAxisTextWidth("EGP 120K")).toBeGreaterThanOrEqual(48);
    // Component clamps the final width to at most 120px.
    expect(Math.min(120, measureAxisTextWidth("EGP 120K") + 12)).toBeLessThanOrEqual(120);
  });

  it("sizes Arabic/RTL compact-currency labels (wider scripts) generously too", () => {
    const arabic = measureAxisTextWidth("١٢٠ ألف ج.م.");
    expect(arabic).toBeGreaterThan(measureAxisTextWidth("EGP 60K"));
  });

  it("caps an extremely long label at the maximum axis width", () => {
    const veryLong = "١٢٣٬٤٥٦٬٧٨٩ ألف ج.م. مصري";
    expect(Math.min(120, measureAxisTextWidth(veryLong) + 12)).toBe(120);
  });
});

describe("RevenueTrend - empty state", () => {
  it("shows the no-data message in a full-height container (card height is preserved)", () => {
    render(<RevenueTrend dailyRevenue={[]} />);

    const message = screen.getByText("No dashboard data available.");
    expect(message).toBeInTheDocument();

    const container = message.closest("div");
    expect(container).toHaveClass("h-56");
    expect(container).toHaveClass("sm:h-64");
  });
});