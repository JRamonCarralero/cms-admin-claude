import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { usePersons } from './usePersons'
import { useCreatePerson, useUpdatePerson, useDeletePerson } from './usePersonMutations'
import { resetPersonDb } from '../../../../mocks/handlers/persons.handlers'
import { mockPersons } from '../../../../mocks/data/persons.mock'

beforeEach(() => resetPersonDb())

describe('useCreatePerson', () => {
  it('crea una persona y actualiza la lista', async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(
      () => ({
        mutation: useCreatePerson(),
        list: usePersons({ page: 1, pageSize: 20 }),
      }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))
    expect(result.current.list.data?.meta.total).toBe(mockPersons.length)

    await act(async () => {
      result.current.mutation.mutate({
        first_name: 'Nuevo',
        last_name: 'Ponente',
        email: 'nuevo.ponente@test.com',
      })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockPersons.length + 1))
  })
})

describe('useUpdatePerson', () => {
  it('actualiza una persona y refleja el cambio en la lista', async () => {
    const wrapper = createWrapper()
    const target = mockPersons[0]

    const { result } = renderHook(
      () => ({
        mutation: useUpdatePerson(),
        list: usePersons({ page: 1, pageSize: 20 }),
      }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({
        id: target.id,
        data: { first_name: 'Modificado', last_name: target.last_name },
      })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => {
      const updated = result.current.list.data?.data.find((p) => p.id === target.id)
      expect(updated?.first_name).toBe('Modificado')
    })
  })
})

describe('useDeletePerson', () => {
  it('elimina una persona y actualiza el total', async () => {
    const wrapper = createWrapper()
    const target = mockPersons[2]

    const { result } = renderHook(
      () => ({
        mutation: useDeletePerson(),
        list: usePersons({ page: 1, pageSize: 20 }),
      }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))
    expect(result.current.list.data?.meta.total).toBe(mockPersons.length)

    await act(async () => {
      result.current.mutation.mutate(target.id)
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockPersons.length - 1))

    expect(result.current.list.data?.data.find((p) => p.id === target.id)).toBeUndefined()
  })
})
