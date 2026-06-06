import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { usePersons } from './usePersons'
import { resetPersonDb } from '../../../../mocks/handlers/persons.handlers'
import { mockPersons } from '../../../../mocks/data/persons.mock'

beforeEach(() => resetPersonDb())

describe('usePersons', () => {
  it('devuelve la lista paginada de personas', async () => {
    const { result } = renderHook(() => usePersons({ page: 1, pageSize: 10 }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(mockPersons.length)
    expect(result.current.data?.meta.total).toBe(mockPersons.length)
  })

  it('filtra por nombre', async () => {
    const { result } = renderHook(() => usePersons({ page: 1, pageSize: 10, search: 'ana' }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.data[0].first_name).toBe('Ana')
  })

  it('filtra por email', async () => {
    const { result } = renderHook(
      () => usePersons({ page: 1, pageSize: 10, search: 'carlos.martinez' }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(1)
  })

  it('respeta la paginación', async () => {
    const { result } = renderHook(() => usePersons({ page: 1, pageSize: 2 }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(2)
    expect(result.current.data?.meta.total).toBe(mockPersons.length)
  })
})
