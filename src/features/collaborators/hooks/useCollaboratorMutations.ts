import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
} from '../services/collaboratorsService'
import { collaboratorsKeys } from './useCollaborators'

export function useCreateCollaborator(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof createCollaborator>[1]) =>
      createCollaborator(eventId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: collaboratorsKeys.byEvent(eventId) }),
  })
}

export function useUpdateCollaborator(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateCollaborator>[1] }) =>
      updateCollaborator(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: collaboratorsKeys.byEvent(eventId) }),
  })
}

export function useDeleteCollaborator(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCollaborator,
    onSuccess: () => qc.invalidateQueries({ queryKey: collaboratorsKeys.byEvent(eventId) }),
  })
}
