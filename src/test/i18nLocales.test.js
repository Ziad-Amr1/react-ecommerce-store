import { describe, it, expect } from "vitest";
import enLocales from "../i18n/locales/en.json";
import arLocales from "../i18n/locales/ar.json";
import frLocales from "../i18n/locales/fr.json";
import ruLocales from "../i18n/locales/ru.json";

function flattenKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      return flattenKeys(value, path);
    }
    return [path];
  });
}

const ADMIN_NAMESPACES = [
  "adminTable",
  "common",
  "dashboard",
  "products",
  "orders",
  "users",
  "carts",
];

describe("i18n locale parity (admin-relevant namespaces)", () => {
  it.each(ADMIN_NAMESPACES)(
    "provides the same set of keys for the %s namespace in en, ar, fr, and ru",
    (namespace) => {
      const enKeys = flattenKeys(enLocales[namespace]).sort();
      const arKeys = flattenKeys(arLocales[namespace]).sort();
      const frKeys = flattenKeys(frLocales[namespace]).sort();
      const ruKeys = flattenKeys(ruLocales[namespace]).sort();

      expect(enKeys).toEqual(arKeys);
      expect(enKeys).toEqual(frKeys);
      expect(enKeys).toEqual(ruKeys);
    },
  );

  it("adds the shared adminTable namespace in both locales", () => {
    expect(flattenKeys({ adminTable: enLocales.adminTable }).sort()).toEqual([
      "adminTable.page",
      "adminTable.records",
      "adminTable.total",
    ]);
    expect(flattenKeys({ adminTable: arLocales.adminTable }).sort()).toEqual([
      "adminTable.page",
      "adminTable.records",
      "adminTable.total",
    ]);
  });

  it("keeps the pagination labels consumed by the shared pagination component", () => {
    expect(enLocales.products.pagination.previous).toBeTruthy();
    expect(enLocales.products.pagination.next).toBeTruthy();
    expect(arLocales.products.pagination.previous).toBeTruthy();
    expect(arLocales.products.pagination.next).toBeTruthy();
    expect(enLocales.orders.pagination.previous).toBeTruthy();
    expect(arLocales.orders.pagination.next).toBeTruthy();
    expect(enLocales.users.pagination.previous).toBeTruthy();
    expect(arLocales.users.pagination.next).toBeTruthy();
    expect(enLocales.carts.pagination.previous).toBeTruthy();
    expect(arLocales.carts.pagination.next).toBeTruthy();
  });
});