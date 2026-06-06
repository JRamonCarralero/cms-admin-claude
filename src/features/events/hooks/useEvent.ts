import { useQuery } from '@tanstack/react-query'
import { getEventById } from '../services/eventsService'
import { eventsKeys } from './useEvents'

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventsKeys.detail(id),
    queryFn: () => getEventById(id),
    enabled: !!id,
  })
}
