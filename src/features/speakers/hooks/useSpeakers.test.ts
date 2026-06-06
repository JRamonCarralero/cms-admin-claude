import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { useSpeakers } from './useSpeakers'
import { useCreateSpeaker, useDeleteSpeaker } from './useSpeakerMutations'
import { resetSpeakerDb } from '../../../../mocks/handlers/speakers.handlers'
import { mockSpeakers, EVENT_ID_1 } from '../../../../mocks/data/speakers.mock'

const BASE_PARAMS = { eventId: EVENT_ID_1, page: 1, pageSize: 10 }

beforeEach(() => resetSpeakerDb())

describe('useSpeakers', () => {
  it('devuelve los ponentes del evento', async () => {
    const { result } = renderHook(() => useSpeakers(BASE_PARAMS), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(mockSpeakers.length)
  })
})

describe('useCreateSpeaker', () => {
  it('crea un ponente y actualiza la lista', async () => {
    const { result } = renderHook(
      () => ({ mutation: useCreateSpeaker(EVENT_ID_1), list: useSpeakers(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate({
        person_id: 'p0000001-0000-0000-0000-000000000001',
        bio: 'Developer',
        company: 'GDG',
      })
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockSpeakers.length + 1))
  })
})

describe('useDeleteSpeaker', () => {
  it('elimina un ponente y actualiza el total', async () => {
    const { result } = renderHook(
      () => ({ mutation: useDeleteSpeaker(EVENT_ID_1), list: useSpeakers(BASE_PARAMS) }),
      { wrapper: createWrapper() },
    )
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    await act(async () => {
      result.current.mutation.mutate(mockSpeakers[0].id)
    })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.list.data?.meta.total).toBe(mockSpeakers.length - 1))
  })
})
