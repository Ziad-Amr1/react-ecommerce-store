import { describe, it, expect } from "vitest";
import { applyFiltersToCatalog } from "../features/products/clientFilter";

const PRODUCTS = [
  { _id: "p1", name: "Wireless Headphones", category: "Electronics", subcategory: "Audio", brand: "TechNova", price: 120 },
  { _id: "p2", name: "Noise Cancelling Headphones", category: "Electronics", subcategory: "Audio", brand: "AudioPro", price: 350 },
  { _id: "p3", name: "Smart Watch", category: "Electronics", subcategory: "Wearables", brand: "ChronoTech", price: 250 },
  { _id: "p4", name: "Leather Sofa", category: "Furniture", subcategory: "Sofas", brand: "ComfortCo", price: 900, rating: 4.5 },
  { _id: "p5", name: "Office Chair", category: "Furniture", subcategory: "Chairs", brand: "ErgoFit", price: 300, rating: 4.0 },
  { _id: "p6", name: "Wall Art Print", category: "Home Decor", subcategory: "Wall Art", brand: "Anima", price: 80, rating: 4.8 },
  { _id: "p7", name: "Stainless Pan", category: "Kitchen", subcategory: "Cookware", brand: "BrewMaster", price: 140, rating: 3.5 },
];

describe("applyFiltersToCatalog - subcategory filtering", () => {
  it("filters by subcategory case-insensitively", () => {
    const { items, total } = applyFiltersToCatalog(PRODUCTS, {
      category: "electronics",
      subcategory: "audio",
    });
    expect(total).toBe(2);
    expect(items.map((p) => p._id)).toEqual(["p1", "p2"]);
  });

  it("returns everything when subcategory is All", () => {
    const { items, total } = applyFiltersToCatalog(PRODUCTS, {
      category: "All",
      subcategory: "All",
    });
    expect(total).toBe(PRODUCTS.length);
    expect(items).toHaveLength(PRODUCTS.length);
  });
});

describe("applyFiltersToCatalog - search", () => {
  it("matches against name, brand and subcategory", () => {
    const byName = applyFiltersToCatalog(PRODUCTS, { search: "headphones" });
    expect(byName.total).toBe(2);

    const byBrand = applyFiltersToCatalog(PRODUCTS, { search: "chrono" });
    expect(byBrand.total).toBe(1);
    expect(byBrand.items[0]._id).toBe("p3");

    const bySub = applyFiltersToCatalog(PRODUCTS, { search: "sofas" });
    expect(bySub.total).toBe(1);
  });
});

describe("applyFiltersToCatalog - category + brand + price", () => {
  it("combines category, brand and price range", () => {
    const result = applyFiltersToCatalog(PRODUCTS, {
      category: "Electronics",
      brand: "All",
      minPrice: 200,
      maxPrice: 400,
    });
    expect(result.total).toBe(2);
    expect(result.items.map((p) => p._id).sort()).toEqual(["p2", "p3"]);
  });
});

describe("applyFiltersToCatalog - sorting", () => {
  it("sorts price ascending and descending", () => {
    const asc = applyFiltersToCatalog(PRODUCTS, { sortBy: "price_asc" });
    expect(asc.items[0].price).toBe(80);

    const desc = applyFiltersToCatalog(PRODUCTS, { sortBy: "price_desc" });
    expect(desc.items[0].price).toBe(900);
  });

  it("sorts by rating", () => {
    const rated = applyFiltersToCatalog(PRODUCTS, { sortBy: "rating" });
    expect(rated.items[0].rating).toBe(4.8);
    expect(rated.items[1].rating).toBe(4.5);
  });
});

describe("applyFiltersToCatalog - availability + discount", () => {
  const STOCKED = [
    { _id: "s1", name: "In-stock item", category: "Electronics", subcategory: "Audio", brand: "A", price: 50, stock: 8, discountPrice: null },
    { _id: "s2", name: "Sold out item", category: "Electronics", subcategory: "Audio", brand: "A", price: 40, stock: 0, discountPrice: null },
    { _id: "s3", name: "On sale item", category: "Electronics", subcategory: "Audio", brand: "A", price: 80, stock: 12, discountPrice: 55 },
    { _id: "s4", name: "Low stock item", category: "Electronics", subcategory: "Audio", brand: "A", price: 90, stock: 2, discountPrice: 45 },
  ];

  it("filters by in-stock availability", () => {
    const { items, total } = applyFiltersToCatalog(STOCKED, {
      availability: "in_stock",
    });
    expect(total).toBe(3);
    expect(items.map((p) => p._id)).toEqual(["s1", "s3", "s4"]);
  });

  it("filters by out-of-stock availability", () => {
    const { items, total } = applyFiltersToCatalog(STOCKED, {
      availability: "out_of_stock",
    });
    expect(total).toBe(1);
    expect(items.map((p) => p._id)).toEqual(["s2"]);
  });

  it("filters by discount", () => {
    const { items, total } = applyFiltersToCatalog(STOCKED, {
      discount: true,
    });
    expect(total).toBe(2);
    expect(items.map((p) => p._id)).toEqual(["s3", "s4"]);
  });

  it("ignores availability/discount when unset", () => {
    const { total } = applyFiltersToCatalog(STOCKED, {
      availability: "Any",
      discount: false,
    });
    expect(total).toBe(STOCKED.length);
  });

  it("combines availability, discount and subcategory", () => {
    const { total } = applyFiltersToCatalog(STOCKED, {
      category: "Electronics",
      subcategory: "Audio",
      availability: "in_stock",
      discount: true,
    });
    expect(total).toBe(2);
  });
});

describe("applyFiltersToCatalog - pagination", () => {
  it("paginates to the requested page size", () => {
    const page1 = applyFiltersToCatalog(PRODUCTS, {}, { page: 1, pageSize: 3 });
    expect(page1.items).toHaveLength(3);
    expect(page1.totalPages).toBe(Math.ceil(PRODUCTS.length / 3));

    const page3 = applyFiltersToCatalog(PRODUCTS, {}, { page: 3, pageSize: 3 });
    expect(page3.items).toHaveLength(1);
  });

  it("clamps out-of-range pages", () => {
    const result = applyFiltersToCatalog(PRODUCTS, {}, { page: 99, pageSize: 3 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]._id).toBe(PRODUCTS[PRODUCTS.length - 1]._id);
  });

  it("handles an empty catalog", () => {
    const result = applyFiltersToCatalog([], { category: "Electronics" });
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1);
  });
});