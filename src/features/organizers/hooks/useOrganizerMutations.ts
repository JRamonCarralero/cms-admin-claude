import { useQueryClient } from '@tanstack/react-query'
import { useToastMutation } from '@/lib/hooks/useToastMutation'
import { createOrganizer, updateOrganizer, deleteOrganizer } from '../services/organizersService'
import { organizersKeys } from './useOrganizers'

export function useCreateOrganizer(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: (data: Parameters<typeof createOrganizer>[1]) => createOrganizer(eventId, data),
    successMessage: 'Organizador añadido',
    onSuccess: () => qc.invalidateQueries({ queryKey: organizersKeys.byEvent(eventId) }),
  })
}

export function useUpdateOrganizer(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateOrganizer>[1] }) =>
      updateOrganizer(id, data),
    successMessage: 'Organizador actualizado',
    onSuccess: () => qc.invalidateQueries({ queryKey: organizersKeys.byEvent(eventId) }),
  })
}

export function useDeleteOrganizer(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: deleteOrganizer,
    successMessage: 'Organizador eliminado',
    onSuccess: () => qc.invalidateQueries({ queryKey: organizersKeys.byEvent(eventId) }),
  })
}
