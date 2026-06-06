import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSpeaker, updateSpeaker, deleteSpeaker } from '../services/speakersService'
import { speakersKeys } from './useSpeakers'

export function useCreateSpeaker(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof createSpeaker>[1]) => createSpeaker(eventId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: speakersKeys.byEvent(eventId) }),
  })
}

export function useUpdateSpeaker(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateSpeaker>[1] }) =>
      updateSpeaker(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: speakersKeys.byEvent(eventId) }),
  })
}

export function useDeleteSpeaker(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteSpeaker,
    onSuccess: () => qc.invalidateQueries({ queryKey: speakersKeys.byEvent(eventId) }),
  })
}
