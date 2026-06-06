import { http, HttpResponse } from 'msw'
import type { EventResponse } from '@/types/api'
import { mockEvents } from '../data/events.mock'

// Estado mutable local para simular CRUD en tests
let db = [...mockEvents]

export function resetEventDb() {
  db = [...mockEvents]
}

export const eventHandlers = [
  // GET paginado
  http.get('*/api/v1/events/paged', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''

    const filtered = search
      ? db.filter((e) => e.name.toLowerCase().includes(search) || e.slug.includes(search))
      : db

    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    return HttpResponse.json({ data, meta: { total: filtered.length, page, pageSize } })
  }),

  // GET lista completa
  http.get('*/api/v1/events', () => HttpResponse.json(db)),

  // GET activos
  http.get('*/api/v1/events/status/active', () => HttpResponse.json(db.filter((e) => e.is_active))),

  // GET por ID
  http.get('*/api/v1/events/id/:id', ({ params }) => {
    const event = db.find((e) => e.id === params['id'])
    if (!event) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(event)
  }),

  // POST crear
  http.post('*/api/v1/events', async ({ request }) => {
    const body = (await request.json()) as Partial<EventResponse>
    const newEvent: EventResponse = {
      id: `mock-${Date.now()}`,
      name: body.name ?? '',
      slug: body.slug ?? '',
      is_active: body.is_active ?? false,
      created_by: 'user-001',
      updated_by: 'user-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.push(newEvent)
    return HttpResponse.json(newEvent, { status: 201 })
  }),

  // PUT actualizar
  http.put('*/api/v1/events/:id', async ({ params, request }) => {
    const idx = db.findIndex((e) => e.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    const body = (await request.json()) as Partial<EventResponse>
    db[idx] = { ...db[idx], ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(db[idx])
  }),

  // DELETE
  http.delete('*/api/v1/events/:id', ({ params }) => {
    const idx = db.findIndex((e) => e.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    db.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
