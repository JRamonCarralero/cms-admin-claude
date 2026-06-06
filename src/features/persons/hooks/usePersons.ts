import { useQuery } from '@tanstack/react-query'
import { getPersonsPaged } from '../services/personsService'
import type { PersonsPagedParams } from '../types'

export const personsKeys = {
  all: ['persons'] as const,
  paged: (params: PersonsPagedParams) => ['persons', 'paged', params] as const,
  detail: (id: string) => ['persons', 'detail', id] as const,
}

export function usePersons(params: PersonsPagedParams) {
  return useQuery({
    queryKey: personsKeys.paged(params),
    queryFn: () => getPersonsPaged(params),
  })
}
