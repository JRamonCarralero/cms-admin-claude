import { http, HttpResponse } from 'msw'
import type { PersonResponse } from '@/types/api'
import { mockPersons } from '../data/persons.mock'

let db = [...mockPersons]

export function resetPersonDb() {
  db = [...mockPersons]
}

export const personHandlers = [
  // GET paginado
  http.get('*/api/v1/persons/paged', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''

    const filtered = search
      ? db.filter(
          (p) =>
            p.first_name.toLowerCase().includes(search) ||
            p.last_name.toLowerCase().includes(search) ||
            (p.email ?? '').toLowerCase().includes(search),
        )
      : db

    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)
    return HttpResponse.json({ data, meta: { total: filtered.length, page, pageSize } })
  }),

  // GET lista completa
  http.get('*/api/v1/persons', () => HttpResponse.json(db)),

  // GET por ID
  http.get('*/api/v1/persons/id/:id', ({ params }) => {
    const person = db.find((p) => p.id === params['id'])
    if (!person) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(person)
  }),

  // GET por email
  http.get('*/api/v1/persons/email/:email', ({ params }) => {
    const person = db.find((p) => p.email === params['email'])
    if (!person) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(person)
  }),

  // POST crear
  http.post('*/api/v1/persons', async ({ request }) => {
    const body = (await request.json()) as Partial<PersonResponse>
    const newPerson: PersonResponse = {
      id: `mock-person-${Date.now()}`,
      first_name: body.first_name ?? '',
      last_name: body.last_name ?? '',
      email: body.email ?? '',
      avatar_url: body.avatar_url ?? '',
      github_user: body.github_user ?? '',
      linkedin_url: body.linkedin_url ?? '',
      twitter_url: body.twitter_url ?? '',
      website_url: body.website_url ?? '',
      created_by: 'user-001',
      updated_by: 'user-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.push(newPerson)
    return HttpResponse.json(newPerson, { status: 201 })
  }),

  // PUT actualizar
  http.put('*/api/v1/persons/:id', async ({ params, request }) => {
    const idx = db.findIndex((p) => p.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    const body = (await request.json()) as Partial<PersonResponse>
    db[idx] = { ...db[idx], ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(db[idx])
  }),

  // DELETE
  http.delete('*/api/v1/persons/:id', ({ params }) => {
    const idx = db.findIndex((p) => p.id === params['id'])
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    db.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
