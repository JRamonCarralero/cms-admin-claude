import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrganizer, updateOrganizer, deleteOrganizer } from '../services/organizersService'
import { organizersKeys } from './useOrganizers'

export function useCreateOrganizer(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof createOrganizer>[1]) => createOrganizer(eventId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: organizersKeys.byEvent(eventId) }),
  })
}

export function useUpdateOrganizer(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateOrganizer>[1] }) =>
      updateOrganizer(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: organizersKeys.byEvent(eventId) }),
  })
}

export function useDeleteOrganizer(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteOrganizer,
    onSuccess: () => qc.invalidateQueries({ queryKey: organizersKeys.byEvent(eventId) }),
  })
}
