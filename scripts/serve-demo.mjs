#!/usr/bin/env node
// LOCAL-DEMO-ONLY read-only seed API for the storefront.
//
// Serves the authored catalog in data/demo/products.json using the same
// response contract the app already consumes (GET /products, GET /products/:id,
// GET /, plus a demo auth flow for /auth/me, /auth/login, /auth/logout).
//
// SAFETY GUARANTEES:
//   - Binds 127.0.0.1 only. No production URL, no credentials, no secrets.
//   - Read-only: every mutating verb on /products/* returns 405. Nothing is
//     ever written or persisted; the demo session lives only in memory.
//   - The dataset is loaded once at startup and never modified.
//   - Started explicitly by the developer; the app only talks to it when
//     VITE_API_URL points here. Default never touches the remote API.
//
// Usage:
//   node scripts/serve-demo.mjs            # binds 127.0.0.1:8787
//   PORT=8788 node scripts/serve-demo.mjs  # override port (still loopback)
//   Then:  VITE_API_URL=http://127.0.0.1:8787 npm run dev
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT) || 8787;
const HOST = "127.0.0.1";

const { products } = JSON.parse(
  readFileSync(path.join(ROOT, "data", "demo", "products.json"), "utf8"),
);

// Mirrors the authenticated demo user the storefront already expects
// (same shape as the app's auth fixtures).
const DEMO_USER = {
  fullName: "Jane Smith",
  email: "jane@example.com",
  username: "janesmith",
  phone: "+20 100 000 0000",
  role: "admin",
  avatar: null,
};

const SESSION_COOKIE = "demo_seed_session";
let demoAuthenticated = false;

const json = (res, status, body, extraHeaders = {}) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  res.end(JSON.stringify(body));
};

// CORS: reflect the origin only for local Vite dev/preview ports so the
// cross-origin dev request from localhost is allowed. No wildcard, no production.
const LOCAL_APP_PORTS = new Set(["5173", "5174", "4173"]);
const isLocalOrigin = (origin) => {
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    return (
      ["localhost", "127.0.0.1"].includes(parsed.hostname) &&
      LOCAL_APP_PORTS.has(parsed.port)
    );
  } catch {
    return false;
  }
};

const corsHeaders = (origin) =>
  isLocalOrigin(origin)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        Vary: "Origin",
      }
    : {};

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve(null);
      }
    });
  });

