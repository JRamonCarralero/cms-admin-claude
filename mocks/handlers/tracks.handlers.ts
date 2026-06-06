import { http, HttpResponse } from 'msw'
import type { TrackResponse } from '@/types/api'
import { mockTracks } from '../data/tracks.mock'

let db = [...mockTracks]

export function resetTrackDb() {
  db = [...mockTracks]
}

export const trackHandlers = [
  http.get('*/api/v1/events/:eventId/tracks/paged', ({ params, request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const filtered = db.filter((t) => t.event_id === params['eventId'])
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)
    return HttpResponse.json({ data, meta: { total: filtered.length, page, pageSize } })
  }),

  http.post('*/api/v1/events/:eventId/tracks', async ({ params, request }) => {
    const body = (await request.json()) as Partial<TrackResponse>
    const newItem: TrackResponse = {
      id: `mock-trk-${Date.now()}`,
      event_id: params['eventId'] as string,
      name: body.name ?? '',
      event_date: body.event_date ?? '',
      created_by: 'user-001',
      updated_by: 'user-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.push(newItem)
    return HttpResponse.json(newItem, { status: 201 })
  }),

  http.put('*/api/v1/tracks/:id', async ({ params, request }) => {
    const idx = db.findIndex((t) => t.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    const body = (await request.json()) as Partial<TrackResponse>
    db[idx] = { ...db[idx], ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(db[idx])
  }),

  http.delete('*/api/v1/tracks/:id', ({ params }) => {
    const idx = db.findIndex((t) => t.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    db.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
