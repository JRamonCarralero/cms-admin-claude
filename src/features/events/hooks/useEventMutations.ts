import { useQueryClient } from '@tanstack/react-query'
import { useToastMutation } from '@/lib/hooks/useToastMutation'
import { createEvent, updateEvent, deleteEvent } from '../services/eventsService'
import { eventsKeys } from './useEvents'

export function useCreateEvent() {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: createEvent,
    successMessage: 'Evento creado correctamente',
    onSuccess: () => qc.invalidateQueries({ queryKey: eventsKeys.all }),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateEvent>[1] }) =>
      updateEvent(id, data),
    successMessage: 'Evento actualizado correctamente',
    onSuccess: () => qc.invalidateQueries({ queryKey: eventsKeys.all }),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: deleteEvent,
    successMessage: 'Evento eliminado',
    onSuccess: () => qc.invalidateQueries({ queryKey: eventsKeys.all }),
  })
}
