import { http, HttpResponse } from 'msw'
import type { OrganizerDetailResponse } from '@/types/api'
import { mockOrganizers } from '../data/organizers.mock'
import { mockPersons } from '../data/persons.mock'

let db = [...mockOrganizers]

export function resetOrganizerDb() {
  db = [...mockOrganizers]
}

export const organizerHandlers = [
  http.get('*/api/v1/events/:eventId/organizers/paged', ({ params, request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const filtered = db.filter((o) => o.event_id === params['eventId'])
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)
    return HttpResponse.json({ data, meta: { total: filtered.length, page, pageSize } })
  }),

  http.post('*/api/v1/events/:eventId/organizers', async ({ params, request }) => {
    const body = (await request.json()) as {
      person_id: string
      company?: string
      role_description?: string
    }
    const person = mockPersons.find((p) => p.id === body.person_id)
    const newItem: OrganizerDetailResponse = {
      id: `mock-org-${Date.now()}`,
      person_id: body.person_id,
      event_id: params['eventId'] as string,
      company: body.company,
      role_description: body.role_description,
      first_name: person?.first_name ?? '',
      last_name: person?.last_name ?? '',
      email: person?.email ?? '',
      avatar_url: person?.avatar_url ?? '',
      github_user: person?.github_user ?? '',
      linkedin_url: person?.linkedin_url ?? '',
      twitter_url: person?.twitter_url ?? '',
      website_url: person?.website_url ?? '',
      created_by: 'user-001',
      updated_by: 'user-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.push(newItem)
    return HttpResponse.json(newItem, { status: 201 })
  }),

  http.put('*/api/v1/organizers/:id', async ({ params, request }) => {
    const idx = db.findIndex((o) => o.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    const body = (await request.json()) as Partial<OrganizerDetailResponse>
    db[idx] = { ...db[idx], ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(db[idx])
  }),

  http.delete('*/api/v1/organizers/:id', ({ params }) => {
    const idx = db.findIndex((o) => o.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    db.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
