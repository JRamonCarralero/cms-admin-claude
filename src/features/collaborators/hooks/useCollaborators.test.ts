import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { useCollaborators } from './useCollaborators'
import {
  useCreateCollaborator,
  useUpdateCollaborator,
  useDeleteCollaborator,
} from './useCollaboratorMutations'
import { resetCollaboratorDb } from '../../../../mocks/handlers/collaborators.handlers'
import { mockCollaborators, EVENT_ID_1 } from '../../../../mocks/data/collaborators.mock'

const BASE_PARAMS = { eventId: EVENT_ID_1, page: 1, pageSize: 10 }

beforeEach(() => resetCollaboratorDb())

describe('useCollaborators', () => {
  it('devuelve los colaboradores del evento', async () => {
    const { result } = renderHook(() => useCollaborators(BASE_PARAMS), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(mockCollaborators.length)
  })

  it('devuelve lista vacía para un evento sin colaboradores', async () => {
    const { result } = renderHook(
      () => useCollaborators({ eventId: 'no-event', page: 1, pageSize: 10 }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(0)
  })
})

describe('useCreateCollaborator', () => {
  it('crea un colaborador y actualiza la lista', async () => {
    const { result } = renderHook(
      () => ({
        mutation: useCreateCollaborator(EVENT_ID_1),
        list: useCollaborators(BASE_PARAMS),
      }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({
        person_id: 'p0000004-0000-0000-0000-000000000004',
        area: 'Testing',
      })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() =>
      expect(result.current.list.data?.meta.total).toBe(mockCollaborators.length + 1),
    )
  })
})

describe('useUpdateCollaborator', () => {
  it('actualiza el área de un colaborador', async () => {
    const { result } = renderHook(
      () => ({
        mutation: useUpdateCollaborator(EVENT_ID_1),
        list: useCollaborators(BASE_PARAMS),
      }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({
        id: mockCollaborators[0].id,
        data: { area: 'Full-stack' },
      })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => {
      const updated = result.current.list.data?.data.find((c) => c.id === mockCollaborators[0].id)
      expect(updated?.area).toBe('Full-stack')
    })
  })
})

describe('useDeleteCollaborator', () => {
  it('elimina un colaborador y actualiza el total', async () => {
    const { result } = renderHook(
      () => ({
        mutation: useDeleteCollaborator(EVENT_ID_1),
        list: useCollaborators(BASE_PARAMS),
      }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate(mockCollaborators[0].id)
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() =>
      expect(result.current.list.data?.meta.total).toBe(mockCollaborators.length - 1),
    )
  })
})
