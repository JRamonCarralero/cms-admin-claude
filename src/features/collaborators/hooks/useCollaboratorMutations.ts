import { useQueryClient } from '@tanstack/react-query'
import { useToastMutation } from '@/lib/hooks/useToastMutation'
import {
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
} from '../services/collaboratorsService'
import { collaboratorsKeys } from './useCollaborators'

export function useCreateCollaborator(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: (data: Parameters<typeof createCollaborator>[1]) =>
      createCollaborator(eventId, data),
    successMessage: 'Colaborador añadido',
    onSuccess: () => qc.invalidateQueries({ queryKey: collaboratorsKeys.byEvent(eventId) }),
  })
}

export function useUpdateCollaborator(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateCollaborator>[1] }) =>
      updateCollaborator(id, data),
    successMessage: 'Colaborador actualizado',
    onSuccess: () => qc.invalidateQueries({ queryKey: collaboratorsKeys.byEvent(eventId) }),
  })
}

export function useDeleteCollaborator(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: deleteCollaborator,
    successMessage: 'Colaborador eliminado',
    onSuccess: () => qc.invalidateQueries({ queryKey: collaboratorsKeys.byEvent(eventId) }),
  })
}
