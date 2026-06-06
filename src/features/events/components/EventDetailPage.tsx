import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEvent } from '../hooks/useEvent'
import { useEventSummary } from '../hooks/useEventSummary'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { EventStatusBadge } from './EventStatusBadge'
import { EventForm } from './EventForm'
import { useUpdateEvent } from '../hooks/useEventMutations'
import { CollaboratorListPage } from '@/features/collaborators/components/CollaboratorListPage'
import { DeveloperListPage } from '@/features/developers/components/DeveloperListPage'
import { OrganizerListPage } from '@/features/organizers/components/OrganizerListPage'
import { SpeakerListPage } from '@/features/speakers/components/SpeakerListPage'
import { SponsorListPage } from '@/features/sponsors/components/SponsorListPage'
import { TrackListPage } from '@/features/tracks/components/TrackListPage'
import { formatDate } from '@/lib/utils/formatters'
import type { CreateEventDTO } from '../types'

export function EventDetailPage() {
  const { eventId = '' } = useParams<{ eventId: string }>()
  const [editOpen, setEditOpen] = useState(false)

  const { data: event, isLoading, isError, refetch } = useEvent(eventId)
  const summary = useEventSummary(eventId)
  const updateMutation = useUpdateEvent()

  function handleEditSubmit(formData: CreateEventDTO) {
    updateMutation.mutate({ id: eventId, data: formData }, { onSuccess: () => setEditOpen(false) })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !event) {
    return <ErrorMessage onRetry={() => refetch()} />
  }

  const tabs = [
    {
      key: 'collaborators',
      label: 'Colaboradores',
      badge: summary.collaborators,
      content: <CollaboratorListPage embedded />,
    },
    {
      key: 'developers',
      label: 'Desarrolladores',
      badge: summary.developers,
      content: <DeveloperListPage embedded />,
    },
    {
      key: 'organizers',
      label: 'Organizadores',
      badge: summary.organizers,
      content: <OrganizerListPage embedded />,
    },
    {
      key: 'speakers',
      label: 'Ponentes',
      badge: summary.speakers,
      content: <SpeakerListPage embedded />,
    },
    {
      key: 'sponsors',
      label: 'Patrocinadores',
      badge: summary.sponsors,
      content: <SponsorListPage embedded />,
    },
    {
      key: 'tracks',
      label: 'Tracks',
      badge: summary.tracks,
      content: <TrackListPage embedded />,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/events" className="hover:text-gray-900">
          Eventos
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{event.name}</span>
      </div>

      {/* Cabecera del evento */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{event.name}</h1>
              <EventStatusBadge isActive={event.is_active} />
            </div>
            <code className="self-start rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-500">
              {event.slug}
            </code>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Creado: {formatDate(event.created_at)}</span>
              <span>Actualizado: {formatDate(event.updated_at)}</span>
            </div>
          </div>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Editar evento
          </Button>
        </div>

        {/* Contadores resumen */}
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-6">
          {tabs.map((tab) => (
            <div key={tab.key} className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {tab.badge != null ? tab.badge : '—'}
              </p>
              <p className="text-xs text-gray-500">{tab.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs con contenido */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Tabs items={tabs} />
      </div>

      {/* Modal edición del evento */}
      {event && (
        <EventForm
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={handleEditSubmit}
          isLoading={updateMutation.isPending}
          initialValues={event}
        />
      )}
    </div>
  )
}
