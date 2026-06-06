import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { useSponsors } from './useSponsors'
import { useCreateSponsor, useDeleteSponsor } from './useSponsorMutations'
import { resetSponsorDb } from '../../../../mocks/handlers/sponsors.handlers'
import { mockSponsors, EVENT_ID_1 } from '../../../../mocks/data/sponsors.mock'

const BASE_PARAMS = { eventId: EVENT_ID_1, page: 1, pageSize: 10 }

beforeEach(() => resetSponsorDb())

describe('useSponsors', () => {
  it('devuelve los patrocinadores del evento', async () => {
    const { result } = renderHook(() => useSponsors(BASE_PARAMS), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(mockSponsors.length)
  })
})

describe('useCreateSponsor', () => {
  it('crea un patrocinador y actualiza la lista', async () => {
    const { result } = renderHook(
      () => ({ mutation: useCreateSponsor(EVENT_ID_1), list: useSponsors(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({
        name: 'GitHub',
        logo_url: 'https://logo.clearbit.com/github.com',
        website_url: 'https://github.com',
        tier: 'bronze',
        order_priority: 4,
      })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockSponsors.length + 1))
  })
})

describe('useDeleteSponsor', () => {
  it('elimina un patrocinador y actualiza el total', async () => {
    const { result } = renderHook(
      () => ({ mutation: useDeleteSponsor(EVENT_ID_1), list: useSponsors(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate(mockSponsors[0].id)
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockSponsors.length - 1))
  })
})
