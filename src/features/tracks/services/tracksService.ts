import { apiClient } from '@/lib/api/client'
import type { TrackResponse, PagedResponse } from '@/types/api'
import type { TracksPagedParams, CreateTrackDTO, UpdateTrackDTO } from '../types'

export function getTracksPaged({ eventId, page, pageSize }: TracksPagedParams) {
  return apiClient
    .get<
      PagedResponse<TrackResponse>
    >(`/api/v1/events/${eventId}/tracks/paged`, { params: { page, pageSize } })
    .then((r) => r.data)
}

export function createTrack(eventId: string, data: CreateTrackDTO) {
  return apiClient.post<TrackResponse>(`/api/v1/events/${eventId}/tracks`, data).then((r) => r.data)
}

export function updateTrack(id: string, data: UpdateTrackDTO) {
  return apiClient.put<TrackResponse>(`/api/v1/tracks/${id}`, data).then((r) => r.data)
}

export function deleteTrack(id: string) {
  return apiClient.delete(`/api/v1/tracks/${id}`)
}
