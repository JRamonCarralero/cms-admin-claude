import { useQuery } from '@tanstack/react-query'
import { getPersonsList } from '../services/personsService'

export const personsListKey = ['persons', 'list'] as const

export function usePersonsList() {
  return useQuery({
    queryKey: personsListKey,
    queryFn: getPersonsList,
    staleTime: 1000 * 60 * 5,
  })
}
