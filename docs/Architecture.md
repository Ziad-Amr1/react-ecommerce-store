# Architecture

## Overview

The project follows a feature-oriented frontend architecture
with shared application infrastructure.

The goal is to keep feature-specific code close together while
keeping reusable infrastructure and UI components centralized.

---

## Project Structure

```bash
src/
│
├── api/
│   └── axios.js
│
├── components/
│   ├── layout/
│   └── ui/
│
├── config/
│   └── navigation.js
│
├── contexts/
│   ├── AuthContext.jsx
│   ├── AuthProvider.jsx
│   ├── CartContext.jsx
│   ├── CartProvider.jsx
│   ├── NotificationContext.jsx
│   └── NotificationProvider.jsx
│
├── features/
│   ├── admin/
│   │   ├── components/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   └── users/
│   ├── auth/
│   ├── cart/
│   ├── landing/
│   ├── products/
│   └── profile/
│
├── hooks/
│   ├── useApiAvailability.js
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useNotifications.js
│   └── useTheme.js
│
├── i18n/
│   ├── index.js
│   └── locales/          # en, ar, fr, ru
│
├── lib/
│   └── utils.js
│
├── pages/
│   ├── admin/            # Dashboard, Products, Orders, Users, Carts, Categories, Reviews, Wishlists, Coupons, Reports, Settings
│   └── auth/             # Login, Registration, ForgetPassword, VerifyOtp
│
├── utils/
│   ├── assetUrl.js
│   ├── formatCurrency.js
│   ├── formatDate.js
│   └── formatNumber.js
│
├── App.jsx
├── index.css
├── main.jsx
├── ProtectedRoute.jsx   # admin guard (auth + admin role)
└── RequireAuth.jsx      # customer guard (auth only)
```

## Directory Responsibilities

### `api/`

The centralized shared HTTP client.

Contains a single Axios instance used for all API communication. Its base
URL resolves from the build environment in this order: `VITE_API_URL` when
set, otherwise `/api` in production builds (the Vercel rewrite proxy), or
the default backend URL in local development.

Feature code should not create its own Axios instances or scatter
requests across components.

---

### `components/`

Reusable components shared across multiple features.

```text
components/
├── layout/
└── ui/
```

### `components/layout/`

Application-level layout components.

Examples:

- AdminLayout
- Sidebar
- AdminHeader

---

### `components/ui/`

Reusable generic UI components.

Examples:

- Button
- Card
- Input
- Badge
- Skeleton
- Dialog

Feature-specific components should not be placed here
unless they are genuinely reusable across features.

---

### `config/`

App-level configuration consumed by components.

Example:

- `navigation.js` — admin navigation items used by the sidebar.

---

### `contexts/`

Global application state using React Context API.

Currently contains three contexts used across the application:

- Auth context (AuthProvider / AuthContext), consumed through `useAuth()` in `hooks/`
- Cart context (CartProvider / CartContext), consumed through `useCart()` in `hooks/`
- Notification context (NotificationProvider / NotificationContext), consumed through `useNotifications()` in `hooks/`

Each context pairs a context object with a provider component. Shared
derived logic (for example cart totals and coupon math) lives in the
feature slice under `features/cart/`, not inside the provider.

Avoid putting local component state into Context unnecessarily.
Use Context only for state genuinely shared across the tree.

---

### `features/`

Feature-specific code.

Each feature contains code that primarily belongs to that feature,
including components, hooks, utils, and feature-local services.

Currently implemented features:

```text
features/
├── admin/
│   ├── components/      # shared admin table framework (see below)
│   ├── dashboard/
│   ├── orders/
│   ├── products/
│   └── users/
├── auth/
├── cart/
├── landing/
├── products/
└── profile/
```

The admin slice has one shared table framework that Products, Orders, and
Users build on: `useAdminServerTable` (fetch, debounce, params, abort) plus
`SortableTableHeader`, `AdminTableFooter`, `AdminTableEmptyState`,
`AdminErrorState`, `TableSkeletonRows`, `RowActionsMenu`, and
`AdminPageHeader`. Prefer these over new per page table code. The order
status colors have one source of truth, `ORDER_STATUS_PRESENTATION` in
`features/admin/orders/constants.js`, used by both the orders badge and the
dashboard.

Note: the admin Categories, Coupons, Reports, Reviews, and Wishlists pages
are mock pages that do not yet use this framework. They are pending a
migration and are out of scope for the current guidelines.

A feature may contain:

- Components
- Feature-local services (e.g., `auth.service.js`)
- Hooks (feature-scoped hooks stay here, e.g., `useDashboard`)
- Constants
- Utils

Do not move code into components/ just because it is a component.
Move it there only when it is shared or reusable.

---

### `hooks/`

Reusable custom React hooks shared across the application.

Currently:

- `useAuth()` — auth state from the Auth context
- `useCart()` — cart state from the Cart context
- `useNotifications()` — notifications from the Notification context
- `useTheme()` — theme handling
- `useApiAvailability()` — availability probe used by feature status cards

A hook that is only relevant to one feature should preferably
remain inside that feature (e.g., `useDashboard` lives in
`features/admin/dashboard/`).

---

### `i18n/`

Internationalization setup (i18next).

Contains:

- `index.js` — i18next configuration
- `locales/` — translation files

The app ships four locales: `en`, `ar`, `fr`, and `ru`. Arabic drives the
right-to-left layout through the `rtl` custom variant, so new UI must use
logical utilities (`ps`, `pe`, `text-start`, `text-end`, `ms`, `me`) rather
than physical ones. Locale key parity is enforced by `src/test/i18nLocales.test.js`.

