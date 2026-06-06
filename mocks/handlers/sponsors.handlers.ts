import { http, HttpResponse } from 'msw'
import type { SponsorResponse } from '@/types/api'
import { mockSponsors } from '../data/sponsors.mock'

let db = [...mockSponsors]

export function resetSponsorDb() {
  db = [...mockSponsors]
}

export const sponsorHandlers = [
  http.get('*/api/v1/events/:eventId/sponsors/paged', ({ params, request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const filtered = db.filter((s) => s.event_id === params['eventId'])
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)
    return HttpResponse.json({ data, meta: { total: filtered.length, page, pageSize } })
  }),

  http.post('*/api/v1/events/:eventId/sponsors', async ({ params, request }) => {
    const body = (await request.json()) as Partial<SponsorResponse>
    const newItem: SponsorResponse = {
      id: `mock-spo-${Date.now()}`,
      event_id: params['eventId'] as string,
      name: body.name ?? '',
      logo_url: body.logo_url ?? '',
      website_url: body.website_url ?? '',
      tier: body.tier ?? '',
      order_priority: body.order_priority,
      created_by: 'user-001',
      updated_by: 'user-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.push(newItem)
    return HttpResponse.json(newItem, { status: 201 })
  }),

  http.put('*/api/v1/sponsors/:id', async ({ params, request }) => {
    const idx = db.findIndex((s) => s.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    const body = (await request.json()) as Partial<SponsorResponse>
    db[idx] = { ...db[idx], ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(db[idx])
  }),

  http.delete('*/api/v1/sponsors/:id', ({ params }) => {
    const idx = db.findIndex((s) => s.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    db.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
