import { useQueryClient } from '@tanstack/react-query'
import { useToastMutation } from '@/lib/hooks/useToastMutation'
import { createSpeaker, updateSpeaker, deleteSpeaker } from '../services/speakersService'
import { speakersKeys } from './useSpeakers'

export function useCreateSpeaker(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: (data: Parameters<typeof createSpeaker>[1]) => createSpeaker(eventId, data),
    successMessage: 'Ponente añadido',
    onSuccess: () => qc.invalidateQueries({ queryKey: speakersKeys.byEvent(eventId) }),
  })
}

export function useUpdateSpeaker(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateSpeaker>[1] }) =>
      updateSpeaker(id, data),
    successMessage: 'Ponente actualizado',
    onSuccess: () => qc.invalidateQueries({ queryKey: speakersKeys.byEvent(eventId) }),
  })
}

export function useDeleteSpeaker(eventId: string) {
  const qc = useQueryClient()
  return useToastMutation({
    mutationFn: deleteSpeaker,
    successMessage: 'Ponente eliminado',
    onSuccess: () => qc.invalidateQueries({ queryKey: speakersKeys.byEvent(eventId) }),
  })
}
