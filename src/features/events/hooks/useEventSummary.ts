import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type {
  PagedResponse,
  CollaboratorDetailResponse,
  DeveloperDetailResponse,
  OrganizerDetailResponse,
  SpeakerDetailResponse,
  SponsorResponse,
  TrackResponse,
} from '@/types/api'

function countQuery<T>(key: string[], url: string, eventId: string) {
  return {
    queryKey: [key[0], eventId, 'count'],
    queryFn: () =>
      apiClient
        .get<PagedResponse<T>>(url, { params: { page: 1, pageSize: 1 } })
        .then((r) => r.data.meta.total),
    enabled: !!eventId,
    staleTime: 1000 * 60,
  } as const
}

export function useEventSummary(eventId: string) {
  const collaborators = useQuery(
    countQuery<CollaboratorDetailResponse>(
      ['collaborators'],
      `/api/v1/events/${eventId}/collaborators/paged`,
      eventId,
    ),
  )
  const developers = useQuery(
    countQuery<DeveloperDetailResponse>(
      ['developers'],
      `/api/v1/events/${eventId}/developers/paged`,
      eventId,
    ),
  )
  const organizers = useQuery(
    countQuery<OrganizerDetailResponse>(
      ['organizers'],
      `/api/v1/events/${eventId}/organizers/paged`,
      eventId,
    ),
  )
  const speakers = useQuery(
    countQuery<SpeakerDetailResponse>(
      ['speakers'],
      `/api/v1/events/${eventId}/speakers/paged`,
      eventId,
    ),
  )
  const sponsors = useQuery(
    countQuery<SponsorResponse>(['sponsors'], `/api/v1/events/${eventId}/sponsors/paged`, eventId),
  )
  const tracks = useQuery(
    countQuery<TrackResponse>(['tracks'], `/api/v1/events/${eventId}/tracks/paged`, eventId),
  )

  return {
    collaborators: collaborators.data ?? null,
    developers: developers.data ?? null,
    organizers: organizers.data ?? null,
    speakers: speakers.data ?? null,
    sponsors: sponsors.data ?? null,
    tracks: tracks.data ?? null,
  }
}
