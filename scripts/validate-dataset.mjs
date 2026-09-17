#!/usr/bin/env node
// Validates data/demo/products.json against the app's supported product
// contract. Failures print to stderr and exit non-zero. Read-only; never
// writes anything.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(ROOT, "data", "demo", "products.json");

const ALLOWED_FIELDS = new Set([
  "_id",
  "name",
  "shortDescription",
  "description",
  "price",
  "discountPrice",
  "stock",
  "sku",
  "category",
  "subcategory",
  "brand",
  "tags",
  "featured",
  "isActive",
  "images",
]);

const REQUIRED_FIELDS = [
  "_id",
  "name",
  "shortDescription",
  "description",
  "price",
  "stock",
  "sku",
  "category",
  "subcategory",
  "brand",
  "tags",
  "featured",
  "isActive",
  "images",
];

const errors = [];
const warn = (label, detail) => {
  console.warn(`WARN ${label}: ${detail}`);
};

const { meta, products } = JSON.parse(readFileSync(dataPath, "utf8"));
const CATEGORIES = meta.categories;

if (!Array.isArray(products)) errors.push("products must be an array");
if (!meta || typeof meta.version !== "number") {
  errors.push("meta.version must be a number");
}
if (meta.count !== products.length) {
  errors.push(`meta.count (${meta.count}) does not match products.length (${products.length})`);
}

const ids = new Set();
const skus = new Set();
let featuredCount = 0;
let discountedCount = 0;
let inactiveCount = 0;
let outOfStock = 0;
let lowStock = 0;
let minPrice = Infinity;
let maxPrice = -Infinity;
const categoryCounts = {};

for (const [index, product] of products.entries()) {
  const label = `products[${index}]${product._id ? ` (${product._id})` : ""}`;

  const keys = Object.keys(product);
  for (const key of keys) {
    if (!ALLOWED_FIELDS.has(key)) {
      errors.push(`${label}: unsupported field "${key}" (allowed: ${[...ALLOWED_FIELDS].join(", ")})`);
    }
  }
  for (const field of REQUIRED_FIELDS) {
    if (!(field in product)) errors.push(`${label}: missing required field "${field}"`);
  }
  if (!(typeof product.name === "string" && product.name.trim().length > 0)) {
    errors.push(`${label}: name must be a non-empty string`);
  }
  if (!(typeof product.shortDescription === "string" && product.shortDescription.length >= 10)) {
    errors.push(`${label}: shortDescription must be a string of at least 10 chars`);
  }
  if (!(typeof product.description === "string" && product.description.length >= 20)) {
    errors.push(`${label}: description must be a string of at least 20 chars`);
  }
  if (!Number.isFinite(product.price) || product.price <= 0) {
    errors.push(`${label}: price must be a positive finite number`);
  } else {
    minPrice = Math.min(minPrice, product.price);
    maxPrice = Math.max(maxPrice, product.price);
  }
  if (product.discountPrice !== null) {
    if (
      !Number.isFinite(product.discountPrice) ||
      product.discountPrice <= 0 ||
      product.discountPrice >= product.price
    ) {
      errors.push(`${label}: discountPrice must be null or a number between 0 and price (exclusive)`);
    } else {
      discountedCount += 1;
    }
  }
  if (!Number.isInteger(product.stock) || product.stock < 0) {
    errors.push(`${label}: stock must be a non-negative integer`);
  } else {
    if (product.stock === 0) outOfStock += 1;
    if (product.stock > 0 && product.stock < 5) lowStock += 1;
  }
  if (typeof product.sku !== "string" || product.sku.trim() === "") {
    errors.push(`${label}: sku must be a non-empty string`);
  } else if (skus.has(product.sku)) {
    errors.push(`${label}: duplicate sku "${product.sku}"`);
  } else {
    skus.add(product.sku);
  }
  if (typeof product._id !== "string" || product._id.trim() === "") {
    errors.push(`${label}: _id must be a non-empty string`);
  } else if (ids.has(product._id)) {
    errors.push(`${label}: duplicate _id`);
  } else {
    ids.add(product._id);
  }
  if (!CATEGORIES.includes(product.category)) {
    errors.push(`${label}: category "${product.category}" not in meta.categories`);
  } else {
    categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
  }
  if (!(typeof product.subcategory === "string" && product.subcategory.trim() !== "")) {
    errors.push(`${label}: subcategory must be a non-empty string`);
  }
  if (!(typeof product.brand === "string" && product.brand.trim() !== "")) {
    errors.push(`${label}: brand must be a non-empty string`);
  }
  if (
    !Array.isArray(product.tags) ||
    product.tags.length < 3 ||
    product.tags.some((tag) => typeof tag !== "string" || tag.trim() === "")
  ) {
    errors.push(`${label}: tags must be an array of at least 3 non-empty strings`);
  }
  if (typeof product.featured !== "boolean") {
    errors.push(`${label}: featured must be a boolean`);
  } else if (product.featured) {
    featuredCount += 1;
  }
  if (typeof product.isActive !== "boolean") {
    errors.push(`${label}: isActive must be a boolean`);
  } else if (!product.isActive) {
    inactiveCount += 1;
  }
  if (
    !Array.isArray(product.images) ||
    product.images.length === 0 ||
    product.images.some((img) => typeof img?.url !== "string" || !img.url.startsWith("/"))
  ) {
    errors.push(`${label}: images must be a non-empty array of { url } with a local (root-relative) url`);
  }
}

// Coverage checks
for (const category of CATEGORIES) {
  const count = categoryCounts[category] || 0;
  if (count < 4) errors.push(`category "${category}" has only ${count} products (want >= 4)`);
}

if (errors.length > 0) {
  console.error("Dataset validation FAILED:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exitCode = 1;
} else {
  console.log("Dataset validation PASSED");
}

// Always print the overview (useful even when validation fails).
console.log(`  meta.version       = ${meta.version}`);
console.log(`  total products     = ${products.length}`);
console.log(`  per category       = ${CATEGORIES.map((c) => `${c}:${categoryCounts[c] || 0}`).join(", ")}`);
console.log(`  featured           = ${featuredCount}`);
console.log(`  discounted         = ${discountedCount}`);
console.log(`  inactive           = ${inactiveCount}`);
console.log(`  out of stock (0)   = ${outOfStock}`);
console.log(`  low stock (1-4)    = ${lowStock}`);
console.log(`  price range        = ${minPrice} - ${maxPrice}`);