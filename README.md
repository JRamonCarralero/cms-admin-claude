> [Leer en español](README.es.md)

# CMS Admin — GDG Aranjuez

Single-page administration tool for managing GDG Aranjuez community events. Authenticated administrators can create and manage events together with all their associated sub-resources: collaborators, developers, organizers, speakers, sponsors, and tracks.

The application connects to the [Community Event API](https://github.com/JRamonCarralero/cms-back-claude) and currently runs in **debug mode** — the backend ignores JWT validation, so a hardcoded fake token is used during development.

---

## Technology

| Layer           | Technology                                                 |
| --------------- | ---------------------------------------------------------- |
| UI framework    | React 19                                                   |
| Language        | TypeScript 6 — strict mode, `noImplicitAny`                |
| Bundler         | Vite 8                                                     |
| Styles          | Tailwind CSS v4 (via `@tailwindcss/vite` plugin)           |
| Package manager | pnpm                                                       |
| Routing         | React Router DOM v7 — lazy loading + Suspense              |
| Server state    | TanStack Query v5                                          |
| Global state    | Zustand v5 with `persist` middleware                       |
| Forms           | React Hook Form v7 + Zod v4 + `@hookform/resolvers`        |
| HTTP            | Axios v1 — request/response interceptors                   |
| Unit tests      | Vitest v4 + jsdom + Testing Library                        |
| Mocks           | MSW v2 (node for unit tests, browser for E2E)              |
| E2E tests       | Playwright v1.60 + `@axe-core/playwright`                  |
| Linting         | ESLint 10 + typescript-eslint                              |
| Formatting      | Prettier                                                   |
| Git hooks       | Husky v9 + lint-staged (pre-commit: ESLint fix + Prettier) |

---

## Project Structure

```
src/
  app/                  Router, ProtectedRoute, PageLoader
  components/
    layout/             AppShell, Sidebar, Header
    ui/                 Design-system components (Avatar, Badge, Button,
                        EmptyState, ErrorMessage, Input, Modal, Pagination,
                        Skeleton, Spinner, Table, Tabs, Toast)
  features/
    auth/               Login form, useAuth hook, authStore (Zustand + persist)
    events/             Events CRUD + EventDetailPage dashboard hub
    persons/            Persons CRUD + usePersonsList shared hook
    collaborators/      Event sub-resource (requires person_id)
    developers/         Event sub-resource (requires person_id)
    organizers/         Event sub-resource (requires person_id)
    speakers/           Event sub-resource (requires person_id)
    sponsors/           Event sub-resource (no person_id)
    tracks/             Event sub-resource (no person_id)
  lib/
    api/                Axios client, QueryClient config
    hooks/              useToastMutation — shared mutation wrapper
    utils/              formatters (formatDate, fullName)
  store/                toastStore (Zustand)
  types/                api.ts — all shared API response types
mocks/
  browser.ts            MSW browser worker (activated in E2E mode)
  server.ts             MSW node server (unit tests)
  data/                 In-memory mock datasets per domain
  handlers/             MSW request handlers per domain
tests/
  e2e/                  Playwright test suites (auth, events)
```

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Create `.env.local` in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=CMS Admin
```

> `VITE_API_BASE_URL` is the **only** source of truth for the backend URL. There is no hardcoded fallback anywhere in the code.

### 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) and log in with the credentials below.

---

### Available commands

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Start Vite dev server (port 5173)   |
| `pnpm build`        | Type-check + production build       |
| `pnpm preview`      | Serve the production build locally  |
| `pnpm lint`         | Run ESLint                          |
| `pnpm lint:fix`     | Run ESLint with auto-fix            |
| `pnpm format`       | Format all files with Prettier      |
| `pnpm format:check` | Check formatting without writing    |
| `pnpm test`         | Run unit tests (Vitest, single run) |
| `pnpm test:watch`   | Run unit tests in watch mode        |
| `pnpm test:ui`      | Open Vitest UI                      |
| `pnpm test:e2e`     | Run E2E tests with Playwright       |

---

## Environment Variables

| Variable            | File                 | Description                                                                                  |
| ------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | `.env.local`         | Base URL for all API requests (e.g. `http://localhost:8080`)                                 |
| `VITE_APP_NAME`     | `.env.local`         | Application name                                                                             |
| `VITE_MSW`          | `.env.e2e` / runtime | Set to `"true"` to activate the MSW browser worker — loaded automatically by `pnpm test:e2e` |

---

## Key Routes

| Path                             | Page                                                | Protected |
| -------------------------------- | --------------------------------------------------- | --------- |
| `/login`                         | Login                                               | No        |
| `/events`                        | Event list                                          | Yes       |
| `/events/:eventId`               | Event detail — dashboard hub with sub-resource tabs | Yes       |
| `/events/:eventId/collaborators` | Collaborator list (standalone)                      | Yes       |
| `/events/:eventId/developers`    | Developer list (standalone)                         | Yes       |
| `/events/:eventId/organizers`    | Organizer list (standalone)                         | Yes       |
| `/events/:eventId/speakers`      | Speaker list (standalone)                           | Yes       |
| `/events/:eventId/sponsors`      | Sponsor list (standalone)                           | Yes       |
| `/events/:eventId/tracks`        | Track list (standalone)                             | Yes       |
| `/persons`                       | Person list                                         | Yes       |

All protected routes redirect to `/login` when no session token is found in the Zustand store. After login, React Router restores the originally requested URL.

---

## Testing

### Unit tests

```bash
pnpm test
```

60 tests across 16 files. No backend required — all HTTP calls are intercepted by **MSW (node mode)**. Each test suite resets the in-memory mock database in `beforeEach`.

### E2E tests

```bash
pnpm test:e2e
```

Playwright starts Vite with `--mode e2e`, which loads `.env.e2e` (`VITE_MSW=true`) and activates the **MSW browser service worker** — the backend is not needed. Tests run in Chromium and include `@axe-core/playwright` accessibility checks (WCAG 2.0 AA).

- `tests/e2e/auth.spec.ts` — login, logout, wrong credentials, axe audit on login page
- `tests/e2e/events.spec.ts` — list, create event, detail hub, tabs, edit modal, axe audit

---

## Login Credentials (debug mode)

| Field    | Value                    |
| -------- | ------------------------ |
| Email    | `admin@gdg-aranjuez.com` |
| Password | `admin123`               |

> The backend runs with `debug=true`, which skips JWT validation. A hardcoded fake JWT is generated client-side and injected by the Axios request interceptor into every API call.
