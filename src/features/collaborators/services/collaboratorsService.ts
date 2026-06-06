import { apiClient } from '@/lib/api/client'
import type { CollaboratorDetailResponse, PagedResponse } from '@/types/api'
import type {
  CollaboratorsPagedParams,
  CreateCollaboratorDTO,
  UpdateCollaboratorDTO,
} from '../types'

export function getCollaboratorsPaged({ eventId, page, pageSize }: CollaboratorsPagedParams) {
  return apiClient
    .get<
      PagedResponse<CollaboratorDetailResponse>
    >(`/api/v1/events/${eventId}/collaborators/paged`, { params: { page, pageSize } })
    .then((r) => r.data)
}

export function createCollaborator(eventId: string, data: CreateCollaboratorDTO) {
  return apiClient
    .post<CollaboratorDetailResponse>(`/api/v1/events/${eventId}/collaborators`, data)
    .then((r) => r.data)
}

export function updateCollaborator(id: string, data: UpdateCollaboratorDTO) {
  return apiClient
    .put<CollaboratorDetailResponse>(`/api/v1/collaborators/${id}`, data)
    .then((r) => r.data)
}

export function deleteCollaborator(id: string) {
  return apiClient.delete(`/api/v1/collaborators/${id}`)
}
