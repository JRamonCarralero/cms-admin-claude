import { apiClient } from '@/lib/api/client'
import type { EventResponse, PagedResponse } from '@/types/api'
import type { CreateEventDTO, UpdateEventDTO, EventsPagedParams } from '../types'

export function getEventsPaged(params: EventsPagedParams) {
  return apiClient
    .get<PagedResponse<EventResponse>>('/api/v1/events/paged', { params })
    .then((r) => r.data)
}

export function getEventById(id: string) {
  return apiClient.get<EventResponse>(`/api/v1/events/id/${id}`).then((r) => r.data)
}

export function createEvent(data: CreateEventDTO) {
  return apiClient.post<EventResponse>('/api/v1/events', data).then((r) => r.data)
}

export function updateEvent(id: string, data: UpdateEventDTO) {
  return apiClient.put<EventResponse>(`/api/v1/events/${id}`, data).then((r) => r.data)
}

export function deleteEvent(id: string) {
  return apiClient.delete(`/api/v1/events/${id}`)
}
