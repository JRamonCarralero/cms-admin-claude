import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test-utils'
import { useEventSummary } from './useEventSummary'
import { resetEventDb } from '../../../../mocks/handlers/events.handlers'
import { resetCollaboratorDb } from '../../../../mocks/handlers/collaborators.handlers'
import { resetDeveloperDb } from '../../../../mocks/handlers/developers.handlers'
import { resetOrganizerDb } from '../../../../mocks/handlers/organizers.handlers'
import { resetSpeakerDb } from '../../../../mocks/handlers/speakers.handlers'
import { resetSponsorDb } from '../../../../mocks/handlers/sponsors.handlers'
import { resetTrackDb } from '../../../../mocks/handlers/tracks.handlers'
import { mockCollaborators, EVENT_ID_1 } from '../../../../mocks/data/collaborators.mock'
import { mockDevelopers } from '../../../../mocks/data/developers.mock'
import { mockOrganizers } from '../../../../mocks/data/organizers.mock'
import { mockSpeakers } from '../../../../mocks/data/speakers.mock'
import { mockSponsors } from '../../../../mocks/data/sponsors.mock'
import { mockTracks } from '../../../../mocks/data/tracks.mock'

beforeEach(() => {
  resetEventDb()
  resetCollaboratorDb()
  resetDeveloperDb()
  resetOrganizerDb()
  resetSpeakerDb()
  resetSponsorDb()
  resetTrackDb()
})

describe('useEventSummary', () => {
  it('devuelve los contadores correctos para cada sub-recurso', async () => {
    const { result } = renderHook(() => useEventSummary(EVENT_ID_1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.collaborators).not.toBeNull()
      expect(result.current.developers).not.toBeNull()
      expect(result.current.organizers).not.toBeNull()
      expect(result.current.speakers).not.toBeNull()
      expect(result.current.sponsors).not.toBeNull()
      expect(result.current.tracks).not.toBeNull()
    })

    expect(result.current.collaborators).toBe(mockCollaborators.length)
    expect(result.current.developers).toBe(mockDevelopers.length)
    expect(result.current.organizers).toBe(mockOrganizers.length)
    expect(result.current.speakers).toBe(mockSpeakers.length)
    expect(result.current.sponsors).toBe(mockSponsors.length)
    expect(result.current.tracks).toBe(mockTracks.length)
  })

  it('devuelve null para un evento sin sub-recursos', async () => {
    const { result } = renderHook(() => useEventSummary('no-event'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.collaborators !== undefined)

    // Todos devuelven 0 para un evento sin datos
    await waitFor(() => {
      expect(result.current.collaborators).toBe(0)
      expect(result.current.speakers).toBe(0)
    })
  })
})
