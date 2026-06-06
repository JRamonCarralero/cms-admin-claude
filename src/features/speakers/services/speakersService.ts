import { apiClient } from '@/lib/api/client'
import type { SpeakerDetailResponse, PagedResponse } from '@/types/api'
import type { SpeakersPagedParams, CreateSpeakerDTO, UpdateSpeakerDTO } from '../types'

export function getSpeakersPaged({ eventId, page, pageSize }: SpeakersPagedParams) {
  return apiClient
    .get<
      PagedResponse<SpeakerDetailResponse>
    >(`/api/v1/events/${eventId}/speakers/paged`, { params: { page, pageSize } })
    .then((r) => r.data)
}

export function createSpeaker(eventId: string, data: CreateSpeakerDTO) {
  return apiClient
    .post<SpeakerDetailResponse>(`/api/v1/events/${eventId}/speakers`, data)
    .then((r) => r.data)
}

export function updateSpeaker(id: string, data: UpdateSpeakerDTO) {
  return apiClient.put<SpeakerDetailResponse>(`/api/v1/speakers/${id}`, data).then((r) => r.data)
}

export function deleteSpeaker(id: string) {
  return apiClient.delete(`/api/v1/speakers/${id}`)
}
