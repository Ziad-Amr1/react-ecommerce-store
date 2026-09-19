import { describe, it, expect } from "vitest";
import {
  filterDailyRevenue,
  DATE_RANGE_PRESETS,
} from "../features/admin/dashboard/dateRange";

function dateKey(offsetDaysFromToday) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() + offsetDaysFromToday);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

describe("date range presets", () => {
  it("last3 covers today and the two previous days", () => {
    const { start, end } = DATE_RANGE_PRESETS.last3();
    expect(end).toBeInstanceOf(Date);
    expect(start).toBeInstanceOf(Date);
    expect(end.getDate()).toBe(new Date().getDate());
    expect(start.getDate()).toBe(new Date().getDate() - 2);
  });

  it("last7 covers today and the six previous days", () => {
    const { start, end } = DATE_RANGE_PRESETS.last7();
    expect(end).toBeInstanceOf(Date);
    expect(start.getDate()).toBe(new Date().getDate() - 6);
  });

  it("thisMonth starts on the first day of the current month", () => {
    const { start } = DATE_RANGE_PRESETS.thisMonth();
    expect(start.getDate()).toBe(1);
    expect(start.getMonth()).toBe(new Date().getMonth());
  });

  it("prevMonth maps to the full calendar month before the current one", () => {
    const { start, end } = DATE_RANGE_PRESETS.prevMonth();
    const now = new Date();
    const expectedEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    expect(start.getDate()).toBe(1);
    expect(start.getMonth()).toBe(expectedEnd.getMonth());
    expect(end.getDate()).toBe(expectedEnd.getDate());
  });
});

describe("filterDailyRevenue", () => {
  it("returns an empty array for an empty input", () => {
    expect(filterDailyRevenue([], "last7")).toEqual([]);
    expect(filterDailyRevenue(null, "last7")).toEqual([]);
    expect(filterDailyRevenue(undefined, "last7")).toEqual([]);
  });

  it("returns all entries when rangeKey is 'all'", () => {
    const rows = [
      { _id: dateKey(-30), revenue: 100, orders: 1 },
      { _id: dateKey(-1), revenue: 200, orders: 2 },
    ];
    expect(filterDailyRevenue(rows, "all")).toEqual(rows);
  });

  it("returns an unknown range key untouched (treats it as 'all')", () => {
    const rows = [{ _id: dateKey(-1), revenue: 200, orders: 2 }];
    expect(filterDailyRevenue(rows, "nonsense")).toEqual(rows);
  });

  it("keeps only entries inside the last7 window (boundaries inclusive)", () => {
    const rows = [
      { _id: dateKey(-10), revenue: 10, orders: 1 },
      { _id: dateKey(-6), revenue: 60, orders: 1 },
      { _id: dateKey(-1), revenue: 100, orders: 2 },
      { _id: dateKey(0), revenue: 70, orders: 1 },
    ];
    const filtered = filterDailyRevenue(rows, "last7");
    expect(filtered).toEqual([
      { _id: dateKey(-6), revenue: 60, orders: 1 },
      { _id: dateKey(-1), revenue: 100, orders: 2 },
      { _id: dateKey(0), revenue: 70, orders: 1 },
    ]);
  });

  it("keeps a single real point inside the range as-is", () => {
    const rows = [
      { _id: dateKey(0), revenue: 150, orders: 3 },
    ];
    const filtered = filterDailyRevenue(rows, "last3");
    expect(filtered).toEqual(rows);
  });

  it("does not forward-fill missing dates — only real points survive", () => {
    const rows = [
      { _id: dateKey(-2), revenue: 100, orders: 1 },
      { _id: dateKey(0), revenue: 200, orders: 2 },
    ];
    // gap at dateKey(-1) must not be invented
    expect(filterDailyRevenue(rows, "last7")).toEqual(rows);
  });

  it("preserves consecutive identical revenue values unchanged", () => {
    const rows = [
      { _id: dateKey(-2), revenue: 50, orders: 1 },
      { _id: dateKey(-1), revenue: 50, orders: 2 },
      { _id: dateKey(0), revenue: 50, orders: 1 },
    ];
    const filtered = filterDailyRevenue(rows, "last3");
    expect(filtered.map((row) => row.revenue)).toEqual([50, 50, 50]);
  });

  it("thisMonth includes only current-month real points", () => {
    const today = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const prevMonthEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    );

    const rows = [
      { _id: dateKeyFrom(prevMonthEnd), revenue: 900, orders: 9 },
      { _id: dateKeyFrom(firstOfMonth), revenue: 10, orders: 1 },
      { _id: dateKey(0), revenue: 20, orders: 2 },
    ];
    const filtered = filterDailyRevenue(rows, "thisMonth");
    expect(filtered).toEqual([rows[1], rows[2]]);
  });
});

// Helper local to this file for building date keys from a Date object.
function dateKeyFrom(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}