> [Read in English](README.md)

# CMS Admin — GDG Aranjuez

Herramienta de administración de página única (SPA) para gestionar los eventos de la comunidad GDG Aranjuez. Los administradores autenticados pueden crear y gestionar eventos junto con todos sus sub-recursos asociados: colaboradores, desarrolladores, organizadores, ponentes, patrocinadores y tracks.

La aplicación se conecta a la [Community Event API](https://github.com/JRamonCarralero/cms-back-claude) y actualmente funciona en **modo debug** — el backend omite la validación del JWT, por lo que se usa un token falso predefinido durante el desarrollo.

---

## Tecnología

| Capa               | Tecnología                                                 |
| ------------------ | ---------------------------------------------------------- |
| Framework UI       | React 19                                                   |
| Lenguaje           | TypeScript 6 — modo estricto, `noImplicitAny`              |
| Bundler            | Vite 8                                                     |
| Estilos            | Tailwind CSS v4 (plugin `@tailwindcss/vite`)               |
| Gestor de paquetes | pnpm                                                       |
| Routing            | React Router DOM v7 — lazy loading + Suspense              |
| Estado servidor    | TanStack Query v5                                          |
| Estado global      | Zustand v5 con middleware `persist`                        |
| Formularios        | React Hook Form v7 + Zod v4 + `@hookform/resolvers`        |
| HTTP               | Axios v1 — interceptores de petición/respuesta             |
| Tests unitarios    | Vitest v4 + jsdom + Testing Library                        |
| Mocks              | MSW v2 (node para unit tests, browser para E2E)            |
| Tests E2E          | Playwright v1.60 + `@axe-core/playwright`                  |
| Linting            | ESLint 10 + typescript-eslint                              |
| Formato            | Prettier                                                   |
| Git hooks          | Husky v9 + lint-staged (pre-commit: ESLint fix + Prettier) |

---

## Estructura del proyecto

```
src/
  app/                  Router, ProtectedRoute, PageLoader
  components/
    layout/             AppShell, Sidebar, Header
    ui/                 Componentes del sistema de diseño (Avatar, Badge, Button,
                        EmptyState, ErrorMessage, Input, Modal, Pagination,
                        Skeleton, Spinner, Table, Tabs, Toast)
  features/
    auth/               Formulario de login, hook useAuth, authStore (Zustand + persist)
    events/             CRUD de eventos + EventDetailPage (hub de gestión)
    persons/            CRUD de personas + hook compartido usePersonsList
    collaborators/      Sub-recurso de evento (requiere person_id)
    developers/         Sub-recurso de evento (requiere person_id)
    organizers/         Sub-recurso de evento (requiere person_id)
    speakers/           Sub-recurso de evento (requiere person_id)
    sponsors/           Sub-recurso de evento (sin person_id)
    tracks/             Sub-recurso de evento (sin person_id)
  lib/
    api/                Cliente Axios, configuración de QueryClient
    hooks/              useToastMutation — wrapper compartido de mutaciones
    utils/              Formateadores (formatDate, fullName)
  store/                toastStore (Zustand)
  types/                api.ts — tipos de respuesta de API compartidos
mocks/
  browser.ts            Worker MSW para el navegador (modo E2E)
  server.ts             Servidor MSW para Node (tests unitarios)
  data/                 Datasets mock en memoria por dominio
  handlers/             Manejadores de peticiones MSW por dominio
tests/
  e2e/                  Suites de tests Playwright (auth, events)
```

---

## Primeros pasos

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar el entorno

Crea `.env.local` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=CMS Admin
```

> `VITE_API_BASE_URL` es la **única** fuente de verdad para la URL del backend. No hay ninguna URL hardcodeada en el código.

### 3. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:5173](http://localhost:5173) e inicia sesión con las credenciales indicadas al final.

---

### Comandos disponibles

| Comando             | Descripción                                           |
| ------------------- | ----------------------------------------------------- |
| `pnpm dev`          | Inicia el servidor de desarrollo Vite (puerto 5173)   |
| `pnpm build`        | Verificación de tipos + build de producción           |
| `pnpm preview`      | Sirve el build de producción localmente               |
| `pnpm lint`         | Ejecuta ESLint                                        |
| `pnpm lint:fix`     | Ejecuta ESLint con corrección automática              |
| `pnpm format`       | Formatea todos los ficheros con Prettier              |
| `pnpm format:check` | Comprueba el formato sin escribir                     |
| `pnpm test`         | Ejecuta los tests unitarios (Vitest, ejecución única) |
| `pnpm test:watch`   | Ejecuta los tests unitarios en modo watch             |
| `pnpm test:ui`      | Abre la interfaz gráfica de Vitest                    |
| `pnpm test:e2e`     | Ejecuta los tests E2E con Playwright                  |

---

## Variables de entorno

| Variable            | Fichero              | Descripción                                                                                                |
| ------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | `.env.local`         | URL base para todas las peticiones a la API (p. ej. `http://localhost:8080`)                               |
| `VITE_APP_NAME`     | `.env.local`         | Nombre de la aplicación                                                                                    |
| `VITE_MSW`          | `.env.e2e` / runtime | Poner a `"true"` para activar el worker MSW en el navegador — se carga automáticamente con `pnpm test:e2e` |

---

## Rutas principales

| Ruta                             | Página                                           | Protegida |
| -------------------------------- | ------------------------------------------------ | --------- |
| `/login`                         | Login                                            | No        |
| `/events`                        | Lista de eventos                                 | Sí        |
| `/events/:eventId`               | Detalle de evento — hub con tabs de sub-recursos | Sí        |
| `/events/:eventId/collaborators` | Lista de colaboradores (standalone)              | Sí        |
| `/events/:eventId/developers`    | Lista de desarrolladores (standalone)            | Sí        |
| `/events/:eventId/organizers`    | Lista de organizadores (standalone)              | Sí        |
| `/events/:eventId/speakers`      | Lista de ponentes (standalone)                   | Sí        |
| `/events/:eventId/sponsors`      | Lista de patrocinadores (standalone)             | Sí        |
| `/events/:eventId/tracks`        | Lista de tracks (standalone)                     | Sí        |
| `/persons`                       | Lista de personas                                | Sí        |

Todas las rutas protegidas redirigen a `/login` si no hay token de sesión en el store de Zustand. Tras el login, React Router restaura la URL solicitada originalmente.

---

## Tests

### Tests unitarios

```bash
pnpm test
```

60 tests en 16 ficheros. No se requiere backend — todas las peticiones HTTP son interceptadas por **MSW (modo node)**. Cada suite restablece la base de datos mock en memoria en `beforeEach`.

### Tests E2E

```bash
pnpm test:e2e
```

Playwright inicia Vite con `--mode e2e`, que carga `.env.e2e` (`VITE_MSW=true`) y activa el **service worker MSW en el navegador** — no se necesita backend. Los tests se ejecutan en Chromium e incluyen auditorías de accesibilidad con `@axe-core/playwright` (WCAG 2.0 AA).

- `tests/e2e/auth.spec.ts` — login, logout, credenciales incorrectas, auditoría axe en login
- `tests/e2e/events.spec.ts` — lista, crear evento, hub de detalle, tabs, modal de edición, auditoría axe

---

## Credenciales de acceso (modo debug)

| Campo      | Valor                    |
| ---------- | ------------------------ |
| Email      | `admin@gdg-aranjuez.com` |
| Contraseña | `admin123`               |

> El backend funciona con `debug=true`, lo que omite la validación del JWT. Se genera un JWT falso en el cliente y el interceptor de Axios lo inyecta en cada petición a la API.
