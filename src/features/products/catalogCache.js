const CACHE_KEY = "oversea.productCatalog.v1";
const CATALOG_TTL_MS = 10 * 60 * 1000;

export function readCatalogCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const entry = JSON.parse(raw);
    if (
      !entry ||
      !Array.isArray(entry.products) ||
      !Number.isFinite(entry.fetchedAt)
    ) {
      return null;
    }
    return { products: entry.products, fetchedAt: entry.fetchedAt };
  } catch {
    return null;
  }
}

export function writeCatalogCache(products) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ products, fetchedAt: Date.now() }),
    );
  } catch {
    // Storage full or unavailable; the catalog still works in memory.
  }
}

export function isCatalogStale(entry) {
  return !entry || Date.now() - entry.fetchedAt > CATALOG_TTL_MS;
}

export { CATALOG_TTL_MS };