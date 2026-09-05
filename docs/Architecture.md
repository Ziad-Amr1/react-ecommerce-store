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
│   └── AuthProvider.jsx
│
├── features/
│   ├── admin/
│   │   └── dashboard/
│   └── auth/
│
├── hooks/
│   ├── useAuth.js
│   └── useTheme.js
│
├── i18n/
│   ├── index.js
│   └── locales/
│
├── lib/
│   └── utils.js
│
├── pages/
│   ├── admin/
│   └── auth/
│
├── utils/
│   ├── formatCurrency.js
│   └── formatNumber.js
│
├── App.jsx
├── index.css
├── main.jsx
└── ProtectedRoute.jsx
```

## Directory Responsibilities

### `api/`

The centralized shared HTTP client.

Contains a single Axios instance configured from the environment
(`VITE_API_URL`) and used for all API communication.

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

Currently contains the Auth context used across the application:

- AuthProvider
- AuthContext
- `useAuth()` lives in `hooks/`

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
│   └── dashboard/
└── auth/
```

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
- `useTheme()` — theme handling

A hook that is only relevant to one feature should preferably
remain inside that feature (e.g., `useDashboard` lives in
`features/admin/dashboard/`).

---

### `i18n/`

Internationalization setup (i18next).

Contains:

- `index.js` — i18next configuration
- `locales/` — translation files

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
├── admin/       # Dashboard, Products, Orders, Users, Carts
├── auth/        # Login, Registration, ForgetPassword, VerifyOtp
├── DesignSystem.jsx
└── Home.jsx
```

Pages should compose features and shared components rather than
contain large amounts of reusable business logic.

---

### `utils/`

Pure reusable helper functions.

Currently:

- `formatCurrency.js`
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

- Home
- Authentication (login, registration, forgot-password, OTP verification)
- Design System reference page (`/design-system`)
- Admin section
  - Dashboard with real statistics (revenue, orders, customers, top products)
  - Products / Orders / Users / Carts admin routes exist but currently
    show placeholder content pending their real features

### Planned / not yet implemented

- Storefront catalog (Products, Product Details, Reviews)
- Cart
- Wishlist
- Checkout & Stripe payments
- Orders & Profile (customer-facing)
- Admin: full Products CRUD, product images, order/users management, charts

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
