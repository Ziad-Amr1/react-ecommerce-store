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
├── assets/
│
├── components/
│   ├── layout/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── wishlist/
│   ├── checkout/
│   ├── orders/
│   ├── profile/
│   └── admin/
│
├── contexts/
│
├── hooks/
│
├── services/
│
├── pages/
│
├── routes/
│
├── utils/
│
├── styles/
│
└── App.jsx
```

## Directory Responsibilities

### `assets/`

Static assets used by the application.

Examples:

- Images
- Icons
- Fonts
- Other static resources

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

- Header
- Footer
- Sidebar
- Page layout

---

### `components/ui/`

Reusable generic UI components.

Examples:

- Button
- Input
- Modal
- Badge
- Spinner
- Card

Feature-specific components should not be placed here
unless they are genuinely reusable across features.

---

### `features/`

Feature-specific code.

Each feature should contain code that primarily belongs
to that feature.

Examples:

```text
features/
├── auth/
├── products/
├── cart/
└── checkout/
```

A feature may contain:

- Components
- API-related logic
- Hooks
- Helpers
- Types/models if needed

Do not move code into components/ just because it is a component.
Move it there only when it is shared or reusable.

---

### `contexts/`

Global application state using React Context API.

Examples:

- AuthContext
- CartContext
- WishlistContext

Avoid putting local component state into Context unnecessarily.

### `hooks/`

Reusable custom React hooks.

Examples:

- useAuth()
- useCart()
- useDebounce()

A hook that is only relevant to one feature should preferably
remain inside that feature.

### `services/`

Communication with external systems.

Examples:

```text
services/
├── api/
└── auth/
```

API requests should not be scattered randomly across UI components.

### `pages/`

Route-level components.

A page represents a screen that can be reached through routing.

Examples:

```text
pages/
├── auth/
├── products/
├── cart/
├── checkout/
├── orders/
├── profile/
└── admin/
```

Pages should compose features and shared components rather than
contain large amounts of reusable business logic.

### `routes/`

Application routing and route protection.

Responsibilities include:

- Route definitions
- Protected routes
- Admin-only routes
- Authentication-based redirects

### `utils/`

Pure reusable helper functions.

Examples:

- Formatting
- Validation helpers
- Data transformation
- Small utility functions

Avoid putting API calls or React components here.

### `styles/`

Global styling and design-system-related styles when needed.

Tailwind CSS remains the primary styling approach.

---

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
Service / Axios
        ↓
REST API
        ↓
Response
        ↓
Feature / Context
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

The Online Store includes:

- Home
- Authentication
- Products
- Product Details
- Reviews
- Cart
- Wishlist
- Checkout
- Stripe
- Orders
- Profile
- Admin Features

The Admin Dashboard includes:

- Dashboard
- Products CRUD
- Product Images
- Orders
- Users
- Charts

## Architecture Rules

- Prefer feature ownership over arbitrary file placement.
- Keep shared components truly reusable.
- Avoid duplicated API logic.
- Keep global state limited to genuinely global concerns.
- Keep route-level components focused on composition.
- Do not create folders until there is a real need.
- Avoid circular dependencies.
- Discuss major architectural changes with the team.
