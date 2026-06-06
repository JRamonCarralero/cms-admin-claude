import { useQuery } from '@tanstack/react-query'
import { getCollaboratorsPaged } from '../services/collaboratorsService'
import type { CollaboratorsPagedParams } from '../types'

export const collaboratorsKeys = {
  all: ['collaborators'] as const,
  byEvent: (eventId: string) => ['collaborators', eventId] as const,
  paged: (params: CollaboratorsPagedParams) =>
    ['collaborators', params.eventId, 'paged', params] as const,
}

export function useCollaborators(params: CollaboratorsPagedParams) {
  return useQuery({
    queryKey: collaboratorsKeys.paged(params),
    queryFn: () => getCollaboratorsPaged(params),
    enabled: !!params.eventId,
  })
}
