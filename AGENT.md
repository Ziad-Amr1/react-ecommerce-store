# AGENT.md — Project Working Memory & Engineering Guardrails

## PURPOSE

This file is LOCAL-ONLY working memory for AI coding agents working on this repository.

It describes:
- the current project architecture
- established engineering decisions
- invariants that must be preserved
- team conventions
- validation requirements
- Git/PR safety rules
- rules for handling uncertainty

IMPORTANT:

This file is intentionally NOT part of the repository history.

DO NOT:
- add AGENT.md to .gitignore
- git add AGENT.md
- commit AGENT.md
- push AGENT.md
- include AGENT.md in any Pull Request
- upload AGENT.md to GitHub
- delete or overwrite AGENT.md unless explicitly instructed

The file may remain untracked locally.

==================================================
1. PROJECT OVERVIEW
==================================================

Project:
Oversea Store — E-Commerce Admin Panel

Application type:
Client-rendered React SPA.

Current stack:
- React 19
- Vite 8
- Tailwind CSS v4
- React Router v7
- Axios
- shadcn/ui-style components
- Radix UI
- Lucide React
- react-hook-form
- Recharts
- React Toastify
- i18next
- react-i18next
- ESLint
- npm

Package manager:
npm

==================================================
2. CURRENT PROJECT STRUCTURE
==================================================

Important directories:

src/
├── api/
│   └── axios.js
│
├── components/
│   ├── layout/
│   └── ui/
│
├── contexts/
│   ├── AuthContext.jsx
│   └── AuthProvider.jsx
│
├── hooks/
│   └── useAuth.js
│
├── i18n/
│   ├── index.js
│   └── locales/
│       └── en.json
│
├── pages/
│   ├── Home.jsx
│   ├── DesignSystem.jsx
│   ├── auth/
│   │   └── Login.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── Products.jsx
│       ├── Orders.jsx
│       ├── Users.jsx
│       └── Carts.jsx
│
├── ProtectedRoute.jsx
├── App.jsx
├── main.jsx
└── index.css

CI:
.github/workflows/ci.yml

==================================================
3. ROUTING CONTRACT
==================================================

Current routing contract:

