# Demo Catalog Seed Data (P7)

> **Status:** v1, local/dev-only. Never used as a production dataset.
> The store is a pure Vite + React frontend: it ships **no backend and no database**.
> Production traffic talks to the deployed API at
> `https://e-commerce-api-3wara.vercel.app`/`/api` (see `src/api/axios.js` and `.env`).
> This deliverable adds a **local, read-only** catalog + API so the app can be
> demoed end-to-end without that remote API.

## What is included

| Path | What it is |
| --- | --- |
| `data/demo/products.json` | Authored catalog: **60 products across 10 categories** |
| `scripts/validate-dataset.mjs` | Zero-dependency validator (schema, types, variance, safety) |
| `scripts/serve-demo.mjs` | Zero-dependency **read-only** local API over the dataset |
| `npm run demo:validate` | Alias for the validator |
| `npm run demo:serve` | Alias for the local server (default `127.0.0.1:8787`) |

### Dataset shape

```jsonc
{
  "meta": {
    "version": 1,
    "count": 60,
    "purpose": "local demo catalog — never seed production",
    "categories": ["Furniture", "Lighting", "Home Decor", "Kitchen", "Office",
                   "Accessories", "Electronics", "Beauty", "Fashion", "Sunglasses"]
  },
  "products": [ /* 60 products, 6 per category */ ]
}
```

Variance built into the set: `featured = 12`, discounted = 20,
inactive = 5, out-of-stock = 6, low-stock (1-4) = 8,
price range `19.99 .. 1249.99`, stock range `0 .. 320`.
Every image is the local root-relative placeholder `/product-placeholder.png`
(one product has two images to exercise the gallery).

### Supported fields (only these)

`_id, name, shortDescription, description, price, discountPrice (nullable),
stock, sku, category (raw string), subcategory, brand, tags, featured (bool),
isActive (bool), images: [{ url }]`

These are exactly the fields the app renders today (admin Products CRUD,
landing/featured rail, product detail). **No field the app cannot render is
invented.**

## How to run it

```bash
npm run demo:validate   # 1. validate the dataset (passes / prints variance)
npm run demo:serve      # 2. start the read-only local API on 127.0.0.1:8787
```

In a second terminal, point the app at it (the `.env` `VITE_API_URL` is **not** modified):

```bash
VITE_API_URL=http://127.0.0.1:8787 npm run dev
```

Demo login: any + any password (the server accepts any email/password for the
local session; the returned `user` mirrors the app's demo admin fixture).
An anonymous `GET /auth/me` returns `401` so the auth flow is exercised for real.

## API contract (mirrors what the app calls)

| Route | Behavior |
| --- | --- |
| `GET /` | `{ ok: true }` health (used by `useApiAvailability`) |
| `GET /products` | `{ products, totalPages }`; params `page, limit, search, category, brand, minPrice, maxPrice, sort`; `PAGE_SIZE = 10` |
| `GET /products/:id` | `{ product }` — matches `useProduct`'s `data.product` |
| `POST/GET /auth/*` | In-memory demo login/logout/me (session cookie `demo_seed_session`) |

`sort` values handled: `price_asc`, `price_desc`, `newest`, `name`, `rating`
(stable name-order — the app's tier accepts any sort). Unknown ids → `404`.

## Safety guarantees

- **Loopback only**: binds `127.0.0.1` (never `0.0.0.0`).
- **Read-only**: every mutating verb on `/products*` returns `405`.
  The dataset is loaded once and never modified — there is no write path.
- **No credentials/secrets/URLs**: the dataset and server contain no
  production URL, no API keys, and no real user data (safety scan is part of
  `demo:validate`).
- **CORS**: reflects the origin **only** for local Vite ports
  `5173 / 5174 / 4173`. No wildcard, no remote origins, no credentials header.
- **No persistence**: login sessions are in-memory; a restart resets them.
- **`.env` untouched**; production flow (`VITE_API_URL` remote or prod `/api`)
  is completely unaffected.

## Validation

Run `npm run demo:validate` (also run by CI in the smoke harness). It checks:
schema + types, unique ids/skus, 10 categories covered (≥4 items each),
featured/discount/stock/price variance, root-relative local images,
allow-listed fields only, and the two file-safety scans above.

Smoke result for this catalog (orchestrated Vite + seed server + Playwright):
**45/45 checks passed**. Secured: landing featured rail, `remoteHits = 0`
(no production API touched), no api-error banner, admin login flow, table
pagination `1 / 6`, search, category filter, product detail description + gallery.

## Deferred decisions (record)

1. **No `rating` field.** The app has no rating render path (only an admin
   sort option). Server handles `sort=rating` as stable name-order.
   If ratings are added to the app UI later, seed ratings then.
2. **Local placeholder images** instead of remote image URLs — keeps the
   dataset dependency-free and prevents any image host calls.
3. **One demo admin identity** (`jane@example.com`) — no roles matrix.