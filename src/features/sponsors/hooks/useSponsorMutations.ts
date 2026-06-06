import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSponsor, updateSponsor, deleteSponsor } from '../services/sponsorsService'
import { sponsorsKeys } from './useSponsors'

export function useCreateSponsor(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof createSponsor>[1]) => createSponsor(eventId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: sponsorsKeys.byEvent(eventId) }),
  })
}

export function useUpdateSponsor(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateSponsor>[1] }) =>
      updateSponsor(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: sponsorsKeys.byEvent(eventId) }),
  })
}

export function useDeleteSponsor(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteSponsor,
    onSuccess: () => qc.invalidateQueries({ queryKey: sponsorsKeys.byEvent(eventId) }),
  })
}
