import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from './ProtectedRoute'
import { PageLoader } from './PageLoader'
import { LoginPage } from '@/features/auth/components/LoginPage'

const EventListPage = lazy(() =>
  import('@/features/events/components/EventListPage').then((m) => ({ default: m.EventListPage })),
)
const PersonListPage = lazy(() =>
  import('@/features/persons/components/PersonListPage').then((m) => ({
    default: m.PersonListPage,
  })),
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/events" replace /> },
          {
            path: 'events',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EventListPage />
              </Suspense>
            ),
          },
          {
            path: 'persons',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PersonListPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
])
