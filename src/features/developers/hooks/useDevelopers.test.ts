import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { useDevelopers } from './useDevelopers'
import { useCreateDeveloper, useUpdateDeveloper, useDeleteDeveloper } from './useDeveloperMutations'
import { resetDeveloperDb } from '../../../../mocks/handlers/developers.handlers'
import { mockDevelopers, EVENT_ID_1 } from '../../../../mocks/data/developers.mock'

const BASE_PARAMS = { eventId: EVENT_ID_1, page: 1, pageSize: 10 }

beforeEach(() => resetDeveloperDb())

describe('useDevelopers', () => {
  it('devuelve los desarrolladores del evento', async () => {
    const { result } = renderHook(() => useDevelopers(BASE_PARAMS), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(mockDevelopers.length)
  })
})

describe('useCreateDeveloper', () => {
  it('crea un desarrollador y actualiza la lista', async () => {
    const { result } = renderHook(
      () => ({ mutation: useCreateDeveloper(EVENT_ID_1), list: useDevelopers(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({
        person_id: 'p0000001-0000-0000-0000-000000000001',
        role_description: 'Front-end Developer',
      })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() =>
      expect(result.current.list.data?.meta.total).toBe(mockDevelopers.length + 1),
    )
  })
})

describe('useDeleteDeveloper', () => {
  it('elimina un desarrollador y actualiza el total', async () => {
    const { result } = renderHook(
      () => ({ mutation: useDeleteDeveloper(EVENT_ID_1), list: useDevelopers(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate(mockDevelopers[0].id)
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() =>
      expect(result.current.list.data?.meta.total).toBe(mockDevelopers.length - 1),
    )
  })
})

describe('useUpdateDeveloper', () => {
  it('actualiza el rol de un desarrollador', async () => {
    const { result } = renderHook(
      () => ({ mutation: useUpdateDeveloper(EVENT_ID_1), list: useDevelopers(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({
        id: mockDevelopers[0].id,
        data: { role_description: 'Tech Lead' },
      })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => {
      const updated = result.current.list.data?.data.find((d) => d.id === mockDevelopers[0].id)
      expect(updated?.role_description).toBe('Tech Lead')
    })
  })
})
