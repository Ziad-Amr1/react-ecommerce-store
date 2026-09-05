# e-commerce-store

Frontend for the e-commerce system (online store + admin dashboard),
built with React and Vite.

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

The API base URL is read from `VITE_API_URL` in a local `.env` file.
Do not commit `.env` files.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build

## Documentation

- [docs/Architecture.md](docs/Architecture.md) — project architecture
- [docs/WorkFlow.md](docs/WorkFlow.md) — Git and GitHub workflow
- [docs/WorkCheck.md](docs/WorkCheck.md) — task and team tracking
- [docs/Project_Setup.md](docs/Project_Setup.md) — project foundation and conventions