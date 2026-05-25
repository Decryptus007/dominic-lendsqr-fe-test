# Dominic Orefuwa — Lendsqr Frontend Engineering Assessment

> **Assessment:** Lendsqr Frontend Engineer Test  
> **Candidate:** Dominic Orefuwa  
> **Repo:** [`dominic-lendsqr-fe-test`](https://github.com/decryptus007/dominic-lendsqr-fe-test)  
> **Live URL:** [https://dominic-lendsqr-fe-test.vercel.app](https://dominic-lendsqr-fe-test.vercel.app)  
> **Tech Stack:** React · TypeScript · SCSS · Vite · Vitest

---

## Overview

This project is a faithful, pixel-accurate recreation of the **Lendsqr Admin Console** built as part of the Lendsqr Frontend Engineering Assessment. It implements three core pages — **Login**, **Users (Dashboard)**, and **User Details** — against a Figma design, with a mock API serving 500 dynamically generated user records.

The goal was not just to render the design but to demonstrate production-grade frontend engineering: type-safe code, scalable SCSS architecture, async data management, optimistic UI updates, responsive design across all viewports, and a comprehensive unit test suite.

---

## Pages Implemented

| Page         | Route              | Description                                                                          |
| ------------ | ------------------ | ------------------------------------------------------------------------------------ |
| Login        | `/`                | Auth page with form validation, loading state, and redirect                          |
| Users        | `/dashboard/users` | Paginated table with filters, status badges, action menus, and mobile accordion view |
| User Details | `/users/:id`       | Full profile view with tabbed content, star tier, and status management              |

---

## Features

### Login Page

- Form validation with inline error feedback
- Loading indicator on submit
- Redirect to dashboard on success

### Users Page

- **Stats cards** — live counts for total users, active users, users with loans, users with savings
- **Data table** — sortable, paginated (5 / 10 / 20 / 50 / 100 per page), with skeleton loaders
- **Column filter** — dropdown form to filter by organisation, username, email, phone, date joined, or status
- **Row actions dropdown** — View Details, Blacklist User, Activate User; with disabled state when action is already current
- **Confirmation modal** — custom `ConfirmModal` component guards destructive/positive status changes
- **Mobile accordion view** — on tablet/mobile, the table collapses into expandable cards (no horizontal scroll)
- **2×2 compact stats grid** on mobile

### User Details Page

- Full user profile: personal info, education & employment, socials, guarantor
- **Star rating tier** displayed with FontAwesome icons
- **Tabbed navigation** across profile sections
- **Blacklist / Activate** action buttons with current-status visual feedback and confirmation modal
- Data loaded from the same mock API and cached via `userService`

---

## Tech Stack & Rationale

| Technology                          | Reason                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| **React 19 + TypeScript**           | Required by the assessment; strict typing catches errors at compile time              |
| **Vite**                            | Fastest dev server + build tool for React + TypeScript projects                       |
| **SCSS (Sass modules)**             | Required by the assessment; BEM methodology for scalable, co-located component styles |
| **React Router v7**                 | Declarative routing with nested layout support for the dashboard shell                |
| **Vitest + @testing-library/react** | Vite-native test runner; RTL aligns with React best practices for querying the DOM    |
| **FontAwesome 6 (CDN)**             | Icon library matching the Figma design system; loaded via CDN to keep the bundle lean |
| **Work Sans (Fontsource)**          | Primary typeface specified in the Figma design; self-hosted via npm for performance   |

---

## Project Structure

```
src/
├── components/
│   ├── ConfirmModal/       # Reusable confirmation dialog (danger / success variants)
│   ├── Header/             # Dashboard top bar
│   ├── Sidebar/            # Dashboard navigation sidebar
│   └── icons/              # Custom SVG icon components (filter funnel, etc.)
├── layouts/
│   └── DashboardLayout/    # Shared layout wrapping Header + Sidebar + main content
├── pages/
│   ├── Login/              # Login page + styles + tests
│   ├── Users/              # Users list page + styles + tests
│   └── UserDetails/        # User profile page + styles + tests
├── services/
│   └── userService.ts      # Async data layer: fetch, cache, and update user records
├── styles/
│   ├── _variables.scss     # Design tokens (colours, fonts, shadows, breakpoints)
│   ├── _mixins.scss        # Responsive helpers and shared utility mixins
│   └── _global.scss        # CSS reset and base styles
└── scripts/
    └── generate-mock-data.js  # Node script that generated public/mock-users.json (500 records)
```

---

## Architecture Decisions

### Mock API — `userService.ts`

Rather than calling an external service (mocky.io / json-generator), the 500-record dataset is generated once via a Node script and committed to `public/mock-users.json`. `userService.ts` fetches it on first load, caches the result in memory, and exposes typed `fetchUsers()`, `fetchUserById()`, and `updateUserStatus()` methods.

This approach means:

- **Zero external dependency** at runtime — works offline and in CI.
- **Deterministic data** — the same records on every run, making tests predictable.
- **Optimistic updates** — `updateUserStatus()` mutates the in-memory cache so the UI reflects the change instantly without a re-fetch.

### BEM + SCSS Modules

Every component owns a co-located `.scss` file. Class names follow strict BEM (`block__element--modifier`). Design tokens (colours, spacing, breakpoints) live in `_variables.scss` and are consumed via `@use` — no magic globals.

### Confirmation Modal (`ConfirmModal`)

Status changes (Blacklist / Activate) are destructive or consequential. A reusable `ConfirmModal` component intercepts these actions, presents a typed `danger` or `success` variant, and only commits the change on explicit confirmation. This pattern is consistent across both the Users table and the User Details page.

### Responsive Design

- **Desktop (>1200px):** 4-column stats grid, full data table.
- **Tablet (≤900px):** 2-column stats grid, table hidden → accordion card list shown.
- **Mobile (≤600px):** 2-column compact stats grid (2×2), stacked accordion action buttons.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9 (or npm / yarn)

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
pnpm dev
```

App will be available at `http://localhost:5173`.

### Run tests

```bash
pnpm test
```

### Build for production

```bash
pnpm build
```

Output is written to `dist/`.

---

## Testing

Unit tests are written with **Vitest** and **@testing-library/react**. They cover:

- **Login page** — form validation, error states, redirect on success.
- **Users page** — data loading, filter form, pagination, actions dropdown, confirmation modal open/cancel/confirm flows, mobile accordion expand/collapse.
- **User Details page** — data rendering, tab navigation, blacklist/activate modal flows.

Run the full suite:

```bash
pnpm test
```

---

## Submission Checklist

- [x] All 3 pages built (Login, Users, User Details)
- [x] Mock API with 500 records served from `public/mock-users.json`
- [x] User data persisted / retrieved via `userService` (in-memory cache)
- [x] Fully mobile-responsive across all breakpoints
- [x] Unit tests with positive and negative scenarios
- [x] TypeScript strict mode — zero type errors
- [ ] Deployed to `https://dominic-lendsqr-fe-test.vercel.app`
- [ ] Loom video review (≤ 3 minutes, face visible)
- [ ] Decision document published (Google Docs / Notion)
- [ ] Submission form filled and email sent to careers@lendsqr.com

---

## Design Reference

Figma: [Frontend Testing Design](https://www.figma.com/file/ZKILoCoIoy1IESdBpq3GNC/Frontend-Testing)

---

## Contact

For questions about this submission, contact: **careers@lendsqr.com**
