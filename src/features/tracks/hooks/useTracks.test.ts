import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { useTracks } from './useTracks'
import { useCreateTrack, useUpdateTrack, useDeleteTrack } from './useTrackMutations'
import { resetTrackDb } from '../../../../mocks/handlers/tracks.handlers'
import { mockTracks, EVENT_ID_1 } from '../../../../mocks/data/tracks.mock'

const BASE_PARAMS = { eventId: EVENT_ID_1, page: 1, pageSize: 10 }

beforeEach(() => resetTrackDb())

describe('useTracks', () => {
  it('devuelve los tracks del evento', async () => {
    const { result } = renderHook(() => useTracks(BASE_PARAMS), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(mockTracks.length)
  })
})

describe('useCreateTrack', () => {
  it('crea un track y actualiza la lista', async () => {
    const { result } = renderHook(
      () => ({ mutation: useCreateTrack(EVENT_ID_1), list: useTracks(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({ name: 'Lightning Talks', event_date: '2024-11-15' })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockTracks.length + 1))
  })
})

describe('useUpdateTrack', () => {
  it('actualiza el nombre de un track', async () => {
    const { result } = renderHook(
      () => ({ mutation: useUpdateTrack(EVENT_ID_1), list: useTracks(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({ id: mockTracks[0].id, data: { name: 'Keynote Stage' } })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => {
      const updated = result.current.list.data?.data.find((t) => t.id === mockTracks[0].id)
      expect(updated?.name).toBe('Keynote Stage')
    })
  })
})

describe('useDeleteTrack', () => {
  it('elimina un track y actualiza el total', async () => {
    const { result } = renderHook(
      () => ({ mutation: useDeleteTrack(EVENT_ID_1), list: useTracks(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate(mockTracks[0].id)
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockTracks.length - 1))
  })
})
