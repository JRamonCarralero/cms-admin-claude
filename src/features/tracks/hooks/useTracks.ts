import { useQuery } from '@tanstack/react-query'
import { getTracksPaged } from '../services/tracksService'
import type { TracksPagedParams } from '../types'

export const tracksKeys = {
  all: ['tracks'] as const,
  byEvent: (eventId: string) => ['tracks', eventId] as const,
  paged: (params: TracksPagedParams) => ['tracks', params.eventId, 'paged', params] as const,
}

export function useTracks(params: TracksPagedParams) {
  return useQuery({
    queryKey: tracksKeys.paged(params),
    queryFn: () => getTracksPaged(params),
    enabled: !!params.eventId,
  })
}