/                  → Home
/design-system     → DesignSystem
/login             → auth/Login
/admin/*           → ProtectedRoute → AdminLayout

Admin routes:

/admin/
    → Dashboard

/admin/products
    → Products

/admin/orders
    → Orders

/admin/users
    → Users

/admin/carts
    → Carts

IMPORTANT:

Do not change route structure or public route paths without an explicit architectural decision.

Do not silently change:
- /admin/* → /admin
- /login
- public vs protected routes

Protected admin access must remain behind ProtectedRoute.

==================================================
4. AUTHENTICATION ARCHITECTURE
==================================================

The authentication architecture is intentionally split into three layers:

AuthContext.jsx
    ↓
AuthProvider.jsx
    ↓
useAuth.js

Responsibilities:

AuthContext.jsx:
- bare React context
- no business logic

AuthProvider.jsx:
- owns authentication state
- login
- logout
- authentication restoration
- exposes auth contract

useAuth.js:
- consumer hook
- accesses AuthContext
- should remain the normal consumer API

Current public auth contract:

user
isAuthenticated
isLoading
login
logout

IMPORTANT INVARIANTS:

Do NOT:
- create another AuthContext
- create another AuthProvider
- create another useAuth hook
- merge provider logic into unrelated files
- rename isLoading to loading without explicit approval
- remove isAuthenticated without explicit approval
- reintroduce a separate authentication implementation

There must be ONE authentication system.

==================================================
5. AUTHENTICATION MODEL
==================================================

Current authentication model:

Cookie-based authentication.

Backend manages the authenticated session/token through HttpOnly cookies.

Frontend must NOT store authentication tokens in localStorage.

Axios uses credentials appropriately.

Authentication flow:

Login:
POST /auth/login
    ↓
Backend authenticates user
    ↓
HttpOnly cookie is established
    ↓
Frontend stores user state only

Restore:
GET /auth/me
    ↓
Cookie authenticates request
    ↓
AuthProvider restores user

Logout:
POST /auth/logout
    ↓
Backend invalidates/clears session
    ↓
AuthProvider clears user state

IMPORTANT:

Do NOT return to:
- localStorage token storage
- manual Authorization: Bearer token storage
- duplicate auth flows

Backend authorization remains the actual security boundary.
Frontend ProtectedRoute is a UI/access guard, not a replacement for backend authorization.

==================================================
6. API / AXIOS ARCHITECTURE
==================================================

Shared Axios client:

src/api/axios.js

There should be ONE shared Axios client unless an explicit architectural requirement exists.

Do not create feature-local duplicate HTTP clients unnecessarily.

Current auth behavior:
- cookie credentials
- no localStorage token persistence
- no Bearer-token interceptor for auth

401 handling must actually result in correct application behavior.

Do not use a history API call that only changes the URL without triggering application/router state.

Any change to Axios authentication or 401 behavior is cross-cutting and requires extra review and validation.

==================================================
7. PROTECTED ROUTES
==================================================

ProtectedRoute is responsible for protecting admin routes.

It uses the existing auth contract:

- isLoading
- isAuthenticated
- user.role

Expected behavior:

while auth is loading:
    → loading state

unauthenticated:
    → /login

authenticated non-admin:
    → unauthorized/public destination according to current implementation

authenticated admin:
    → render protected route via Outlet

Do not bypass ProtectedRoute.

Do not hardcode:
isAuthenticated = true

Do not hardcode:
user = { role: "admin" }

Do not implement authorization based on fake frontend state.

==================================================
8. COMPONENT ARCHITECTURE
==================================================

Shared UI primitives:

src/components/ui/

Layout components:

src/components/layout/

Rules:

- Reuse existing components before creating new ones.
- Do not duplicate UI primitives.
- Do not add another component library unless explicitly approved.
- Feature-specific components should remain near their feature when practical.
- Shared components should only become shared after there is a real reuse need.
- Avoid premature abstraction.

shadcn/Radix primitives are already established and should be reused.

Prefer:
- existing Button
- existing Input
- existing Label when appropriate
- existing Dialog
- existing AlertDialog
- existing Sheet
- existing Select
- existing Checkbox
- existing Switch
- existing Tabs
- existing RadioGroup
- existing Card
- existing Badge
- existing Skeleton
- existing Table
- other existing primitives

Do not recreate these manually.

However:

Do not force shadcn abstractions where native HTML is clearer.

Example:
A correct native <label> does not need to become shadcn Label just for consistency.

==================================================
9. SEMANTIC HTML RULES
==================================================

Use semantic HTML when the element has semantic meaning.

Prefer:

<header>
<nav>
<main>
<aside>
<section>
<article>
<footer>
<ul>
<ol>
<li>
<button>
<a>
<form>

Do NOT convert every <div> automatically.

A div is valid when it is only used as:
- layout container
- flex/grid wrapper
- spacing wrapper
- positioning wrapper
- visual grouping without semantic meaning

Interactive behavior rules:

Do NOT use:
<div onClick>
<span onClick>

when the element is actually a:
- button
- link
- form control
- navigation item

Prefer native semantics first.

Do not add ARIA when native HTML already provides the required semantics.

==================================================
10. ACCESSIBILITY RULES
==================================================

Preserve and improve accessibility.

Check:
- labels
- keyboard accessibility
- focus behavior
- accessible names
- icon-only button labels
- form error association
- aria-invalid
- aria-describedby
- aria-expanded where appropriate
- aria-controls where appropriate
- aria-current
- aria-busy when state changes require it
- semantic landmarks
- heading hierarchy
- image alt text

Prefer native HTML semantics before ARIA.

Do not add ARIA blindly.

Do not modify already-correct Radix/shadcn accessibility behavior unnecessarily.

==================================================
11. DESIGN SYSTEM
==================================================

The project has an established Design System.

Important rules:

- Reuse existing semantic design tokens.
- Do not invent arbitrary colors when an existing token exists.
- Do not introduce a second visual language.
- Reuse existing spacing/radius/shadow/typography conventions.
- Reuse existing shadcn primitives.
- Do not modify design tokens casually.
- Do not redesign unrelated screens while implementing a feature.

Current brand:
Oversea Store

Do not introduce unrelated brand identities or assets.

Do not reintroduce:
Koda Commerce branding
unless explicitly requested.

==================================================
12. INTERNATIONALIZATION
==================================================

Current i18n architecture:

src/i18n/
├── index.js
└── locales/
    └── en.json

Library:
react-i18next + i18next

Current language:
English only

Current usage:

useTranslation()

and:

t("namespace.key")

User-facing strings should be externalized.

Examples:
- headings
- buttons
- labels
- placeholders
- validation messages
- user-visible errors
- loading messages
- navigation labels
- aria-label values
- tooltips

Do NOT translate:
- API endpoints
- routes
- CSS class names
- variable names
- technical identifiers
- internal developer comments
- design-token names
- internal metadata

Current en.json is the single English translation source.

Do not create duplicate locale files or duplicate i18n initialization.

Do not add Arabic/RTL support unless explicitly requested.

==================================================
13. CI
==================================================

Current CI:

.github/workflows/ci.yml

Runs on:
- pull_request → main
- push → main

Current CI checks:

npm ci
npm run lint
npm run build

CI is currently CI-only.

Do not add deployment/CD unless explicitly requested.

Do not create duplicate workflows.

Do not change CI dependencies or Node versions casually.

Any dependency change should be justified.

==================================================
14. GIT / BRANCH / PR RULES
==================================================

Branch naming convention:

week1/W1-XX-slug
week2/W2-XX-slug

For maintenance:

chore/slug

For refactoring:

refactor/slug

Commit style:
Conventional commits.

Examples:
feat:
fix:
refactor:
chore:
docs:

PR rules:
- target main unless explicitly defined otherwise
- PRs require review
- CI must be green before merge
- do not force-push unless explicitly approved
- do not rewrite shared main history
- do not bypass branch protection
- use normal GitHub PR workflow

After merge:
- update local main
- verify local main == origin/main
- verify working tree state

==================================================
15. AGENT.md SAFETY
==================================================

This file is local working memory.

NEVER:
- git add AGENT.md
- git commit AGENT.md
- git push AGENT.md
- modify .gitignore to hide AGENT.md
- upload AGENT.md to GitHub
- include AGENT.md in a PR
- delete AGENT.md because Git reports it as untracked

It is intentionally an untracked local file.

When checking the working tree, remember that an untracked AGENT.md is expected.

Do not "clean it up" unless explicitly instructed.

==================================================
16. CHANGE SAFETY PROTOCOL
==================================================

Every non-trivial change must follow this sequence.

STEP 1 — UNDERSTAND

Before editing:
- inspect current relevant files
- inspect current architecture
- inspect existing component/library usage
- inspect related routes/API contracts
- inspect existing patterns nearby

Do not rely only on memory.

Always treat the actual repository as the source of truth.

STEP 2 — IDENTIFY IMPACT

Before changing code, determine:

- Which files are affected?
- Which components consume them?
- Is the change local or cross-cutting?
- Does it affect routing?
- Does it affect auth?
- Does it affect shared components?
- Does it affect API contracts?
- Does it affect Design System?
- Does it affect i18n?
- Does it affect CI?
- Could it affect other features?

Classify:

LOCAL
LOW-RISK
CROSS-CUTTING
ARCHITECTURAL

Anything architectural or cross-cutting requires extra verification.

STEP 3 — PRESERVE INVARIANTS

Before editing, identify applicable invariants from this file.

After editing, verify every relevant invariant still holds.

Never "solve" one issue by silently breaking another subsystem.

STEP 4 — IMPLEMENT MINIMAL CHANGE

Prefer:
- smallest change that solves the requirement
- existing abstractions
- existing components
- established patterns

Avoid:
- unnecessary refactors
- broad formatting
- unrelated cleanup
- speculative abstractions
- dependency additions without need

STEP 5 — STATIC REVIEW

After implementation inspect:

git diff
git diff --check
git status

Look for:
- unrelated files
- accidental formatting
- deleted functionality
- changed routes
- changed API contracts
- duplicate components
- dead code
- unused imports
- accidental dependency changes

STEP 6 — VALIDATE

At minimum, when applicable:

npm run lint
npm run build

Run additional targeted verification when the change affects:
- routing
- authentication
- forms
- accessibility
- API integration
- i18n
- CI

STEP 7 — RECHECK ARCHITECTURE

After tests pass, ask:

- Did I introduce a duplicate architecture?
- Did I create a new abstraction that was unnecessary?
- Did I break an existing public contract?
- Did I change behavior outside the task?
- Did I create a new dependency when an existing one was sufficient?
- Did I accidentally couple unrelated features?
- Did I move code to a less appropriate layer?
- Did I change a shared component when a feature-local solution was enough?

Passing lint/build is NOT sufficient if the architecture is wrong.

STEP 8 — STOP ON AMBIGUITY

If a choice could change:
- architecture
- API contract
- authentication model
- routing contract
- state management
- shared component behavior
- dependency strategy
- deployment assumptions

STOP and ask for clarification.

Do not guess.

==================================================
17. SOURCE OF TRUTH RULE
==================================================

Priority order:

1. Current repository state
2. Explicit task instructions
3. This AGENT.md
4. Existing established project conventions
5. General engineering best practices

Git state must always be rechecked before Git operations.

Do NOT trust stale memory for:
- current commit SHA
- open PRs
- current branches
- current file contents
- latest implementation
- current dependency versions

Always inspect the live repository.

==================================================
18. FRESHNESS RULE
==================================================

Some information in this file is architectural memory.

Some repository information is dynamic.

Dynamic information MUST be re-verified before use.

Examples:

MUST re-check:
- current main SHA
- open PRs
- branch status
- current file contents
- current package versions
- current CI status

Do not treat historical examples as current Git state.

==================================================
19. ARCHITECTURAL REVIEW CHECKLIST
==================================================

Before accepting any substantial change, verify:

### Separation of concerns
- Is each responsibility in the correct layer?
- Did the change create unnecessary coupling?

### Dependency direction
- Are lower-level/shared modules avoiding dependencies on feature-specific modules?
- Is a shared component depending on a page-specific implementation unnecessarily?

### Reuse
- Does an existing component already solve this?
- Does an existing hook/service/context already exist?
- Is a new abstraction truly needed?

### State
- Is state local or genuinely global?
- Was global state introduced unnecessarily?

### Routing
- Are route contracts preserved?
- Are protected/public boundaries preserved?

### Authentication
- Is the single auth system still intact?
- Is the public auth contract still intact?
- Is authentication state still server-managed?

### UI
- Does the implementation use existing Design System conventions?
- Are shadcn primitives reused appropriately?

### Accessibility
- Is native semantic HTML used?
- Is keyboard behavior preserved?

### i18n
- Are user-facing strings translated?
- Are technical/internal strings left alone?

### Performance
- Any unnecessary renders?
- Any duplicate requests?
- Any heavy work introduced?
- Any unnecessary dependency?

### Security
- Any sensitive data exposed?
- Any client-side authorization mistaken for backend authorization?
- Any token storage introduced?
- Any unsafe HTML or user-controlled content?

### Maintainability
- Is the implementation understandable?
- Does it follow project conventions?
- Will the next developer know where this code belongs?

==================================================
20. "DO NOT BREAK THE CODEBASE" RULE
==================================================

A change is NOT considered successful merely because:

- the feature works locally
- lint passes
- build passes

A successful change must satisfy ALL of:

1. Requirement works.
2. Existing contracts remain intact.
3. Existing architecture remains coherent.
4. No unnecessary duplicate system was introduced.
5. Existing routes still work.
6. Existing auth behavior still works.
7. Existing shared components still work.
8. Existing Design System remains consistent.
9. Existing i18n architecture remains consistent.
10. CI remains valid.
11. No unrelated files were modified.
12. No hidden assumptions were introduced without being documented.

==================================================
21. WHEN WORKING ON AN EXISTING PR
==================================================

Do not automatically:
- merge it
- rebase it blindly
- resolve conflicts by choosing "ours" or "theirs"
- preserve outdated architecture just because it exists in the PR

First determine:
- what the PR is trying to achieve
- what is still valid
- what is obsolete
- whether main has changed
- whether the PR architecture is compatible with current main

If necessary:

Treat the PR as a source of intended functionality,
not necessarily as the source of architectural truth.

Current main architecture has priority.

==================================================
22. WHEN ADDING A NEW FEATURE
==================================================

Before coding:

1. Inspect existing patterns.
2. Identify nearest similar feature.
3. Reuse established components.
4. Define API/data requirements.
5. Decide local vs global state.
6. Decide where code belongs.
7. Identify i18n strings.
8. Identify accessibility requirements.
9. Identify responsive requirements.
10. Identify validation requirements.

Then implement the smallest coherent solution.

==================================================
23. FINAL PRE-COMMIT CHECKLIST
==================================================

Before committing any change:

[ ] Requirement implemented
[ ] No unrelated files modified
[ ] No duplicate architecture
[ ] Existing routes preserved
[ ] Existing auth contract preserved
[ ] Existing API boundaries preserved
[ ] Existing Design System preserved
[ ] Existing i18n architecture preserved
[ ] Semantic HTML checked
[ ] Accessibility checked
[ ] Existing components reused
[ ] npm run lint passes
[ ] npm run build passes
[ ] git diff --check passes
[ ] git diff manually reviewed
[ ] git status reviewed
[ ] No AGENT.md staged

==================================================
24. FINAL PRE-MERGE CHECKLIST
==================================================

Before merging a PR:

[ ] PR targets correct branch
[ ] PR scope is focused
[ ] No unrelated commits/files
[ ] CI is green
[ ] Lint passes
[ ] Build passes
[ ] Architecture review completed
[ ] No auth/routing regressions
[ ] No duplicate infrastructure
[ ] No unnecessary dependencies
[ ] No accidental design regressions
[ ] No unresolved ambiguity
[ ] Merge uses normal GitHub workflow

==================================================
25. CURRENT PROJECT DIRECTION
==================================================

The project is being built incrementally.

Current direction:

Foundation
    ↓
Design System
    ↓
Semantic HTML / Accessibility
    ↓
i18n foundation
    ↓
Cookie-based authentication
    ↓
Protected Admin
    ↓
CI quality gates
    ↓
Feature development
    ↓
Deployment/CD later

Do not prematurely introduce infrastructure that belongs to a later stage.

Prefer stable, understandable architecture over overengineering.

==================================================
26. FINAL PRINCIPLE
==================================================

When uncertain:

INSPECT FIRST.
UNDERSTAND IMPACT.
PRESERVE CONTRACTS.
MAKE THE SMALLEST SAFE CHANGE.
VALIDATE.
REVIEW THE DIFF.
STOP IF ARCHITECTURE IS UNCLEAR.

The repository itself is the source of truth.

Do not assume.
Do not guess.
Do not blindly merge.
Do not optimize for speed at the expense of architectural integrity.
