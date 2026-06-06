import { useQuery } from '@tanstack/react-query'
import { getSpeakersPaged } from '../services/speakersService'
import type { SpeakersPagedParams } from '../types'

export const speakersKeys = {
  all: ['speakers'] as const,
  byEvent: (eventId: string) => ['speakers', eventId] as const,
  paged: (params: SpeakersPagedParams) => ['speakers', params.eventId, 'paged', params] as const,
}

export function useSpeakers(params: SpeakersPagedParams) {
  return useQuery({
    queryKey: speakersKeys.paged(params),
    queryFn: () => getSpeakersPaged(params),
    enabled: !!params.eventId,
  })
}
