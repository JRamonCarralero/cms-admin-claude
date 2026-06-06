import { apiClient } from '@/lib/api/client'
import type { PersonResponse, PagedResponse } from '@/types/api'
import type { CreatePersonDTO, UpdatePersonDTO, PersonsPagedParams } from '../types'

export function getPersonsPaged(params: PersonsPagedParams) {
  return apiClient
    .get<PagedResponse<PersonResponse>>('/api/v1/persons/paged', { params })
    .then((r) => r.data)
}

export function getPersonById(id: string) {
  return apiClient.get<PersonResponse>(`/api/v1/persons/id/${id}`).then((r) => r.data)
}

export function createPerson(data: CreatePersonDTO) {
  return apiClient.post<PersonResponse>('/api/v1/persons', data).then((r) => r.data)
}

export function updatePerson(id: string, data: UpdatePersonDTO) {
  return apiClient.put<PersonResponse>(`/api/v1/persons/${id}`, data).then((r) => r.data)
}

export function deletePerson(id: string) {
  return apiClient.delete(`/api/v1/persons/${id}`)
}

export function getPersonsList() {
  return apiClient.get<PersonResponse[]>('/api/v1/persons').then((r) => r.data)
}
