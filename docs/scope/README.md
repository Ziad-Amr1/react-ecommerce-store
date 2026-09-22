# Project scope

Living, coarse scope for this repository. Derived only from what exists in the repo today. No future requirements are invented here; anything not evidenced by the codebase is marked Unknown.

## Product purpose

A bilingual (Arabic/English, plus French and Russian) single page e-commerce storefront with an admin back office, talking to an external REST API. The repo contains only the frontend (Vite 8 + React 19 + React Router 7 + Tailwind 4). No backend lives here; a local demo API server exists for offline work.

## Major user-facing areas

| Area | Routes / evidence |
| --- | --- |
| Storefront | Landing `/`, shop `/products`, product details `/products/:id`, category gallery `/categories`, cart `/cart` |
| Purchase flow | `/checkout`, `/order-success` (behind auth) |
| Account | `/profile`, `/my-orders`, `/my-orders/:id`, `/wishlist`, `/notifications` (behind auth) |
| Auth | `/login`, `/register`, `/forgot-password`, `/:flow/verify-otp` |
| Info pages | `/about`, `/privacy`, `/help`, `/shipping`, `/contact` |
| System | `/maintenance`, `*` (404), `/design-system` (internal style guide) |

## Admin areas

Behind `ProtectedRoute` + `AdminLayout`, path prefix `/admin`:

Dashboard, products (list, add, edit, detail), categories, orders, users, carts, reviews, wishlists, coupons, reports, settings.

## Architecture boundaries

- Frontend only: services in `src/services/` and `src/features/*` call the external API over `/api` with axios cookies (no token storage).
- Feature code in `src/features/<area>/`, pages in `src/pages/`.
- i18n: four locale files, 15 shared namespaces enforced by a parity test.
- Auth is cookie based; admin routes are guarded client side (server still owns real authorization).
- E2E tests run against the production build with a route-intercepted mock API (no real backend in CI).
- A demo dataset + read-only server (`npm run demo:serve`, port 8787) supports offline work.

## Implemented capabilities (evidenced in code)

- Catalog browsing with server paged shop grid, plus client side subcategory filtering over a cached catalog and URL synced filters.
- Cart, checkout, order success, order history and details, wishlist, notifications, profile.
- Login, registration, forgot password with OTP verification flow.
- Admin CRUD: products (multipart image upload), orders, users, carts, server paged admin tables with search/sort.
- Four locale parity for 15 shared namespaces, RTL support for Arabic.

## Known limitations

- No backend in this repo; the app depends on an external API or the local demo server.
- Admin coupons, reviews, wishlists, and reports are static demo data with no services behind them.
- The users admin API returns the whole list; paging/filtering is client side only.
- Product rating is deferred: the API supports `sort=rating` but the app has no rating render path.
- Large webp marketing images are not yet optimized (no image CLI found in the environment; see audit report).
- Localized text for namespaces outside the parity checked set can drift between locales.
- The Playwright e2e suite has pre-existing failures on the storefront, checkout, wishlist, and admin specs. It is not wired into CI until it is green.

## Unknown / not documented (do not assume)

- Product roadmap and release plan.
- Deployment ownership beyond what `vercel.json` and `deploy-pages.yml` imply.
- Server side authorization guarantees.
- Performance or accessibility budgets.
