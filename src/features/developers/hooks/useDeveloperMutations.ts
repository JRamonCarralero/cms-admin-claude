import { useQueryClient } from '@tanstack/react-query'
import { useToastMutation } from '@/lib/hooks/useToastMutation'
import { createDeveloper, updateDeveloper, deleteDeveloper } from '../services/developersService'
import { developersKeys } from './useDevelopers'

export function useCreateDeveloper(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: (data: Parameters<typeof createDeveloper>[1]) => createDeveloper(eventId, data),
    successMessage: 'Desarrollador añadido',
    onSuccess: () => qc.invalidateQueries({ queryKey: developersKeys.byEvent(eventId) }),
  })
}

export function useUpdateDeveloper(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateDeveloper>[1] }) =>
      updateDeveloper(id, data),
    successMessage: 'Desarrollador actualizado',
    onSuccess: () => qc.invalidateQueries({ queryKey: developersKeys.byEvent(eventId) }),
  })
}

export function useDeleteDeveloper(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: deleteDeveloper,
    successMessage: 'Desarrollador eliminado',
    onSuccess: () => qc.invalidateQueries({ queryKey: developersKeys.byEvent(eventId) }),
  })
}
