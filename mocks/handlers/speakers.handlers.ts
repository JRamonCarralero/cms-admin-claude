import { http, HttpResponse } from 'msw'
import type { SpeakerDetailResponse } from '@/types/api'
import { mockSpeakers } from '../data/speakers.mock'
import { mockPersons } from '../data/persons.mock'

let db = [...mockSpeakers]

export function resetSpeakerDb() {
  db = [...mockSpeakers]
}

export const speakerHandlers = [
  http.get('*/api/v1/events/:eventId/speakers/paged', ({ params, request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const filtered = db.filter((s) => s.event_id === params['eventId'])
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)
    return HttpResponse.json({ data, meta: { total: filtered.length, page, pageSize } })
  }),

  http.post('*/api/v1/events/:eventId/speakers', async ({ params, request }) => {
    const body = (await request.json()) as {
      person_id: string
      bio?: string
      company?: string
    }
    const person = mockPersons.find((p) => p.id === body.person_id)
    const newItem: SpeakerDetailResponse = {
      id: `mock-spk-${Date.now()}`,
      person_id: body.person_id,
      event_id: params['eventId'] as string,
      bio: body.bio,
      company: body.company,
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

  http.put('*/api/v1/speakers/:id', async ({ params, request }) => {
    const idx = db.findIndex((s) => s.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    const body = (await request.json()) as Partial<SpeakerDetailResponse>
    db[idx] = { ...db[idx], ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(db[idx])
  }),

  http.delete('*/api/v1/speakers/:id', ({ params }) => {
    const idx = db.findIndex((s) => s.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    db.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
