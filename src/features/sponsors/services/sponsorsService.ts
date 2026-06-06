import { apiClient } from '@/lib/api/client'
import type { SponsorResponse, PagedResponse } from '@/types/api'
import type { SponsorsPagedParams, CreateSponsorDTO, UpdateSponsorDTO } from '../types'

export function getSponsorsPaged({ eventId, page, pageSize }: SponsorsPagedParams) {
  return apiClient
    .get<
      PagedResponse<SponsorResponse>
    >(`/api/v1/events/${eventId}/sponsors/paged`, { params: { page, pageSize } })
    .then((r) => r.data)
}

export function createSponsor(eventId: string, data: CreateSponsorDTO) {
  return apiClient
    .post<SponsorResponse>(`/api/v1/events/${eventId}/sponsors`, data)
    .then((r) => r.data)
}

export function updateSponsor(id: string, data: UpdateSponsorDTO) {
  return apiClient.put<SponsorResponse>(`/api/v1/sponsors/${id}`, data).then((r) => r.data)
}

export function deleteSponsor(id: string) {
  return apiClient.delete(`/api/v1/sponsors/${id}`)
}
