import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  readCatalogCache,
  writeCatalogCache,
  isCatalogStale,
} from "../features/products/catalogCache";

const CACHE_KEY = "oversea.productCatalog.v1";

describe("catalogCache", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns null when no cache exists", () => {
    expect(readCatalogCache()).toBeNull();
  });

  it("stores and reads back the product catalog", () => {
    const products = [{ _id: "1" }, { _id: "2" }];
    writeCatalogCache(products);

    const entry = readCatalogCache();
    expect(entry).not.toBeNull();
    expect(entry.products).toEqual(products);
    expect(Number.isFinite(entry.fetchedAt)).toBe(true);
  });

  it("returns null for malformed entries", () => {
    localStorage.setItem(CACHE_KEY, "not json");
    expect(readCatalogCache()).toBeNull();

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ products: "nope", fetchedAt: Date.now() }),
    );
    expect(readCatalogCache()).toBeNull();

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now() }),
    );
    expect(readCatalogCache()).toBeNull();
  });

  it("treats a fresh cache as not stale", () => {
    writeCatalogCache([{ _id: "1" }]);
    expect(isCatalogStale(readCatalogCache())).toBe(false);
  });

  it("treats an expired cache as stale", () => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ products: [{ _id: "1" }], fetchedAt: Date.now() - 11 * 60 * 1000 }),
    );
    expect(isCatalogStale(readCatalogCache())).toBe(true);
  });
});