# e-commerce-store

A React 19 e-commerce storefront and admin dashboard: product catalog,
cart, wishlist, checkout, orders, authentication, i18n with RTL Arabic,
SEO tags, and CI deploys to Vercel and GitHub Pages.

## Features

**Storefront**

- Landing page with hero, featured products, categories, promotional
  banner, and newsletter signup
- Product catalog with search, filters, sorting, and product details
  with reviews
- Cart, wishlist, checkout, and order flow
- Authentication: login, registration with email OTP, and forgot
  password
- Profile overview, notifications, and order history

**Admin dashboard**

- Dashboard with real statistics (revenue, orders, customers, top
  products)
- Product management with full CRUD and details
- Orders, users, and carts management

**Platform**

- i18n with four locales (English, Arabic, French, Russian) and a full
  right to left layout for Arabic
- SEO head tags on every public page, including local geo metadata;
  admin pages are `noindex`
- Light and dark theme
- Maintenance mode, enabled at build time

## Stack

- React 19 + Vite 8 (JavaScript)
- Tailwind CSS v4
- React Router v7
- i18next / react-i18next
- Axios
- shadcn-style UI primitives (Radix UI + `class-variance-authority`,
  `clsx`, `tailwind-merge`) in `src/components/ui`

## Getting started

```bash
npm install
npm run dev
```

In local development the app talks to the backend API. By default it uses
the backend URL built into `src/api/axios.js`. You can override it with
`VITE_API_URL` in a local `.env` file. That file is not tracked, so create
it if you need one. Never commit `.env` files.

### Local demo API

A read only demo catalog is bundled for offline work:

```bash
npm run demo:validate   # validate the dataset
npm run demo:serve      # serve a read only API on 127.0.0.1:8787
```

Then, in another terminal:

```bash
VITE_API_URL=http://127.0.0.1:8787 npm run dev
```

See [docs/catalog/SEED_DATA.md](docs/catalog/SEED_DATA.md) for the demo
API contract.

## Project structure

```text
src/
├── api/           # shared Axios client
├── components/    # layout and reusable UI primitives
├── contexts/      # auth, cart, notifications
├── features/      # feature-scoped code (admin, auth, cart, landing, products, profile)
├── hooks/         # shared custom hooks
├── i18n/          # i18next setup and locales
├── lib/           # small shared helpers
├── pages/         # route-level components
├── utils/         # pure helpers (formatting, asset URLs)
├── App.jsx        # route tree
└── main.jsx       # entry point
```

See [docs/Architecture.md](docs/Architecture.md) for the full picture.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run test` — run the unit test suite (Vitest)
- `npm run test:e2e` — run the Playwright end to end suite
- `npm run preview` — preview the production build
- `npm run demo:validate` — validate the local demo dataset
- `npm run demo:serve` — serve the read only demo API on 127.0.0.1:8787

## How the API base URL is resolved

The shared client in `src/api/axios.js` resolves the base URL in this order:

1. `VITE_API_URL`, when set (for example the local demo API)
2. `/api` in production builds (the same origin proxy on Vercel)
3. the default backend URL

On the Vercel deploy the frontend therefore calls its own `/api` path, and
the `vercel.json` rewrite forwards it to the backend. Do not set
`VITE_API_URL` to the raw backend URL in the Vercel project. Keep it unset,
or set it to `/api`. A raw backend URL makes the browser call the backend
directly and hit a CORS block.

## Deployment

The app deploys from `main` to two hosts.

### Vercel

Live at https://oversea-ecommerce-store.vercel.app

`vercel.json` rewrites `/api/:path*` to the backend API and adds an
`Access-Control-Allow-Origin` header for the GitHub Pages origin, so the
static deployment can use the same proxy.

### GitHub Pages

Live at https://ziad-amr1.github.io/react-ecommerce-store/

Built and deployed by `.github/workflows/deploy-pages.yml`:

- The build sets `VITE_BASE_PATH=/react-ecommerce-store/` (Vite base URL and
  router basename) and `VITE_API_URL=https://oversea-ecommerce-store.vercel.app/api`
  so Pages calls the Vercel `/api` proxy.
- `dist/index.html` is copied to `404.html` so deep links reload the SPA.
- Public assets resolve through `assetUrl()` in `src/utils/assetUrl.js`,
  which prefixes the deployment base, so images such as `logo.webp` work on
  both hosts.

## Continuous integration

The `CI` workflow runs lint and the production build on every push and pull
request to `main`. The `Deploy to GitHub Pages` workflow builds and deploys
the Pages site.

## Maintenance mode

Set `VITE_MAINTENANCE_MODE=true` at build time to show the maintenance page
(`src/pages/Maintenance.jsx`) instead of the app. The page also exists at
`/maintenance`.

## Documentation

- [docs/Architecture.md](docs/Architecture.md) — project architecture
- [docs/WorkFlow.md](docs/WorkFlow.md) — Git and GitHub workflow
- [docs/WorkCheck.md](docs/WorkCheck.md) — task and team tracking
- [docs/Project_Setup.md](docs/Project_Setup.md) — project foundation and conventions
- [docs/catalog/SEED_DATA.md](docs/catalog/SEED_DATA.md) — demo dataset and API contract