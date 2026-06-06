import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDeveloper, updateDeveloper, deleteDeveloper } from '../services/developersService'
import { developersKeys } from './useDevelopers'

export function useCreateDeveloper(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof createDeveloper>[1]) => createDeveloper(eventId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: developersKeys.byEvent(eventId) }),
  })
}

export function useUpdateDeveloper(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateDeveloper>[1] }) =>
      updateDeveloper(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: developersKeys.byEvent(eventId) }),
  })
}

export function useDeleteDeveloper(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteDeveloper,
    onSuccess: () => qc.invalidateQueries({ queryKey: developersKeys.byEvent(eventId) }),
  })
}
