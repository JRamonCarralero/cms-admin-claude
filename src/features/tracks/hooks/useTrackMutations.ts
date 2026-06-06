import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTrack, updateTrack, deleteTrack } from '../services/tracksService'
import { tracksKeys } from './useTracks'

export function useCreateTrack(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof createTrack>[1]) => createTrack(eventId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tracksKeys.byEvent(eventId) }),
  })
}

export function useUpdateTrack(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateTrack>[1] }) =>
      updateTrack(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tracksKeys.byEvent(eventId) }),
  })
}

export function useDeleteTrack(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTrack,
    onSuccess: () => qc.invalidateQueries({ queryKey: tracksKeys.byEvent(eventId) }),
  })
}
