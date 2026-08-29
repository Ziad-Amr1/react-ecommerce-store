# Git Workflow

## Purpose

This document defines how the team works with Git and GitHub.

The goal is to keep `main` stable and make parallel development
safe for the entire team.

---

## Main Rules

- Do not push directly to `main`.
- Every feature or fix must use a separate branch.
- Pull Requests are required before merging into `main`.
- Pull Requests should be reviewed before merging.
- Keep commits small and focused.
- Do not commit secrets.
- Do not commit generated dependencies such as `node_modules`.

---

## Branch Naming

Use:

```text
<type>/<name>
```

### Branch Types

#### feature

```text
feature/<name>
```

Examples:

```text
feature/auth-login
feature/product-list
feature/admin-sidebar
feature/dashboard-stats
```

#### fix

```text
fix/<name>
```

Examples:

```text
fix/login-validation
fix/sidebar-responsive
fix/cart-quantity
```

#### refactor

```text
refactor/<name>
```

Examples:

```text
refactor/api-client
refactor/auth-context
```

#### chore

```text
chore/<name>
```

Examples:

```text
chore/update-dependencies
chore/configure-eslint
```

---

## Commit Naming

Use:

```text
<type>(<scope>): <subject>
```

`scope` is optional.

### Commit Types

#### feat

A new feature.

```text
feat(login): add login page
feat: add product filtering
```

#### fix

A bug fix.

```text
fix(auth): handle expired token
fix(cart): prevent negative quantity
```

#### refactor

Code restructuring without changing behavior.

```text
refactor(api): centralize axios client
refactor(products): extract product card
```

#### chore

Project/tooling/configuration changes.

```text
chore: configure eslint
chore: update dependencies
```

#### style

Styling changes that do not change application behavior.

```text
style: update product layout
```

#### docs

Documentation changes.

```text
docs: update project setup
```

---

## Development Workflow

### 1. Update main

Before starting new work:

```bash
git checkout main
git pull origin main
```

### 2. Create a Branch

```bash
git checkout -b feature/<name>
```

Example:

```bash
git checkout -b feature/auth-login
```

### 3. Work on the Feature

Make focused changes.

Check the project regularly:

```bash
git status
```

### 4. Commit

```bash
git add .
git commit -m "feat(login): add login page"
```

Keep commits focused.

Avoid commits such as:

- `update`
- `final`
- `changes`
- `test`
- `done`

### 5. Push

For the first push:

```bash
git push -u origin feature/<name>
```

For subsequent pushes:

```bash
git push
```

### 6. Create a Pull Request

Open a Pull Request from:

```text
feature/<name>
```

to:

```text
main
```

### 7. Review

The PR should be reviewed before merging.

The reviewer should check:

- Functionality
- Code quality
- Naming
- Architecture
- Unnecessary duplication
- Responsive behavior
- Error/loading states
- Potential regressions

### 8. Merge

After approval and passing checks:

```text
feature branch
      ↓
Pull Request
      ↓
Review
      ↓
Merge
      ↓
main
```

---

## Pull Request Guidelines

A PR should:

- Have a clear title.
- Explain what changed.
- Explain why it changed when necessary.
- Mention related issues/tasks.
- Be reasonably small.
- Include screenshots for important UI changes.

---

## Keeping Your Branch Updated

Before creating a PR, update your branch if main
has changed significantly.

One possible workflow:

```bash
git checkout main
git pull origin main
git checkout feature/<name>
git merge main
```

Resolve conflicts carefully.

---

## Important

Never use:

```bash
git push --force
```

on shared branches unless the team explicitly agrees
and understands the consequences.

Never push secrets, API keys, passwords, or .env files.
