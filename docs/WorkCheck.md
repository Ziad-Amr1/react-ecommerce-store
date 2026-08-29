# Work Management

## Purpose

This document tracks team ownership, current tasks,
and progress across the project.

The assignments should be agreed upon by the team before
implementation begins.

---

## Team

| ID | Member | Area | Responsibility | Status |
|---|---|---|---|---|
| 1 | TBD | TBD | TBD | Pending |
| 2 | TBD | TBD | TBD | Pending |
| 3 | TBD | TBD | TBD | Pending |
| 4 | TBD | TBD | TBD | Pending |
| 5 | TBD | TBD | TBD | Pending |
| 6 | TBD | TBD | TBD | Pending |
| 7 | TBD | TBD | TBD | Pending |
| 8 | TBD | TBD | TBD | Pending |
| 9 | TBD | TBD | TBD | Pending |
| 10 | TBD | TBD | TBD | Pending |
| 11 | TBD | TBD | TBD | Pending |
| 12 | TBD | TBD | TBD | Pending |
| 13 | TBD | TBD | TBD | Pending |
| 14 | TBD | TBD | TBD | Pending |

---

## Status

Use:

- Pending
- Todo
- In Progress
- In Review
- Done
- Blocked

---

## Areas

Possible project areas:

- Foundation
- Infrastructure
- Authentication
- Products
- Cart
- Wishlist
- Checkout
- Orders
- Profile
- Admin
- Shared UI
- Testing
- Documentation

---

## Week 1

### Foundation

- [ ] Project setup
- [ ] Tailwind setup
- [ ] ESLint
- [ ] Folder structure
- [ ] Environment variables
- [ ] Shared UI foundation

### Infrastructure

- [ ] Axios instance
- [ ] API base URL
- [ ] Authentication interceptor
- [ ] AuthContext
- [ ] Protected routes
- [ ] Admin authorization

### Admin

- [ ] Admin layout
- [ ] Sidebar
- [ ] Navigation
- [ ] Login
- [ ] Login validation
- [ ] Dashboard
- [ ] Revenue stats
- [ ] Orders count
- [ ] Customers count

---

## Task Format

Each task should have:

- Task
- Owner
- Branch
- Status
- Dependencies
- PR

Example:

| Task | Owner | Branch | Status | Dependency | PR |
|---|---|---|---|---|---|
| Admin Login | TBD | feature/admin-login | Todo | AuthContext | TBD |
| Sidebar | TBD | feature/admin-sidebar | Todo | Layout | TBD |
| Dashboard Stats | TBD | feature/dashboard-stats | Todo | Axios/Auth | TBD |

### Rules

- Every task must have one primary owner.
- A task can have collaborators.
- Do not duplicate ownership.
- Keep tasks small enough to review.
- Update status when work progresses.
- Mark blockers explicitly.
- Link the task to its Pull Request when possible.

### Dependencies

When a task depends on another task, document it.

Example:

```text
AuthContext
    ↓
Protected Routes
    ↓
Admin Layout
    ↓
Dashboard
```

### Weekly Review

At the end of each week:

- Review completed tasks.
- Review blocked tasks.
- Identify unfinished work.
- Identify dependencies for the next week.
- Update ownership if necessary.
