# Project Foundation

## Purpose

This document defines the core technical setup and shared
development conventions for the e-commerce frontend project.

The goal is to keep the project setup consistent across
all team members and avoid differences between local environments.

---

## Projects

The project consists of two frontend applications:

- Online Store
- Admin Dashboard

Both applications are part of the same e-commerce system.

---

## Tech Stack

### Core

- React
- Vite
- JavaScript
- Tailwind CSS v4

### Routing

- React Router

### API & Data

- Axios
- REST API

### State Management

- React Context API

### Forms & Feedback

- React Hook Form
- React Toastify

### Data Visualization

- Recharts

### Payments

- Stripe.js

---

## Package Installation

The project dependencies should be installed through:

```bash
npm install
```

Do not manually install dependencies that are already
defined in package.json.

When adding a new dependency:

- Discuss it with the team when appropriate.
- Install it using npm.
- Commit both package.json and package-lock.json.
- Document important architectural decisions when necessary.

---

## Environment Variables

Environment-specific values must not be hardcoded in the source code.

Use a local .env file.

Example:

```text
VITE_API_URL=
```

Never commit:

- .env
- .env.local
- .env.*.local

If an environment variable is required, add its name
and purpose to .env.example.

Example:

```text
VITE_API_URL=
```

Do not put real secrets in .env.example.

---

## API

The frontend communicates with the provided REST API.

The API base URL should be accessed through:

```js
import.meta.env.VITE_API_URL
```

Do not hardcode the API URL throughout the application.

Create a centralized Axios instance and use it for API communication.

---

## Styling

The project uses Tailwind CSS v4.

Global styles should remain centralized.

Prefer Tailwind utility classes for component-level styling.

Avoid creating separate CSS files for every component unless
there is a clear reason to do so.

---

## UI Libraries

Third-party UI/component libraries should only be added
according to the team's agreed project rules.

Potential examples include:

- shadcn/ui
- Radix UI
- Lucide React

Before adding a new library, consider:

- Does it solve a real problem?
- Is it already covered by the current stack?
- Will it introduce unnecessary complexity?
- Does it fit the project's design system?

---

## Code Quality

Every developer should:

- Keep code readable and maintainable.
- Avoid unnecessary duplication.
- Follow the agreed project structure.
- Follow the Git workflow.
- Keep commits focused.
- Run linting before creating a PR.
- Avoid committing generated or sensitive files.

---

## Related Documentation

### Architecture

See:

- [Architecture.md](Architecture.md)

### Git Workflow

See:

- [WorkFlow.md](WorkFlow.md)

### Work Management

See:

- [WorkCheck.md](WorkCheck.md)

### Current Sprint

See:

- [Week_1_Setup.md](Week_1_Setup.md)
