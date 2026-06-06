import { useQuery } from '@tanstack/react-query'
import { getDevelopersPaged } from '../services/developersService'
import type { DevelopersPagedParams } from '../types'

export const developersKeys = {
  all: ['developers'] as const,
  byEvent: (eventId: string) => ['developers', eventId] as const,
  paged: (params: DevelopersPagedParams) =>
    ['developers', params.eventId, 'paged', params] as const,
}

export function useDevelopers(params: DevelopersPagedParams) {
  return useQuery({
    queryKey: developersKeys.paged(params),
    queryFn: () => getDevelopersPaged(params),
    enabled: !!params.eventId,
  })
}
