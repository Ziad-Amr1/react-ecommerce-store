# Next Phase Roadmap — UI Polish, Store Shell, Tables, Typography, Catalog Data

> Source of truth for the post-foundation phase.
> Baseline: main `d68ca69980c9e34f224834141c13aefcbaced921` (PRs #38–#52 merged; main is authoritative).
> Companion doc: [`DATA_TABLE_GUIDELINES.md`](DATA_TABLE_GUIDELINES.md).

---

## 1. Philosophy & non-negotiable constraints

- Current main is the source of truth. Older docs and branches are reference material only.
- Every change is a small, focused, reviewable PR to `main` — no giant PRs, no squash/rebase on shared branches, no force-push.
- New strings go into `src/i18n/locales/en.json` only.
- No new dependencies unless a real gap exists (all needed primitives already exist: `Button`, `Card`, `Badge`, `DropdownMenu`, `Tooltip`, `Separator`, `Sheet`, `Switch`, `Table`, `Pagination`, `Avatar`).
- No banned image sources (`placehold.co`, `pravatar.cc`, external mock URLs).
- No fake API contracts. No dead-but-clickable controls — anything not backed by a route/API is a disabled placeholder with a "coming soon" tooltip (existing `ComingSoonButton` pattern).
- Logical utilities only (`text-start`/`text-end`, `start-*`/`end-*`, `ms-*`/`me-*`, `rtl:` variants). No physical left/right for layout meaning.
- Do **not** modify: `src/pages/DesignSystem.jsx`, `docs/personal/*`, `AGENT.md`, `src/i18n/locales/ar.json` (local, partial, untracked).

### Local-only integrity note

`AGENT.md`, `src/i18n/locales/ar.json`, and 2 locally-modified files
(`src/features/admin/dashboard/components/OrderStatus.jsx`, `TopProducts.jsx`) exist in the working tree.
They are **not** to be committed, pushed, or merged with any roadmap branch.

---

## 2. Architecture baseline (current main)

| Area | State |
|---|---|
| Routing | `src/App.jsx` — `/` (Landing), `/design-system` (lazy), auth pages, `/admin/*` behind `ProtectedRoute` + `AdminLayout`, `*` NotFound. Components/layout: `AdminLayout`, `Sidebar`, `AdminHeader`, `HeaderActionButtons`. |
| Storefront | Landing page: `src/pages/landing/` (Landing, hook, service, 11 components, 10 webp assets). Storefront chrome exists since P1: storefront routes share `StoreLayout` — sticky `StoreHeader` (brand, placeholder nav, theme toggle via `useTheme`, role-gated Admin link, inert account/cart placeholders with coming-soon tooltips) + `StoreFooter` (blurb, placeholder link groups, copyright). Auth & admin layouts untouched. |
| i18n | `i18next` registers **only `en`** (`fallbackLng: en`). `DirectionProvider` sets `documentElement.dir/lang` from `i18n.language`. No switch UI, no persistence, no `changeLanguage` wiring. `ar.json` is a 295-byte local stub (dashboard-only) and untracked. |
| Theme | `useTheme()` hook, per-instance state, `localStorage.theme`, `data-theme=dark`. No global provider. `index.css` maps all tokens + shadcn aliases, both light/dark. RTL custom variant `rtl` defined. |
| Auth | `AuthContext/AuthProvider`: `{ user, isAuthenticated, isLoading, login, logout }`. `user` carries identity (`fullName`/`name`, `email`, `avatar`, `role`) — see `getUserIdentity`. `ProtectedRoute` gates admin by `role === "admin"`. |
| Data tables | `Table` primitive supports `density` (40/48/56px). `RecentOrders` is the compliant reference. `ProductsTable` exists (compact) but has gaps (see §6). Orders/Users/Carts/Settings pages are `FeatureStatusCard` placeholders. |
| Typography | Google Fonts: Space Grotesk (display), Inter (body), IBM Plex Mono (mono). `tabular-nums` is a Tailwind utility used ad hoc. |
| Products/API | `GET /products` (page, limit 10, search, category, brand, min/maxPrice, sort price_asc/price_desc/rating; active only). CRUD via `features/admin/products/product.service.js`. Product fields: name, shortDescription, description, price, discountPrice, stock, category, subcategory, brand, sku, tags, featured, isActive, images(1–5). Stock thresholds 20 ok / 5 warning. |

---

## 3. Audit results by area

### A. Store landing page — evaluated
Strong baseline: i18n everywhere, loading/error/empty states with retry, honest disabled CTAs, `end-*`/`rtl:` usage, theme-aware.
Scheduled polish (no urgent breakage):

- **Section rhythm**: spacing is irregular (`mt-16` vs `py-16` vs `my-10`, hero `py-10` + pros `mt-8`). Unify onto one vertical-rhythm convention.
- **`select-none` on the Newsletter section** covers the email `Input` — blocks copy/paste; remove or scope it off the field.
- **`capitalize` utility on English-authored headings** (`Hero`, section titles) is Latin-centric and meaningless in RTL/Arabic; remove and author strings ready-cased.
- **Hero hierarchy**: `h1` and `h2` are both `text-2xl lg:text-4xl`; give the sub-line a smaller size so one heading leads.
- **Banner overlay** `bg-linear-to-r from-black/55` is physical-directional; keep as decorative but confirm legibility in RTL (acceptable if text sits on the dark side in both).
- **Separators**: none needed in the body. Spacing alone separates hero/featured/categories/banner/newsletter. Meaningful separator use is limited to the shell header/footer hairlines (see P1). Do not sprinkle `Separator` into sections without a reason.

### B. Store header / footer — decision: build a temporary shell now
There is no store-level chrome anywhere. Create a single **temporary, presentational `StoreLayout`** (header + `<Outlet/>` + footer) used only by storefront routes. It is deliberately dumb — no providers, no business logic — so the future real `StoreLayout` can replace it in place without deleting a parallel layout architecture. See P1 for scope.

### C. Language switcher — decision: implement plumbing + control now, Arabic later
Switching "works" architecturally (`DirectionProvider` already syncs `dir`/`lang`), but only `en` has committed translations and nothing persists a choice. Implement the plumbing + persisted preference + `changeLanguage` now, enumerating **only locales with committed resources** (`en`). No fake second language is ever presented or selectable, so the visible control stays inert until a real `ar.json` resource is committed (approval needed later — the current `ar.json` is a partial untracked stub and must not be shipped).

### D. Profile UI branch — decision: **TAKE UI SELECTIVELY** (rebuild, do not merge)
`origin/feature/profile-page` was audited from archive. Not mergeable as-is:

- Broken imports — `pages/Profile.jsx` imports `../components/profile/*` but components live in `features/profile/*` (tip does not build).
- Pre-dates current conventions: hardcoded English (no `t()`), mock data (`24` orders, `18` wishlist, pravatar.cc avatar, `placehold.co` images), no `useAuth` wiring.
- Non-RTL physical classes (`sm:text-left`/`sm:text-right`).
- Assumes unavailable APIs (orders/wishlist/addresses/payment methods have no consumer endpoints in the current contract).

Reusable *only as layout patterns*: page composition (header card + left sidebar nav + main column), section heading (title + muted description), stat tiles, info-tile grid, order-card row. Rebuild those patterns against current conventions with data limited to what auth/there-is_today_real reveals (identity, avatar, email), and render the rest as disabled/empty placeholders.

### E. Data-table compliance gaps
`ProductsTable` (vs `DATA_TABLE_GUIDELINES.md`):

| Guideline | Status in `ProductsTable` |
|---|---|
| Text `text-start`, numeric `text-end` (+ headers) | ✅ |
| Hairline border, row hover, no zebra | ✅ |
| Density documented & set (`compact` 40px) | ✅ (document row in the guidelines table) |
| `—` vs zero vs loading | ✅ |
| Truncation + accessible tooltip on long text | ✅ (name, focusable) |
| Numeric never truncates | ⚠️ stock cell lacks `whitespace-nowrap` (price has it) |
| Actions revealed on hover/focus + touch kebab; no always-visible icon | ❌ always-visible Eye/Pencil/Trash |
| Sort indicator only on active column | ➖ no column sorting (sort is a select — OK, do not fabricate) |
| Sticky when warranted | ➖ 6 cols, not warranted |
| Page: title + description + controls + table + pagination as table footer | ❌ no page description; pagination is a separate centered div below the card |

`RecentOrders` is fully compliant (the reference). The guidelines' own audit table needs a `ProductsTable` row added.

### F. Numeric typography — findings
No project-wide numeric convention. `tabular-nums` (Tailwind) already exists and is used ad hoc. Current mix:
`StatCard` (font-display + tabular-nums) ✅ · `TopProducts` revenue (tabular-nums) ✅ · Products price (font-display + tabular-nums) ✅ · Products stock (font-mono) · Landing prices (font-mono) · Pagination indicator (font-mono) · Order id (font-display).
Recommendation: one convention — currency/counts/percentages → `tabular-nums`; large emphasis numbers use `font-display`; identifiers/codes may use `font-mono`. Apply consistently, no new font dependency. Optionally a one-line semantic utility; not required.

### G. Product / catalog data
- No seed mechanism exists in this repo (products live server-side). The schema/API surface is captured in `features/admin/products`.
- Category list is **not** an API: the API filters by raw `category` strings; the landing renders 6 static tiles (`electronics, homeLiving, accessories, sunglasses, beauty, fashion`) with local webp.
- Goal: a realistic demo dataset with real variety — furniture, lighting, home decor, kitchen, office, accessories, electronics, beauty, fashion, sunglasses — with meaningful variance in price, stock (below/above thresholds), discount, `featured`, rating, names/descriptions.
- Constraint: no production writes, no schema/contract changes. Deliverable = authored dataset (+ optional dev-only seeding script that targets a **local/dev** API URL only, with a documented procedure and never prod credentials).

---

## 4. Recommended PR sequence

Dependency graph, then ordered list.

```text
P1 StoreShell ──► P2 Language ──► P3 NumericTypography ──► P4 DataTables
      │                              │
      └──► P5 ProfileOverview   ┌────┘
                               ▼
              P6 LandingPolish ◄── P4
P7 CatalogSeed (independent — schedule last)
```

P1.5 (Admin header cleanup) has no hard dependencies — schedule it right after P1
(so `/` is the established storefront root) and before/parallel to P2.

### P1 — Storefront shell (header + footer) — **DONE**
- **Status**: **DONE — PR #47 `feat/store-shell`** (base main `dca2d30`; head `43b6982`). Lint/build/diff-check clean; browser smoke suite green (40/40: LTR/RTL, light/dark, desktop/mobile, keyboard focus, admin-gated link, auth/admin/design-system untouched). **Merged to `main` as `3161e8e` (normal merge commit, 2026-09-09).**
- **Goal**: temporary store layout giving the storefront consistent chrome; replaces nothing; removable later with zero fallout.
- **Pre-P1 state**: `/` rendered a bare `<main>`; no store header/footer in any branch; `/admin/*` already owns its own `AdminLayout` (untouched).
- **Missing**: a layout for storefront routes.
- **Dependencies**: none.
- **Affected**: `src/App.jsx` (wrap storefront routes in `StoreLayout`); new `src/components/layout/StoreLayout.jsx` (+ `StoreHeader`, `StoreFooter`); `en.json` (`store.*`/`footer.*` keys); remove now-dead `src/pages/Home.jsx` + `home.*` i18n block (no imports remain); update `docs/WorkCheck.md`/`docs/Architecture.md` store-feature lines if trivially stale.
- **Separate PR**: yes.
- **Risk**: low–medium (new route nesting; must not touch auth or admin).
- **Validation**: lint + build + diff-check; manual LTR/RTL, light/dark, mobile (collapsible nav vs horizontal scroll); confirm admin/auth pages unchanged; a11y (header landmarks, nav semantics, focus).
- **Expected outcome**: landing + future storefront routes share a sticky header (brand via `brand.*`, placeholder nav, theme toggle reusing `useTheme`, inert account/cart placeholders with coming-soon tooltips) and a footer (blurb, placeholder link groups in `start-*` RTL-safe layout, copyright year). No business logic, no new global state.

### P1.5 — Admin header navigation cleanup (Logout → "Back to Store" + Account dropdown) — **DONE**
- **Status**: **DONE — PR #50 `feat/toast-sonner-admin-header`** (base main `0f05ce2`; commits: `0d0f7c8` Sonner migration, `a457581` header cleanup, `5897ce7` docs, `5740ee5` theme fix). Lint/build/diff-check clean; browser smoke green (18/18: Back to Store, Account identity/role/Logout, no duplicate nav, keyboard flow, theme toggle, error + success toasts, dark theme, mobile) plus theme smoke green (34/34, re-run on merged main). Bundles the approved **Sonner toast migration** — react-toastify fully removed (decision in §5) — and the **dark-theme bootstrap + shared reactive `useTheme` store** (resolves the ProtectedRoute loader follow-up). **Merged to `main` as `b0713d6` (normal merge commit, 2026-09-10).**
- **Goal**: rebalance admin header actions — a single **"Back to Store"** action replaces the standalone Logout as primary navigation, and **Logout moves into the Account dropdown** as a secondary account-level action. Preserve the theme toggle and all other existing header actions.
- **Current state (post PR #50)**: `HeaderActionButtons` renders notifications → theme toggle → Account dropdown (identity + role + separator + Logout) plus an outline "Back to Store" button navigating to `/`. Account trigger is always visible so Logout stays reachable on mobile. Sidebar remains the sole admin nav; no duplicate logout or navigation responsibility.
- **Missing**: a storefront-root link; logout is promoted as primary-visibility instead of account-scoped.
- **Dependencies**: none hard (→ `/` is already the landing route). Recommended right after P1 so `/` is the established storefront root; can run before/parallel to P2.
- **Affected**: `src/components/layout/HeaderActionButtons.jsx`; `en.json` (`navigation.backToStore`; reuse `auth.logout.*` for the menu item); target `/`. Account dropdown uses existing `DropdownMenuSeparator` + `DropdownMenuItem` (primitive confirmed).
- **Separate PR**: yes.
- **Risk**: low.
- **Validation**: lint/build/diff-check; click "Back to Store" → `/`; open Account → Logout item runs `handleLogout` with `isLoggingOut`/`Loader2` + `role="alert"` error preserved; keyboard nav on both menus; LTR/RTL, light/dark; theme toggle + notifications unchanged; Sidebar untouched (it stays the sole admin nav).
- **Expected outcome**: header actions read as notifications → theme toggle → Account (identity, with Logout inside). No duplicate logout, no duplicate navigation responsibility: "Back to Store" is the only storefront-nav action, logout exists only in the Account menu.

### P2 — Language switcher
- **Status**: **DONE — PR #52 `feat/language-switcher`** (base main `9dfe6b9`; commits: `5cbc298` i18n plumbing, `e5f1468` switcher control, docs commit). Lint/build/diff-check clean; browser smoke green — shipped state 7/7 (absent/invalid/stored language → `en`/`ltr`, switcher hidden on storefront + admin, `dir`/`lang` stable) and a second-locale roundtrip 11/11 (temporary committed-style `de` fixture, fully reverted before commit: stored choice cold-loads, menu lists only committed locales, switch updates `dir`/`lang` + persists across reload). Nothing fake ships — the shipped bundle contains only `en`. **Merged to `main` as `d68ca69` (normal merge commit, 2026-09-10).**
- **Goal**: prepare the language plumbing — a persisted user preference, i18n bootstrap, and a `changeLanguage` path — so visible switching is trivial once a **real** second locale exists. Never invent, present, or select a locale that has no committed resource.
- **Current state**: plumbing shipped — `src/i18n/index.js` derives `supportedLanguages` from committed resources only, bootstraps the stored preference (missing/invalid → `en`), and `setLanguage()` switches + persists. `LanguageSwitcher` renders in the store header and stays inert (renders nothing) while only one real locale exists; it activates automatically as soon as a real resource is committed. `DirectionProvider` behavior unchanged.
- **Missing**: a real committed locale resource (e.g. full `ar` — approval needed; the local stub stays untracked). That is the only thing keeping visible switching from being actionable.
- **Dependencies**: P1 (header host).
- **Affected**: `src/i18n/index.js` (read stored lng, expose switch), new `src/components/i18n/LanguageSwitcher.jsx` (or under `components/layout/`), `StoreHeader`, `en.json` (`languages.*`), `docs` note.
- **Separate PR**: yes.
- **Risk**: low (isolated; keep `DirectionProvider` behavior).
- **Validation**: lint/build/diff-check; switch en→(if any second language later)→en; verify `documentElement.dir/lang`, RTL flip, persisted across reload.
- **Expected outcome**: plumbing + persistence land and stay inert today. The control renders nothing (or a single locked label) until a real `ar` (or other) resource is committed — only then does visible switching become meaningful, using the same shipping code. Optionally surface the control in the admin header later (out of scope here unless trivial).

### P3 — Numeric typography
- **Goal**: one numeric convention across surfaces.
- **Current state**: `tabular-nums` used ad hoc; font choice for numbers varies (font-display vs font-mono).
- **Missing**: consistent convention + application.
- **Dependencies**: none.
- **Affected**: `src/index.css` (optional 1-line semantic utility or a documented class combo — keep it minimal), plus touch-ups in `StatCard`, `TopProducts`, `ProductsTable`, `RecentOrders` (already mostly correct), landing prices/pagination/product-details (align to convention), `docs/ui/NUMERIC_TYPOGRAPHY.md` (short reference) or a section in the roadmap.
- **Separate PR**: yes.
- **Risk**: low.
- **Validation**: lint/build/diff-check; visual pass (aligned columns in tables, stat cards stable in both themes).
- **Expected outcome**: numbers never shift width while updating; one written convention future code follows. No new font dependency.

### P4 — Data-table compliance (Products table)
- **Goal**: bring `ProductsTable` into full compliance + update the guidelines audit row.
- **Current state**: gaps per §6/E (actions visibility, pagination, page description, stock cell nowrap).
- **Missing**: hover/focus action reveal + touch kebab (`DropdownMenu`), pagination integrated as table-footer UI (consider the existing `components/ui/pagination.jsx` primitive), page description under title, `whitespace-nowrap` on numeric cells, numeric class convention from P3.
- **Dependencies**: P3 (class convention); otherwise independent.
- **Affected**: `src/features/admin/products/components/ProductsTable.jsx`, `ProductPagination.jsx`, `src/pages/admin/Products.jsx`; `docs/ui/DATA_TABLE_GUIDELINES.md` (audit table + document density choices).
- **Separate PR**: yes.
- **Risk**: low–medium (behavior of delete row-state and empty state must not regress).
- **Validation**: lint/build/diff-check; manual keyboard (focus reveal), touch (kebab), pagination keyboard nav, empty/loading/error states; `RecentOrders` unchanged.
- **Expected outcome**: table passes every guideline; actions quiet unless hovered/focused; pagination reads as part of the table.

### P5 — Profile overview (selective rebuild)
- **Goal**: reusable, presentation-only `/profile` (storefront) using only real auth data.
- **Current state**: no profile page on main; old branch is unusable (see §3/D).
- **Missing**: a rebuilt page adopting the old branch's layout patterns with current conventions.
- **Dependencies**: P1 (storefront route). P2/P3 optional but nice (control reuse, numeric counts).
- **Affected**: new `src/pages/ProfileOverview.jsx` (or `features/profile/` slice), `src/App.jsx` (route under `StoreLayout`), `en.json` (`profile.*`), reuse `Avatar`/`Card`/`Badge`.
- **Separate PR**: yes.
- **Risk**: medium — decide and document the anonymous-visitor behavior (login prompt card vs ProtectedRoute) and that all fake-metric/order sections render as honest empty/disabled placeholders until APIs exist.
- **Validation**: lint/build/diff-check; LTR/RTL, light/dark, mobile (sidebar becomes horizontal scroll), authenticated + anonymous states.
- **Expected outcome**: profile overview showing identity/avatar/email from `useAuth`, with account-stats and orders sections as empty states, and vertical tabs/sidebar as disabled placeholders.

### P6 — Landing polish pass
- **Goal**: unify rhythm, RTL/typo cleanups; no new sections.
- **Current state**: see §3/A.
- **Missing**: spacing consistency, `select-none` scope fix, no `capitalize` on authored strings, hero sub-line size, RT-friendly banner gradient confirmation, micro a11y (section labels).
- **Dependencies**: P1 (frame), P3 (numeric).
- **Affected**: `src/pages/landing/` (Landing.jsx + LandingHero, Newsletter, PromotionalBanner, FeaturedProducts/Categories headers value), `en.json` (string casing edits).
- **Separate PR**: yes.
- **Risk**: low.
- **Validation**: lint/build/diff-check; before/after screenshot review in both themes and directions; verify newsletter input remains selectable.
- **Expected outcome**: landing with one consistent vertical rhythm that keeps the store shell chrome balanced; no dead controls introduced.

### P7 — Catalog seed dataset (documentation + dev-only seeding)
- **Goal**: a realistic multi-category dataset for dev/demo/testing.
- **Current state**: no seed mechanism in repo; dev DB is electronics-heavy; categories are raw strings (no endpoint).
- **Missing**: authored dataset + safe dev-seeding path.
- **Dependencies**: none (schedule last so it can reference the final category conventions from P1–P6).
- **Affected**: new `docs/catalog/SEED_DATA.md` + `data/demo-products.json` (~48–60 items, documented variance across price/stock thresholds/discount/featured/rating/names/descriptions, covering furniture, lighting, home decor, kitchen, office, accessories, electronics, beauty, fashion, sunglasses); optional `scripts/seed-dev.mjs` that targets **local/dev only** and documents the procedure.
- **Separate PR**: yes.
- **Risk**: low (code-less except an opt-in dev script); medium ownership/safety if the script exists — no prod credentials, no schema changes, dry-run flag.
- **Validation**: dataset lint (schema/fields allow-listed), dry-run + local-only run; nothing writes to production.
- **Expected outcome**: one command/guide to load a varied demo catalog locally; landing featured rail and admin tables look real.

---

## 5. Decisions already made

- Store shell **is needed now**, as a single dumb temporary `StoreLayout` (storefront routes only). Auth and admin layouts remain untouched.
- Language switch — **CONFIRMED**: prepare the i18n **plumbing/persistence architecture now**; **never invent or ship a fake second locale**; only **committed/real locale resources** may become selectable; **do not expose a misleading language choice when only `en` exists** — the visible control stays inert (renders nothing / single locked label); a real second-language switch becomes active only once a real locale resource (e.g. full `ar.json`) is committed. **Landed in PR #52.**
- Admin header (P1.5) — **CONFIRMED**: **"Back to Store" replaces the standalone Logout** and navigates to the storefront `/`; **Logout moves into the Account dropdown**; account-level actions (Logout) live only inside the Account dropdown, never as primary navigation; preserve theme toggle + other header actions; use i18n keys (en.json only) and logical direction-aware utilities; no duplication of account/navigation responsibilities (Sidebar stays the sole admin nav). **Landed in PR #50.**
- Toast system — **CONFIRMED**: standardize on **Sonner** as the single toast system; **react-toastify removed** (PR #50). `Toaster` mounts in `src/components/ui/toaster.jsx`, theme-synced via `useTheme`, appearance mapped to semantic design tokens in `src/index.css` (`.app-sonner[data-sonner-toaster][data-sonner-theme]` — outranks sonner's runtime CSS, follows app `data-theme`). No dual-toast stack: new code must `import { toast } from "sonner"` only.
- Theme bootstrap — **CONFIRMED/DONE**: `data-theme` is applied pre-React by an inline `<head>` script in `index.html` (reads `localStorage.theme`; `"dark"` → attribute set during HTML parse; light default for missing/invalid; no system-preference). `useTheme` is a single module-scoped reactive store via `useSyncExternalStore` — unchanged public API `{ theme, toggleTheme }`, same storage key/values, **no ThemeProvider**. All consumers (headers + Sonner toaster) subscribe to the one store, so toasts re-theme on toggle. Resolves the "ProtectedRoute loader dark-theme" follow-up (PR #50, merged as `b0713d6`).
- Profile branch: **TAKE UI SELECTIVELY** — never merge `origin/feature/profile-page` as-is.
- No new dependencies for P1–P7; no changes to `DesignSystem.jsx`; no `cn`/utility duplication; no new global state (theme via `useTheme` — no context, no `ThemeProvider`; the single shared store is internal to the hook, public API stays `{ theme, toggleTheme }`).
- Landing needs **no body separators**; hairline chrome belongs to the shell.
- Seed data is evt-based/docs + dev-only script; never touches production.
- **Resolved**: dead-code removal (`src/pages/Home.jsx` + `home.*` i18n keys) folds into P1.

## 6. Open questions (require approval before the related PR)

1. **Arabic resource**: commit a full `ar.json` resource (the current local stub is dashboard-only and untracked, so it cannot ship)? Until then the switcher plumbing ships but stays inert — with P2, the plumbing now ships (PR #52); this decision alone gates visible switching. Decide before visible switching is a goal. (P2)
2. **`/profile` auth model**: open with a login-prompt card for anonymous visitors, or gate behind storefront authentication once customers can log in? (P5)
3. **Seed images**: bundle canonical webp assets and upload them through the dev script, or reference stable existing image URLs, or defer images in the first seed drop? (P7)
4. **Theme sharing**: keep `useTheme` per-instance (recommended) vs promote to a `ThemeProvider` context later — flag before any PR touches `index.css`.
5. ~~Dead-code removal~~ (`Home.jsx` + `home.*` keys): **Resolved** — folding into P1.

## 7. Definition of done (all PRs)

- `npm run lint`, `npm run build`, `git diff --check` — all clean.
- Feature-scoped diff; only `en.json` is edited (never `ar.json`); no `DesignSystem.jsx` changes; `AGENT.md`/`docs/personal/*` untouched.
- LTR + RTL, light + dark, and mobile verified for every touched surface.
- No new dependencies, no banned image sources, no fake contracts, no dead-but-clickable controls. (Toast exception — the Sonner swap for react-toastify in PR #50 is the approved single exception; new toast code must use `sonner` only.)
- Locale list derives from **committed resources only**; no uncommitted/fake locale is ever presented or selectable.
- Each PR documented (title/why/files) and merged to `main` with a normal merge commit; roadmap's "Current state" updated as PRs land.

## 8. Execution order (recommended)

1. ✅ `feat/store-shell` (P1) — **DONE (PR #47, merged as `3161e8e`)** → 2. ✅ P1.5 `feat/toast-sonner-admin-header` (no deps — PR #50, includes Sonner toast migration + theme bootstrap; merged as `b0713d6`) → 3. ✅ `feat/language-switcher` (P2 — PR #52, merged as `d68ca69`) → 4. `refactor/numeric-typography` (P3) → 5. `refactor/data-table-compliance` (P4) → 6. `feat/profile-overview` (P5) → 7. `feat/landing-polish` (P6) → 8. `docs/catalog-seed-data` (P7).

Recorded follow-up items (do not disturb the P1–P7 order above; schedule where they best fit, likely folded into a nearby PR or as tiny isolated PRs):

- **Scrollbar colors (CSS)**: add themed scrollbar colors to `src/index.css` — `scrollbar-color`/`scrollbar-width` (plus `::-webkit-scrollbar*` if needed) so track/thumb respect both light and dark themes. CSS-only, no new dependencies, no `DesignSystem.jsx` changes.
- **ProtectedRoute loader dark-theme** — **DONE (resolved in PR #50, merged as `b0713d6`)**: the loader only appeared light because `data-theme` wasn't applied until the first `useTheme` consumer mounted (ProtectedRoute's async loader renders before any consumer). Fixed by the pre-React `<head>` bootstrap in `index.html` (accepted values: `"light"`/`"dark"` only; light default; no system-preference) plus the shared reactive `useTheme` store. Verified dark on cold load while `/auth/me` is pending (34/34 theme smoke, re-run on merged main).