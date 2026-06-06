import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from './ProtectedRoute'
import { PageLoader } from './PageLoader'
import { LoginPage } from '@/features/auth/components/LoginPage'

const EventListPage = lazy(() =>
  import('@/features/events/components/EventListPage').then((m) => ({ default: m.EventListPage })),
)
const EventDetailPage = lazy(() =>
  import('@/features/events/components/EventDetailPage').then((m) => ({
    default: m.EventDetailPage,
  })),
)
const PersonListPage = lazy(() =>
  import('@/features/persons/components/PersonListPage').then((m) => ({
    default: m.PersonListPage,
  })),
)
const CollaboratorListPage = lazy(() =>
  import('@/features/collaborators/components/CollaboratorListPage').then((m) => ({
    default: m.CollaboratorListPage,
  })),
)
const DeveloperListPage = lazy(() =>
  import('@/features/developers/components/DeveloperListPage').then((m) => ({
    default: m.DeveloperListPage,
  })),
)
const OrganizerListPage = lazy(() =>
  import('@/features/organizers/components/OrganizerListPage').then((m) => ({
    default: m.OrganizerListPage,
  })),
)
const SpeakerListPage = lazy(() =>
  import('@/features/speakers/components/SpeakerListPage').then((m) => ({
    default: m.SpeakerListPage,
  })),
)
const SponsorListPage = lazy(() =>
  import('@/features/sponsors/components/SponsorListPage').then((m) => ({
    default: m.SponsorListPage,
  })),
)
const TrackListPage = lazy(() =>
  import('@/features/tracks/components/TrackListPage').then((m) => ({
    default: m.TrackListPage,
  })),
)

function wrap(element: React.ReactElement) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

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
          { path: 'events', element: wrap(<EventListPage />) },
          { path: 'events/:eventId', element: wrap(<EventDetailPage />) },
          { path: 'events/:eventId/collaborators', element: wrap(<CollaboratorListPage />) },
          { path: 'events/:eventId/developers', element: wrap(<DeveloperListPage />) },
          { path: 'events/:eventId/organizers', element: wrap(<OrganizerListPage />) },
          { path: 'events/:eventId/speakers', element: wrap(<SpeakerListPage />) },
          { path: 'events/:eventId/sponsors', element: wrap(<SponsorListPage />) },
          { path: 'events/:eventId/tracks', element: wrap(<TrackListPage />) },
          { path: 'persons', element: wrap(<PersonListPage />) },
        ],
      },
    ],
  },
])
