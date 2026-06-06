import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { useEvents } from './useEvents'
import { resetEventDb } from '../../../../mocks/handlers/events.handlers'
import { mockEvents } from '../../../../mocks/data/events.mock'

beforeEach(() => resetEventDb())

describe('useEvents', () => {
  it('devuelve la lista paginada de eventos', async () => {
    const { result } = renderHook(() => useEvents({ page: 1, pageSize: 10 }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(mockEvents.length)
    expect(result.current.data?.meta.total).toBe(mockEvents.length)
  })

  it('filtra por término de búsqueda', async () => {
    const { result } = renderHook(() => useEvents({ page: 1, pageSize: 10, search: 'devfest' }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.data[0].slug).toBe('gdg-aranjuez-devfest-2024')
  })

  it('respeta la paginación', async () => {
    const { result } = renderHook(() => useEvents({ page: 1, pageSize: 2 }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(2)
    expect(result.current.data?.meta.total).toBe(mockEvents.length)
  })
})
