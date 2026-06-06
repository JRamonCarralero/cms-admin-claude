import type { TrackResponse } from '@/types/api'
import { EVENT_ID_1 } from './collaborators.mock'

export { EVENT_ID_1 }

export const mockTracks: TrackResponse[] = [
  {
    id: 'trk-0001-0000-0000-0000-000000000001',
    event_id: EVENT_ID_1,
    name: 'Main Stage',
    event_date: '2024-11-15',
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    id: 'trk-0002-0000-0000-0000-000000000002',
    event_id: EVENT_ID_1,
    name: 'Workshop Room',
    event_date: '2024-11-15',
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
]
