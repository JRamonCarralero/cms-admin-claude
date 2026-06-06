import { Link, useParams } from 'react-router-dom'
import { useEvent } from '../hooks/useEvent'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EventStatusBadge } from './EventStatusBadge'

const SUB_RESOURCES = [
  {
    path: 'collaborators',
    label: 'Colaboradores',
    icon: '🤝',
    description: 'Personas que colaboran en la organización técnica.',
  },
  {
    path: 'developers',
    label: 'Desarrolladores',
    icon: '💻',
    description: 'Equipo de desarrollo del evento.',
  },
  {
    path: 'organizers',
    label: 'Organizadores',
    icon: '📋',
    description: 'Equipo organizador del evento.',
  },
  { path: 'speakers', label: 'Ponentes', icon: '🎤', description: 'Speakers y charlas.' },
  {
    path: 'sponsors',
    label: 'Patrocinadores',
    icon: '🏢',
    description: 'Empresas y organizaciones patrocinadoras.',
  },
  { path: 'tracks', label: 'Tracks', icon: '🗓️', description: 'Salas y agendas del evento.' },
]

export function EventDetailPage() {
  const { eventId = '' } = useParams<{ eventId: string }>()
  const { data: event, isLoading, isError, refetch } = useEvent(eventId)

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

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/events" className="hover:text-gray-900">
            Eventos
          </Link>
          <span>/</span>
          <span className="text-gray-900">{event.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">{event.name}</h1>
          <EventStatusBadge isActive={event.is_active} />
        </div>
        <p className="mt-1 text-sm text-gray-400 font-mono">{event.slug}</p>
      </div>

      {/* Sub-recursos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUB_RESOURCES.map((item) => (
          <Link
            key={item.path}
            to={`/events/${eventId}/${item.path}`}
            className="group flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="font-semibold text-gray-900 group-hover:text-blue-600">
                {item.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
