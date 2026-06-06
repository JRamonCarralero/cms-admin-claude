import { apiClient } from '@/lib/api/client'
import type { DeveloperDetailResponse, PagedResponse } from '@/types/api'
import type { DevelopersPagedParams, CreateDeveloperDTO, UpdateDeveloperDTO } from '../types'

export function getDevelopersPaged({ eventId, page, pageSize }: DevelopersPagedParams) {
  return apiClient
    .get<
      PagedResponse<DeveloperDetailResponse>
    >(`/api/v1/events/${eventId}/developers/paged`, { params: { page, pageSize } })
    .then((r) => r.data)
}

export function createDeveloper(eventId: string, data: CreateDeveloperDTO) {
  return apiClient
    .post<DeveloperDetailResponse>(`/api/v1/events/${eventId}/developers`, data)
    .then((r) => r.data)
}

export function updateDeveloper(id: string, data: UpdateDeveloperDTO) {
  return apiClient
    .put<DeveloperDetailResponse>(`/api/v1/developers/${id}`, data)
    .then((r) => r.data)
}

export function deleteDeveloper(id: string) {
  return apiClient.delete(`/api/v1/developers/${id}`)
}
