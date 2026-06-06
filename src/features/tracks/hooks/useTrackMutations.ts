import { useQueryClient } from '@tanstack/react-query'
import { useToastMutation } from '@/lib/hooks/useToastMutation'
import { createTrack, updateTrack, deleteTrack } from '../services/tracksService'
import { tracksKeys } from './useTracks'

export function useCreateTrack(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: (data: Parameters<typeof createTrack>[1]) => createTrack(eventId, data),
    successMessage: 'Track creado',
    onSuccess: () => qc.invalidateQueries({ queryKey: tracksKeys.byEvent(eventId) }),
  })
}

export function useUpdateTrack(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateTrack>[1] }) =>
      updateTrack(id, data),
    successMessage: 'Track actualizado',
    onSuccess: () => qc.invalidateQueries({ queryKey: tracksKeys.byEvent(eventId) }),
  })
}

export function useDeleteTrack(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: deleteTrack,
    successMessage: 'Track eliminado',
    onSuccess: () => qc.invalidateQueries({ queryKey: tracksKeys.byEvent(eventId) }),
  })
}
