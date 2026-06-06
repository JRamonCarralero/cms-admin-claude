import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEvent, updateEvent, deleteEvent } from '../services/eventsService'
import { eventsKeys } from './useEvents'

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: eventsKeys.all }),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateEvent>[1] }) =>
      updateEvent(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventsKeys.all }),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: eventsKeys.all }),
  })
}
