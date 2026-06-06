import { useQueryClient } from '@tanstack/react-query'
import { useToastMutation } from '@/lib/hooks/useToastMutation'
import { createSponsor, updateSponsor, deleteSponsor } from '../services/sponsorsService'
import { sponsorsKeys } from './useSponsors'

export function useCreateSponsor(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: (data: Parameters<typeof createSponsor>[1]) => createSponsor(eventId, data),
    successMessage: 'Patrocinador añadido',
    onSuccess: () => qc.invalidateQueries({ queryKey: sponsorsKeys.byEvent(eventId) }),
  })
}

export function useUpdateSponsor(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateSponsor>[1] }) =>
      updateSponsor(id, data),
    successMessage: 'Patrocinador actualizado',
    onSuccess: () => qc.invalidateQueries({ queryKey: sponsorsKeys.byEvent(eventId) }),
  })
}

export function useDeleteSponsor(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: deleteSponsor,
    successMessage: 'Patrocinador eliminado',
    onSuccess: () => qc.invalidateQueries({ queryKey: sponsorsKeys.byEvent(eventId) }),
  })
}
