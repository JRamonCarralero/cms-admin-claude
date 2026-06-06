import { useQuery } from '@tanstack/react-query'
import { getOrganizersPaged } from '../services/organizersService'
import type { OrganizersPagedParams } from '../types'

export const organizersKeys = {
  all: ['organizers'] as const,
  byEvent: (eventId: string) => ['organizers', eventId] as const,
  paged: (params: OrganizersPagedParams) =>
    ['organizers', params.eventId, 'paged', params] as const,
}

export function useOrganizers(params: OrganizersPagedParams) {
  return useQuery({
    queryKey: organizersKeys.paged(params),
    queryFn: () => getOrganizersPaged(params),
    enabled: !!params.eventId,
  })
}
