import { useQuery } from '@tanstack/react-query'
import { getSponsorsPaged } from '../services/sponsorsService'
import type { SponsorsPagedParams } from '../types'

export const sponsorsKeys = {
  all: ['sponsors'] as const,
  byEvent: (eventId: string) => ['sponsors', eventId] as const,
  paged: (params: SponsorsPagedParams) => ['sponsors', params.eventId, 'paged', params] as const,
}

export function useSponsors(params: SponsorsPagedParams) {
  return useQuery({
    queryKey: sponsorsKeys.paged(params),
    queryFn: () => getSponsorsPaged(params),
    enabled: !!params.eventId,
  })
}