// --- Product matching (same params the admin/products UI sends) ---
const matchesParams = (product, url) => {
  const search = url.searchParams.get("search")?.trim().toLowerCase();
  if (search) {
    const haystack = [
      product.name,
      product.shortDescription,
      product.description,
      product.sku,
      product.category,
      product.subcategory,
      product.brand,
      ...(product.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  const category = url.searchParams.get("category")?.trim().toLowerCase();
  if (category && product.category.toLowerCase() !== category) return false;
  const brand = url.searchParams.get("brand")?.trim().toLowerCase();
  if (brand && product.brand.toLowerCase() !== brand) return false;
  const minRaw = url.searchParams.get("minPrice");
  if (minRaw !== null && minRaw !== "") {
    const minPrice = Number(minRaw);
    if (Number.isFinite(minPrice) && product.price < minPrice) return false;
  }
  const maxRaw = url.searchParams.get("maxPrice");
  if (maxRaw !== null && maxRaw !== "") {
    const maxPrice = Number(maxRaw);
    if (Number.isFinite(maxPrice) && product.price > maxPrice) return false;
  }
  return true;
};

const sortProducts = (list, url) => {
  const sort = url.searchParams.get("sort");
  if (sort === "price_asc") return [...list].sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") {
    // Rating is not a supported seed field yet; keep a stable, documented
    // order (by name) so the sort option never errors on the local API.
    return [...list].sort((a, b) => (a.name < b.name ? -1 : 1));
  }
  return list;
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  const method = req.method.toUpperCase();
  const start = Date.now();
  const origin = req.headers.origin;

  Object.entries(corsHeaders(origin)).forEach(([key, value]) =>
    res.setHeader(key, value),
  );
  res.on("close", () => {
    console.log(`${method} ${url.pathname}${url.search} -> ${res.statusCode} (${Date.now() - start}ms${origin ? ` [${origin}]` : ""})`);
  });

  if (method === "OPTIONS") {
    json(res, 204, {}, {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    });
    return;
  }

  // Health check used by the app's availability banner.
  if (url.pathname === "/" && method === "GET") {
    json(res, 200, {
      status: "ok",
      source: "local demo seed (read-only)",
      count: products.length,
    });
    return;
  }

  // --- Demo auth (in-memory only) ---
  if (url.pathname === "/auth/login" && method === "POST") {
    const body = await readBody(req);
    if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
      json(res, 400, { message: "email and password are required." });
      return;
    }
    demoAuthenticated = true;
    json(res, 200, { user: DEMO_USER }, {
      "Set-Cookie": `${SESSION_COOKIE}=seeded; Path=/; HttpOnly; SameSite=Lax`,
    });
    return;
  }

  if (url.pathname === "/auth/logout" && method === "POST") {
    demoAuthenticated = false;
    json(res, 200, {}, {
      "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    });
    return;
  }

  if (url.pathname === "/auth/me" && method === "GET") {
    if (!demoAuthenticated) {
      json(res, 401, { message: "Unauthenticated." });
      return;
    }
    json(res, 200, { user: DEMO_USER });
    return;
  }

  // --- Read-only catalog ---
  if (url.pathname === "/products" && method === "GET") {
    const filtered = products.filter((p) => matchesParams(p, url));
    const sorted = sortProducts(filtered, url);

    const limitParam = Number(url.searchParams.get("limit"));
    const pageParam = Number(url.searchParams.get("page"));
    // The storefront landing calls /products with no params and filters
    // featured client-side, so serve the full matching set unless pagination
    // was explicitly requested (as the admin table does).
    const usePagination = Number.isInteger(limitParam) && Number.isInteger(pageParam);
    const limit = usePagination && limitParam > 0 && limitParam <= 100 ? limitParam : sorted.length;
    const page = usePagination && pageParam > 0 ? pageParam : 1;

    const sliced = sorted.slice((page - 1) * limit, (page - 1) * limit + limit);
    const totalPages = Math.max(1, Math.ceil(sorted.length / (usePagination ? limit : 1)));

    json(res, 200, { products: sliced, totalPages });
    return;
  }

  const productMatch = url.pathname.match(/^\/products\/([^/]+)$/);
  if (productMatch && method === "GET") {
    const id = decodeURIComponent(productMatch[1]);
    const product = products.find((p) => p._id === id);
    if (!product) {
      json(res, 404, { message: `Product "${id}" not found in the demo catalog.` });
      return;
    }
    json(res, 200, { product });
    return;
  }

  // Any mutating verb on the catalog is refused — the seed is read-only.
  if (
    (url.pathname === "/products" || productMatch) &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(method)
  ) {
    json(res, 405, {
      message:
        "The local demo seed API is read-only: creating/updating/deleting products is disabled. It never writes to production or any other store.",
    });
    return;
  }

  json(res, 404, { message: "Route not found on the local demo seed API." });
});

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("  LOCAL DEMO SEED API  —  read-only catalog");
  console.log("  ------------------------------------------");
  console.log(`  Listening:  http://${HOST}:${PORT}`);
  console.log(`  Dataset:    ${products.length} products from data/demo/products.json`);
  console.log(`  Verb policy: GET only on /products (mutating verbs -> 405)`);
  console.log("  Session:    in-memory demo auth, never persisted");
  console.log("");
  console.log(`  Point the app here:  VITE_API_URL=http://${HOST}:${PORT} npm run dev`);
  console.log("  This server never writes to production and holds no credentials.");
  console.log("");
});