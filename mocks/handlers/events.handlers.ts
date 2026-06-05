import { http, HttpResponse } from 'msw'

export const eventHandlers = [
  http.get('*/api/v1/events/paged', () =>
    HttpResponse.json({ data: [], meta: { total: 0, page: 1, pageSize: 10 } }),
  ),
  http.get('*/api/v1/events', () => HttpResponse.json([])),
  http.get('*/api/v1/events/status/active', () => HttpResponse.json([])),
]
