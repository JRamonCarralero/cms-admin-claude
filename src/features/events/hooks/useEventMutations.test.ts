import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from './useEventMutations'
import { useEvents } from './useEvents'
import { resetEventDb } from '../../../../mocks/handlers/events.handlers'
import { mockEvents } from '../../../../mocks/data/events.mock'

beforeEach(() => resetEventDb())

describe('useCreateEvent', () => {
  it('añade un evento y la lista se actualiza', async () => {
    // Renderizamos ambos hooks en el MISMO árbol para compartir caché
    const { result } = renderHook(
      () => ({
        create: useCreateEvent(),
        list: useEvents({ page: 1, pageSize: 10 }),
      }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))
    expect(result.current.list.data?.meta.total).toBe(mockEvents.length)

    act(() => {
      result.current.create.mutate({ name: 'Nuevo evento', slug: 'nuevo-evento', is_active: true })
    })

    await waitFor(() => expect(result.current.create.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockEvents.length + 1))
  })
})

describe('useUpdateEvent', () => {
  it('actualiza el nombre de un evento', async () => {
    const { result } = renderHook(
      () => ({
        update: useUpdateEvent(),
        list: useEvents({ page: 1, pageSize: 10 }),
      }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    act(() => {
      result.current.update.mutate({ id: mockEvents[0].id, data: { name: 'Nombre actualizado' } })
    })

    await waitFor(() => expect(result.current.update.isSuccess).toBe(true))
    await waitFor(() => {
      const updated = result.current.list.data?.data.find((e) => e.id === mockEvents[0].id)
      expect(updated?.name).toBe('Nombre actualizado')
    })
  })
})

describe('useDeleteEvent', () => {
  it('elimina un evento de la lista', async () => {
    const { result } = renderHook(
      () => ({
        del: useDeleteEvent(),
        list: useEvents({ page: 1, pageSize: 10 }),
      }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))
    expect(result.current.list.data?.meta.total).toBe(mockEvents.length)

    act(() => {
      result.current.del.mutate(mockEvents[0].id)
    })

    await waitFor(() => expect(result.current.del.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockEvents.length - 1))
  })
})