---

### `lib/`

Small shared helpers.

Currently:

- `utils.js` — `cn()` class-name merge helper for UI components.

---

### `pages/`

Route-level components.

A page represents a screen that can be reached through routing.

Currently:

```text
pages/
├── admin/        # Dashboard, Products (+Add/Edit/Details), Orders, Users, Carts, Categories, Reviews, Wishlists, Coupons, Reports, Settings
├── auth/         # Login, Registration, ForgetPassword, VerifyOtp
├── About.jsx
├── Cart.jsx
├── CategoriesStore.jsx
├── Checkout/     # Checkout.jsx
├── Contact.jsx
├── DesignSystem.jsx
├── HelpCenter.jsx
├── Landing.jsx
├── Maintenance.jsx
├── MyOrders.jsx
├── Notifications.jsx
├── NotFound.jsx
├── OrderDetails.jsx
├── OrderSuccess.jsx
├── Privacy.jsx
├── ProductDetails.jsx
├── Profile.jsx
├── ShippingReturns.jsx
├── Shop.jsx
└── Wishlist.jsx
```

Pages should compose features and shared components rather than
contain large amounts of reusable business logic.

---

### `utils/`

Pure reusable helper functions.

Currently:

- `assetUrl.js` — resolves a public asset path against the deployment base
- `formatCurrency.js`
- `formatDate.js`
- `formatNumber.js`

Avoid putting API calls or React components here.

---

## Application root and routing

Routing is defined in `src/App.jsx` using React Router v7, with a
top-level `Routes` tree that includes the `/design-system` route and
the protected `/admin/*` section.

Route-level lazy loading is used for the Design System page
(`React.lazy` + `Suspense`) so it is fetched only when navigating to
`/design-system`.

`src/ProtectedRoute.jsx` guards the `/admin/*` section:

- Redirects unauthenticated visitors to the login page.
- Blocks non-admin users from admin routes.

`src/RequireAuth.jsx` guards the authenticated customer routes
(`/my-orders`, `/wishlist`, `/notifications`):

- Redirects unauthenticated visitors to the login page, preserving the
  intended path so login can return them there.
- Allows any authenticated user, with no role check.

Public storefront routes (`/`, `/products`, `/products/:id`,
`/categories`, `/cart`, `/profile`, `/about`, `/privacy`, `/help`,
`/shipping`, `/contact`) are not guarded. `/profile` renders its own
login prompt for anonymous visitors instead of redirecting.

`src/main.jsx` is the application entry point: it mounts the auth
provider and the router.

`src/index.css` holds the global styles (Tailwind CSS v4) and the
project's design tokens. Tailwind CSS remains the primary styling
approach.

## Application Flow

### Authentication

```text
Login Page
    ↓
Auth Service
    ↓
API
    ↓
AuthContext
    ↓
Application
```

### Protected Admin Routes

```text
User
 ↓
Router
 ↓
Authenticated?
 ├── No  → Login
 └── Yes
       ↓
    Admin?
     ├── No  → Block / Redirect
     └── Yes → Admin Dashboard
```

## API Flow

```text
Component / Feature
        ↓
Feature service (feature-local)
        ↓
Shared api client (src/api/axios)
        ↓
REST API
        ↓
Response
        ↓
Feature / Hook (local state) or Context (auth)
        ↓
UI
```

## Dependency Direction

Prefer dependencies to flow toward shared infrastructure
rather than creating circular dependencies.

Example:

```text
Foundation
    ↓
Infrastructure
    ↓
Authentication
    ↓
Protected Routes
    ↓
Admin Layout
    ↓
Dashboard
```

## Store Features

### Currently implemented

- Storefront landing (`/` — hero, featured rail, categories, newsletter)
- Storefront catalog (`/products` and `/products/:id`)
- Cart (`/cart`)
- Profile overview (`/profile` — landing/hero section shows profile header + activity; anonymous visitors get a login-prompt card)
- Authenticated customer pages (`/my-orders`, `/wishlist`, `/notifications`, guarded by `RequireAuth`)
- About (`/about`)
- Authentication (login, registration, forgot-password, OTP verification)
- Design System reference page (`/design-system`)
- i18n with four locales (`en`, `ar`, `fr`, `ru`) and RTL support
- SEO head component (`src/components/SEO`) that renders title, description, canonical, Open Graph, and local geo tags on every page; admin pages are `noindex`
- Maintenance mode page (`/maintenance`), shown when `VITE_MAINTENANCE_MODE=true` at build time
- Deployment to Vercel and GitHub Pages (details in the README)
- Admin section
  - Dashboard with real statistics (revenue, orders, customers, top products)
  - Products with real CRUD + details
  - Orders (real data, with payment method and payment status), Users, Carts
  - Mock only admin pages pending real data: Categories, Coupons, Reports, Reviews, Wishlists

### Planned / not yet implemented

- Checkout and payments
- Real wishlist and notification backends (the pages currently use local state)
- Admin: moving the mock pages (Categories, Coupons, Reports, Reviews, Wishlists) onto the shared table framework

Do not document features above as implemented until they exist.

## Architecture Rules

- Prefer feature ownership over arbitrary file placement.
- Keep shared components truly reusable.
- Avoid duplicated API logic.
- Keep global state limited to genuinely global concerns.
- Keep route-level components focused on composition.
- Do not create folders until there is a real need.
- Avoid circular dependencies.
- Discuss major architectural changes with the team.
