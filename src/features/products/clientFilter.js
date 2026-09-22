const PAGE_SIZE = 12;

// Mirrors the server-side /products query semantics client-side so the cached
// catalog can be filtered instantly (used for the subcategory filter, which the
// backend does not support as a query param, and for deep links into the shop).
export function applyFiltersToCatalog(
  products,
  applied = {},
  { page = 1, pageSize = PAGE_SIZE } = {},
) {
  const source = Array.isArray(products) ? products : [];
  const query = String(applied.search || "").trim().toLowerCase();

  const matchesSearch = (p) => {
    if (!query) {
      return true;
    }
    const haystack = [
      p.name,
      p.shortDescription,
      p.description,
      p.brand,
      p.category,
      p.subcategory,
    ];
    return haystack.some(
      (field) => typeof field === "string" && field.toLowerCase().includes(query),
    );
  };

  const equals = (value, filter) =>
    !filter || filter === "All" || String(value ?? "").toLowerCase() === String(filter).toLowerCase();

  let items = source.filter((p) => {
    if (!matchesSearch(p)) {
      return false;
    }
    if (!equals(p.category, applied.category)) {
      return false;
    }
    if (!equals(p.brand, applied.brand)) {
      return false;
    }
    if (!equals(p.subcategory, applied.subcategory)) {
      return false;
    }
    const price = Number(p.price) || 0;
    if (applied.minPrice !== "" && price < Number(applied.minPrice)) {
      return false;
    }
    if (applied.maxPrice !== "" && price > Number(applied.maxPrice)) {
      return false;
    }
    return true;
  });

  if (applied.sortBy === "price_asc") {
    items = [...items].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  } else if (applied.sortBy === "price_desc") {
    items = [...items].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  } else if (applied.sortBy === "rating") {
    items = [...items].sort(
      (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
    );
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    totalPages,
  };
}