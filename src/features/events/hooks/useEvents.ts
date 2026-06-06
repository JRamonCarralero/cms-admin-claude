import { useQuery } from '@tanstack/react-query'
import { getEventsPaged } from '../services/eventsService'
import type { EventsPagedParams } from '../types'

export const eventsKeys = {
  all: ['events'] as const,
  paged: (params: EventsPagedParams) => ['events', 'paged', params] as const,
  detail: (id: string) => ['events', 'detail', id] as const,
}

export function useEvents(params: EventsPagedParams) {
  return useQuery({
    queryKey: eventsKeys.paged(params),
    queryFn: () => getEventsPaged(params),
  })
}
