import { describe, expect, it } from "vitest";
import {
  CURRENCIES,
  CURRENCY_CONFIG,
  DEFAULT_CURRENCY,
  ORDER_CURRENCY,
  formatCurrency,
} from "../utils/formatCurrency";

describe("formatCurrency currency architecture", () => {
  it("defaults to EGP display without a currency argument", () => {
    expect(DEFAULT_CURRENCY).toBe(CURRENCIES.EGP);
    expect(formatCurrency(100)).toBe("EGP\u00A0100.00");
  });

  it("formats explicit EGP amounts without any conversion", () => {
    expect(formatCurrency(100, CURRENCIES.EGP, "en-US")).toBe("EGP\u00A0100.00");
  });

  it("converts an EGP-denominated amount to USD only when explicitly requested", () => {
    const rate = CURRENCY_CONFIG.exchangeRate[CURRENCIES.USD];
    expect(typeof rate).toBe("number");
    expect(formatCurrency(rate, CURRENCIES.USD, "en-US")).toBe("$1.00");
    expect(formatCurrency(305, CURRENCIES.USD, "en-US")).toBe("$10.00");
  });

  it("marks the exchange-rate source as pending Admin Settings", () => {
    expect(CURRENCY_CONFIG.exchangeRateSource).toBe("admin-settings-pending");
    expect(CURRENCY_CONFIG.defaultCurrency).toBe(CURRENCIES.EGP);
  });

  it("formats zero", () => {
    expect(formatCurrency(0, CURRENCIES.EGP, "en-US")).toBe("EGP\u00A00.00");
  });

  it("keeps two decimal places", () => {
    expect(formatCurrency(1.5, CURRENCIES.EGP, "en-US")).toBe("EGP\u00A01.50");
  });

  it("respects the locale for symbols", () => {
    expect(formatCurrency(10, CURRENCIES.EGP, "ar-EG")).toContain("ج.م.");
  });

  it("passes through non-finite values unchanged", () => {
    expect(formatCurrency("100")).toBe("100");
    expect(formatCurrency(null)).toBe(null);
    expect(formatCurrency(NaN)).toBe(NaN);
  });

  it("keeps ORDER_CURRENCY pointed at EGP", () => {
    expect(ORDER_CURRENCY).toBe("EGP");
    expect(CURRENCIES).toEqual({ EGP: "EGP", USD: "USD" });
  });
});