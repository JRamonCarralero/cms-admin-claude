import { apiClient } from '@/lib/api/client'
import type { OrganizerDetailResponse, PagedResponse } from '@/types/api'
import type { OrganizersPagedParams, CreateOrganizerDTO, UpdateOrganizerDTO } from '../types'

export function getOrganizersPaged({ eventId, page, pageSize }: OrganizersPagedParams) {
  return apiClient
    .get<
      PagedResponse<OrganizerDetailResponse>
    >(`/api/v1/events/${eventId}/organizers/paged`, { params: { page, pageSize } })
    .then((r) => r.data)
}

export function createOrganizer(eventId: string, data: CreateOrganizerDTO) {
  return apiClient
    .post<OrganizerDetailResponse>(`/api/v1/events/${eventId}/organizers`, data)
    .then((r) => r.data)
}

export function updateOrganizer(id: string, data: UpdateOrganizerDTO) {
  return apiClient
    .put<OrganizerDetailResponse>(`/api/v1/organizers/${id}`, data)
    .then((r) => r.data)
}

export function deleteOrganizer(id: string) {
  return apiClient.delete(`/api/v1/organizers/${id}`)
}
