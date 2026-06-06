import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { useOrganizers } from './useOrganizers'
import { useCreateOrganizer, useDeleteOrganizer } from './useOrganizerMutations'
import { resetOrganizerDb } from '../../../../mocks/handlers/organizers.handlers'
import { mockOrganizers, EVENT_ID_1 } from '../../../../mocks/data/organizers.mock'

const BASE_PARAMS = { eventId: EVENT_ID_1, page: 1, pageSize: 10 }

beforeEach(() => resetOrganizerDb())

describe('useOrganizers', () => {
  it('devuelve los organizadores del evento', async () => {
    const { result } = renderHook(() => useOrganizers(BASE_PARAMS), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(mockOrganizers.length)
  })
})

describe('useCreateOrganizer', () => {
  it('crea un organizador y actualiza la lista', async () => {
    const { result } = renderHook(
      () => ({ mutation: useCreateOrganizer(EVENT_ID_1), list: useOrganizers(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({
        person_id: 'p0000002-0000-0000-0000-000000000002',
        company: 'GDG',
        role_description: 'Logistics',
      })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() =>
      expect(result.current.list.data?.meta.total).toBe(mockOrganizers.length + 1),
    )
  })
})

describe('useDeleteOrganizer', () => {
  it('elimina un organizador y actualiza el total', async () => {
    const { result } = renderHook(
      () => ({ mutation: useDeleteOrganizer(EVENT_ID_1), list: useOrganizers(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate(mockOrganizers[0].id)
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() =>
      expect(result.current.list.data?.meta.total).toBe(mockOrganizers.length - 1),
    )
  })
})
